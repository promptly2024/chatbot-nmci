import ChatWindow from '@/components/ChatWindow';
import React from 'react'

type PageProps = {
    params: Promise<{ id: string }>
}

const ChatId = async ({ params }: PageProps) => {
    const { id: chatId } = await params;
    return (
        <ChatWindow newChat={false} chatroomId={chatId} />
    )
}

export default ChatId
