import { getSessionAtHome } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
        if (!id) { return NextResponse.json({ message: "Chatroom Id is required", success: false }, { status: 400 }); }

        const { content } = await request.json();
        if (!content) { return NextResponse.json({ message: "Message content is required", success: false }, { status: 400 }); }

        const messages = await prisma.chatMessage.create({
            data: {
                content,
                chatSessionId: id,
                role: "USER",
            },
        });

        return NextResponse.json({ messages, message: "Message sent successfully", success: true }, { status: 200 });
    }
    catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ message: "An error occurred while sending the message", success: false }, { status: 500 });
    }
}