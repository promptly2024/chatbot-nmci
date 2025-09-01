/* eslint-disable @next/next/no-async-client-component */
// "use client";
import ChatWindow from '@/components/ChatWindow';
import React from 'react'

const ChatId = async ({ params }: { params: { id: string } }) => {
    const awaitedParams = await params;
    const chatId = awaitedParams.id;
    return (
        // <div className='h-screen'>
            <ChatWindow newChat={false} chatroomId={chatId} />
        // </div>
    )
}

export default ChatId
