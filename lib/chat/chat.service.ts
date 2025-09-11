// lib/chat/chat.service.ts
import { generateGeminiResponse } from "@/utils/generateGeminiResponse";
import { ChatRepository } from "./chat.repository";
import { GeminiResponse } from "@/app/api/chatrooms/route";
import { buildApiSelectionPrompt, buildClassificationPrompt } from "../prompt";

export const ChatService = {
    async fetchMessages(chatSessionId: string) {
        return ChatRepository.getMessagesBySessionId(chatSessionId);
    },

    async handleUserMessage({ chatSessionId, content, newChat, userId }:
        { chatSessionId?: string; content: string; newChat: boolean; userId: string }) {

        let context: { senderRole: string, message: string }[] = [];
        if (!newChat && chatSessionId) {
            const lastMsgs = await ChatRepository.getLastMessages(chatSessionId, 6);
            context = lastMsgs.map(m => ({ senderRole: m.role, message: m.content }));
        }

        const prompt = buildClassificationPrompt(content, context);
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
        console.log('\n\nThe Gemini reply:\n\nIntent:', intent, '\nReply:', reply, '\nTitle:', title, '\n\n');

        let replyContent = geminiData.reply ||
            (geminiData.intent === "data_query"
                ? "This is a data query, and I need more information to assist you."
                : "I'm here to help with any questions you have.");

        if (intent === "data_query") {
            console.log("Data query detected. Further processing can be implemented here.");
            const apiSelection = await generateGeminiResponse(
                buildApiSelectionPrompt(content, context)
            );
            console.log("API Selection Response:", apiSelection);

            // again trim the response
            const apiText = apiSelection.trim().replace(/```json/g, "").replace(/```/g, "").trim();
            let apiData: {
                name: string;
                method: string;
                endpoint: string;
                pathParams: Record<string, string>;
                queryParams: Record<string, string>;
                body: string | null;
            } | null = null;
            try {
                apiData = JSON.parse(apiText);
                console.log("Parsed API Data:", apiData);
            } catch (err) {
                console.error("Failed to parse API selection response:", err, apiText);
                apiData = null;
            }
            // Here, you would typically call the selected API and get the actual data.
            // For now, we'll just log the selected API data.
            if (apiData) {
                console.log("\n\nSelected API Data:", apiData);
                replyContent = `${JSON.stringify(apiData, null, 2)}`;

                // Call the API here
            } else {
                console.log("No valid API data extracted.");
                replyContent = "(Note: Unable to determine the appropriate API to call.)\n\nPlease provide more details.";
            }
        }

        let sessionId = chatSessionId;
        if (newChat) {
            const newSession = await ChatRepository.createChatSession(
                userId,
                title || content.slice(0, 20)
            );
            sessionId = newSession.id;
        }

        const messages = await ChatRepository.createMessage({ content, chatSessionId: sessionId!, role: "USER" });

        const replyMessage = await ChatRepository.createMessage({
            content: replyContent,
            chatSessionId: sessionId!,
            role: "ASSISTANT",
        });

        return { sessionId, messages, replyMessage };
    },
};