// app/api/chat/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chat/chat.service";
import { getSessionAtHome } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
    try {
        const session = await getSessionAtHome();
        if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const id = req.nextUrl.pathname.split("/").pop();
        if (!id) return NextResponse.json({ success: false, message: "Chatroom Id required" }, { status: 400 });

        const messages = await ChatService.fetchMessages(id);
        return NextResponse.json({ success: true, messages });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSessionAtHome();
        if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const id = req.nextUrl.pathname.split("/").pop();
        const { content, newChat } = await req.json() as { content: string; newChat: boolean };
        if (!id) return NextResponse.json({ success: false, message: "Chatroom Id required" }, { status: 400 });
        if (!content) return NextResponse.json({ success: false, message: "Content required" }, { status: 400 });

        const result = await ChatService.handleUserMessage({
            chatSessionId: newChat ? undefined : id,
            content,
            newChat,
            userId: session.user.id,
        });

        return NextResponse.json({
            success: true,
            ...result,
            chatSessionId: result.sessionId,
            messages: result.messages,
            replyMessage: result.replyMessage,
            message: "Message sent successfully",
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}