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
You are a helpful assistant for NMCI Business group. Your task is to classify a user's message into one of three types and respond appropriately.

Classification rules:
1. greeting: general queries or salutations. Provide a polite reply.
2. data_query: questions that require fetching info from our database (e.g., stats, user info). In this case, set "reply" to an empty string.
3. other: unrelated queries; respond if you have knowledge.

Requirements for response:
- Respond only in JSON.
- JSON must have these keys: 
  "intent": string ("greeting", "data_query", or "other")
  "reply": string (empty if intent is "data_query")
  "title": string (short title describing the conversation)
- Use double quotes around all keys and string values.
- Do not add extra text, code blocks, or explanations.

User message: "${content}"
${context.length > 0 ? `Context (last 6 messages): ${JSON.stringify(context)}` : ""}

Example of correct output:
{
  "intent": "greeting",
  "reply": "Hello! How can I help you today?",
  "title": "User Greeting"
}
`;

        const response = await generateGeminiResponse(prompt);
        const text = response.trim().replace(/```json/g, "").replace(/```/g, "").trim();

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