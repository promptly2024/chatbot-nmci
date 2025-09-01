import { getSessionAtHome } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { generateGeminiResponse } from "@/utils/generateGeminiResponse";
import { NextRequest, NextResponse } from "next/server";

type GeminiResponse = {
    intent: "greeting" | "data_query" | "other";
    reply: string;
    title: string | null;
};

export async function GET(request: NextRequest) {
    try {
        const session = await getSessionAtHome();
        if (!session) { return NextResponse.json({ message: "You need to be logged in to access this resource", success: false }, { status: 401 }); }
        const id = request.nextUrl.pathname.split("/").pop();
        if (!id) { return NextResponse.json({ message: "Chatroom Id is required", success: false }, { status: 400 }); }

        const messages = await prisma.chatMessage.findMany({
            where: {
                chatSessionId: id,
            },
        });

        if (!messages) { return NextResponse.json({ message: "Messages not found", success: false }, { status: 404 }); }

        return NextResponse.json({ messages, message: "Messages fetched successfully", success: true }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ message: "An error occurred while fetching the messages", success: false }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSessionAtHome();
        if (!session) { return NextResponse.json({ message: "You need to be logged in to access this resource", success: false }, { status: 401 }); }
        const id = request.nextUrl.pathname.split("/").pop();

        const { content, newChat } = await request.json();
        if (!content) { return NextResponse.json({ message: "Message content is required", success: false }, { status: 400 }); }

        if (!id) { return NextResponse.json({ message: "Chatroom Id is required", success: false }, { status: 400 }); }

        let Last6Messages = [];
        let context: { senderRole: string, message: string }[] = [];
        if (!newChat) {
            Last6Messages = await prisma.chatMessage.findMany({
                where: {
                    chatSessionId: id,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 6,
            });
            context = Last6Messages.map((msg) => ({
                senderRole: msg.role,
                message: msg.content,
            }));
        }

        const prompt = `
        You are a helpful assistant for NMCI Business group, The admin will use you to know about various aspects of the business. First, classify the user message into one of these types:
            1. greeting (any general queries a user might have)
            2. data_query (means the user is asking something which I need to curate from my DB, related to my business like stats, user information, etc.)
            3. other (any other type of query unrelated to My business, but they want to ask it from AI, so it's upon you, if you have that knowledge or information then sure give them.)

        User message: "${content}"
        ${context.length > 0 ? `Context (last 6 messages of the chatroom): ${JSON.stringify(context)}` : ""}

        If it is a greeting or other, respond politely, if data_query (means the user is asking something which i need to curate from my DB, related to my business like stats, user information, etc.) then only intent and reply will be empty string.

        Respond only in JSON format like:{  "intent": "greeting",  "reply": "Hello! How can I help you today?, "  "title": "Chat Title that best suits this chat"}
        The response should include all three fields: intent, reply, and title in JSON format starting with "{" and ending with "}"`;
        const response = await generateGeminiResponse(prompt);
        console.log("\n\nGemini Response:", response);

        const text = response.trim().replace(/```json/g, "").replace(/```/g, "").trim();

        // 2. Parse JSON safely
        let geminiData: GeminiResponse;
        try {
            geminiData = JSON.parse(text);
        } catch (err) {
            console.error("Failed to parse GEMINI response:", err, text);
            geminiData = { intent: "other", reply: text, title: "" }; // fallback
        }
        const { intent, reply, title } = geminiData;
        let newId;
        if (newChat) {
            const chatSession = await prisma.chatSession.create({
                data: {
                    userId: session.user.id,
                    title: title || content.charAt(0).toUpperCase() + content.slice(1, 20),
                },
            });
            newId = chatSession.id;
        }
        const chatSessionId = newChat ? newId : id;
        if (!chatSessionId) {
            return NextResponse.json({ message: "Chatroom Id is required", success: false }, { status: 400 });
        }
        const messages = await prisma.chatMessage.create({
            data: {
                content,
                chatSessionId,
                role: "USER",
            },
        });

        let replyMessage;
        if (intent === "greeting" || intent === "other") {
            // Store message in DB and reply
            replyMessage = await prisma.chatMessage.create({
                data: {
                    content: reply,
                    chatSessionId: chatSessionId,
                    role: "ASSISTANT",
                },
            });
        } else if (intent === "data_query") {
            replyMessage = await prisma.chatMessage.create({
                data: {
                    content: "This is a data query, and I need more information to assist you.",
                    chatSessionId: chatSessionId,
                    role: "ASSISTANT",
                },
            });
        }

        return NextResponse.json({
            chatSessionId,
            messages,
            replyMessage,
            message: "Message sent successfully",
            success: true
        }, { status: 200 });
    }
    catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ message: "An error occurred while sending the message", success: false }, { status: 500 });
    }
}