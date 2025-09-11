// lib/api/apiRegistry.ts

export const API_REGISTRY = [
    {
        name: "getUserProfile",
        description: "Fetches user profile by userId",
        method: "GET",
        endpoint: "/api/users/:userId",
        queryParams: ["includeSessions"],
        pathParams: ["userId"],
        headers: ["Authorization"],
    },
    
    {
        name: "getChatMessages",
        description: "Fetches messages for a given chat session",
        method: "GET",
        endpoint: "/api/chat/:chatSessionId/messages",
        pathParams: ["chatSessionId"],
        headers: ["Authorization"],
    },
    {
        name: "createChatMessage",
        description: "Creates a new chat message in a session",
        method: "POST",
        endpoint: "/api/chat/:chatSessionId/messages",
        pathParams: ["chatSessionId"],
        body: { content: "string", role: "USER|ASSISTANT" },
        headers: ["Authorization", "Content-Type"],
    },
];
