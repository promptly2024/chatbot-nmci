// lib/chat/chat.repository.ts
import prisma from "@/lib/db";

export const ChatRepository = {
    getMessagesBySessionId: (chatSessionId: string) =>
        prisma.chatMessage.findMany({ where: { chatSessionId } }),

    getLastMessages: (chatSessionId: string, take: number) =>
        prisma.chatMessage.findMany({
            where: { chatSessionId },
            orderBy: { createdAt: "desc" },
            take,
        }),

    createMessage: (data: { content: string; role: "USER" | "ASSISTANT"; chatSessionId: string }) => {
        return prisma.chatMessage.create({ data });
    },

    createChatSession: (userId: string, title: string) =>
        prisma.chatSession.create({ data: { userId, title } }),
};
