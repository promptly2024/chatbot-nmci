// lib/chat/chat.types.ts
export type GeminiResponse = {
    intent: "greeting" | "data_query" | "other";
    reply: string;
    title: string | null;
};
