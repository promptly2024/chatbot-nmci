/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Paperclip,
    Smile,
    Send,
    Mic,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    chatSessionId: string;
    metadata?: {
        [key: string]: any;
    };
    createdAt: string;
}

interface ChatWindowProps {
    chatroomId: string;
}

export default function ChatWindow({ chatroomId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
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
        if (!newMessage.trim()) return;

        const messageContent = newMessage.trim();
        setNewMessage("");

        try {
            const response = await fetch(`/api/chatrooms/messages/${chatroomId}`, {
                method: "POST",
                body: JSON.stringify({ content: messageContent }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prev) => [...prev, data.messages]);
            } else {
                toast.error(data.message || "Failed to send message");
                setNewMessage(messageContent);
            }
        } catch (error) {
            toast.error("An error occurred while sending message");
            setNewMessage(messageContent);
        }
    };

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
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : messageGroups.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                No messages yet. Start the conversation!
                            </p>
                        </div>
                    ) : (
                        messageGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                {/* Date separator */}
                                <div className="flex justify-center my-4">
                                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 shadow-sm">
                                        {formatDate(group.date)}
                                    </span>
                                </div>

                                {/* Messages for this date */}
                                {group.messages.map((message, index) => {
                                    const isOwn = message.role === "USER";
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isOwn ? "justify-end" : "justify-start"
                                                } mb-2`}
                                        >
                                            <div
                                                className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse" : ""
                                                    }`}
                                            >
                                                <div
                                                    className={`px-3 py-2 rounded-lg ${isOwn
                                                        ? "bg-green-500 text-white"
                                                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                                        }`}
                                                >
                                                    {!isOwn && (
                                                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                                                            Assistant
                                                        </p>
                                                    )}
                                                    <p className="text-sm break-words">
                                                        {message.content}
                                                    </p>
                                                    <div
                                                        className={`flex items-center justify-end gap-1 mt-1 ${isOwn
                                                            ? "text-green-100"
                                                            : "text-gray-500 dark:text-gray-400"
                                                            }`}
                                                    >
                                                        <span className="text-xs">
                                                            {formatTime(message.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 dark:text-gray-400"
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message"
                            className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                        >
                            <Smile className="h-4 w-4" />
                        </Button>
                    </div>

                    {newMessage.trim() ? (
                        <Button
                            type="submit"
                            size="icon"
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <Mic className="h-5 w-5" />
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}