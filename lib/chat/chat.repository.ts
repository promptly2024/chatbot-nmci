// lib/chat/chat.repository.ts
import prisma from "@/lib/db";
import { Metadata } from "@/types/metadata";

export const ChatRepository = {
    getMessagesBySessionId: (chatSessionId: string) =>
        prisma.chatMessage.findMany({ where: { chatSessionId } }),

    getLastMessages: (chatSessionId: string, take: number) =>
        prisma.chatMessage.findMany({
            where: { chatSessionId },
            orderBy: { createdAt: "desc" },
            take,
        }),

    createMessage: (data: { content: string; role: "USER" | "ASSISTANT"; chatSessionId: string; metadata?: Metadata }) => {
        return prisma.chatMessage.create({
            data: {
                ...data,
                metadata: JSON.parse(JSON.stringify(data.metadata === undefined ? { type: "none", data: {} } : data.metadata))
            }
        });
    },

    createChatSession: (userId: string, title: string) =>
        prisma.chatSession.create({ data: { userId, title } }),
};
