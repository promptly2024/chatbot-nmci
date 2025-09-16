/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Send,
    Bot,
    User,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Metadata } from "@/types/metadata";
import RenderMessageWithMetadata from "./RenderMessageWithMetadata";

interface Message {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    chatSessionId: string;
    metadata?: Metadata;
    createdAt: string;
    isOptimistic?: boolean; // Flag for optimistic messages
    isLoading?: boolean; // Flag for loading state
}

interface ChatWindowProps {
    newChat: boolean;
    chatroomId: string | null;
}

export default function ChatWindow({ newChat, chatroomId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(chatroomId ? true : false);
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            if (!chatroomId) return;
            const response = await fetch(`/api/chatrooms/messages/${chatroomId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages || []);
            } else {
                toast.error(data.message || "Failed to fetch messages");
            }
        } catch (error: any) {
            toast.error("An error occurred while fetching messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatroomId) {
            setLoading(true);
            fetchMessages();
        }
    }, [chatroomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        const messageContent = newMessage.trim();
        const tempUserMessageId = `temp-user-${Date.now()}`;
        const tempAssistantMessageId = `temp-assistant-${Date.now()}`;
        
        setNewMessage("");
        setIsSending(true);

        // Add user message immediately to UI
        const optimisticUserMessage: Message = {
            id: tempUserMessageId,
            role: "USER",
            content: messageContent,
            chatSessionId: chatroomId ?? "12345678",
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        // Add optimistic user message
        setMessages(prev => [...prev, optimisticUserMessage]);

        // Add loading assistant message
        const loadingAssistantMessage: Message = {
            id: tempAssistantMessageId,
            role: "ASSISTANT",
            content: "Typing...",
            chatSessionId: chatroomId ?? "12345678",
            createdAt: new Date().toISOString(),
            isOptimistic: true,
            isLoading: true,
        };

        // Add assistant "typing" message after brief delay
        setTimeout(() => {
            setMessages(prev => [...prev, loadingAssistantMessage]);
        }, 500);

        try {
            const response = await fetch(`/api/chatrooms/messages/${chatroomId ?? "12345678"}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: messageContent,
                    newChat,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (newChat && data.chatSessionId) {
                    router.push(`/chat/${data.chatSessionId}`);
                }
                
                // Remove optimistic messages and add real ones
                setMessages(prev => {
                    // Remove optimistic messages
                    const withoutOptimistic = prev.filter(msg => !msg.isOptimistic);
                    
                    // Add real messages from server
                    const serverMessages = [data.messages, data.replyMessage].filter(Boolean);
                    return [...withoutOptimistic, ...serverMessages];
                });
                
            } else {
                toast.error(data.message || "Failed to send message");
                setNewMessage(messageContent);
                
                // Remove optimistic messages on error
                setMessages(prev => prev.filter(msg => !msg.isOptimistic));
            }
        } catch (error) {
            toast.error("An error occurred while sending message");
            setNewMessage(messageContent);
            
            // Remove optimistic messages on error
            setMessages(prev => prev.filter(msg => !msg.isOptimistic));
        } finally {
            setIsSending(false);
        }
    };

    // Rest of your component code remains the same...
    const formatTime = (timestamp: string | Date) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    };

    const groupMessagesByDate = (messages: Message[]) => {
        const groups: { [key: string]: Message[] } = {};

        messages.forEach((message) => {
            const dateKey = new Date(message.createdAt).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(message);
        });

        return Object.entries(groups).map(([date, msgs]) => ({
            date: new Date(date),
            messages: msgs,
        }));
    };

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Messages */}
            <ScrollArea className="flex-1 p-3 md:p-6" ref={scrollAreaRef}>
                <div className="max-w-4xl mx-auto space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                                <div className="animate-pulse absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-blue-300"></div>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">Loading conversation...</p>
                        </div>
                    ) : messageGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                                    <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Ready to Help!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                I'm your AI assistant. Ask me anything or start a conversation to get personalized help and insights.
                            </p>
                        </div>
                    ) : (
                        messageGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="space-y-4">
                                {/* Date separator */}
                                <div className="flex justify-center my-8">
                                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {formatDate(group.date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Messages for this date */}
                                <div className="space-y-4">
                                    {group.messages.map((message, index) => {
                                        const isOwn = message.role === "USER";
                                        const isOptimistic = message.isOptimistic;
                                        const isLoadingMsg = message.isLoading;
                                        
                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
                                            >
                                                <div
                                                    className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${isOwn ? "flex-row-reverse" : ""}`}
                                                >
                                                    {/* Avatar */}
                                                    <div className={`flex-shrink-0 ${isOwn ? "ml-2" : "mr-2"}`}>
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isOwn
                                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
                                                                : "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg"
                                                                } ${isOptimistic ? "opacity-70" : ""}`}
                                                        >
                                                            {isOwn ? <User size={16} /> : <Bot size={16} />}
                                                        </div>
                                                    </div>

                                                    {/* Message bubble */}
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className={`relative rounded-2xl px-4 py-3 shadow-sm ${isOwn
                                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-8"
                                                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mr-8"
                                                                } ${isOptimistic ? "opacity-70" : ""}`}
                                                        >
                                                            {/* Assistant label */}
                                                            {!isOwn && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                                                        NMCI Assistant
                                                                    </span>
                                                                    <div className={`w-2 h-2 rounded-full ${isLoadingMsg ? "bg-yellow-400 animate-pulse" : "bg-green-400 animate-pulse"}`}></div>
                                                                </div>
                                                            )}

                                                            {/* Message content */}
                                                            <div className="prose dark:prose-invert max-w-none">
                                                                {isOwn ? (
                                                                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                        {message.content}
                                                                        {isOptimistic && (
                                                                            <span className="ml-2 text-blue-200 text-xs">Sending...</span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-sm leading-relaxed">
                                                                        {isLoadingMsg ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="flex gap-1">
                                                                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                                                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                                                </div>
                                                                                <span className="text-gray-500 text-xs">AI is thinking...</span>
                                                                            </div>
                                                                        ) : (
                                                                            <RenderMessageWithMetadata
                                                                                content={message.content}
                                                                                metadata={message.metadata}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Timestamp */}
                                                            <div
                                                                className={`flex items-center justify-end mt-2 ${isOwn
                                                                    ? "text-blue-100"
                                                                    : "text-gray-500 dark:text-gray-400"
                                                                    }`}
                                                            >
                                                                <span className="text-xs opacity-75">
                                                                    {formatTime(message.createdAt)}
                                                                </span>
                                                            </div>

                                                            {/* Message tail */}
                                                            <div
                                                                className={`absolute top-4 w-0 h-0 ${isOwn
                                                                    ? "-right-2 border-l-8 border-l-blue-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                                                                    : "-left-2 border-r-8 border-r-white dark:border-r-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto p-4">
                    <form onSubmit={sendMessage} className="flex items-center gap-3">
                        {/* Message input container */}
                        <div className="flex-1 relative">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Ask me anything..."
                                disabled={isSending}
                                className="pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                            />
                        </div>

                        {/* Send button */}
                        <Button
                            type="submit"
                            disabled={!newMessage.trim() || isSending}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-2xl px-6 transition-all duration-200 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Sending
                                </div>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}