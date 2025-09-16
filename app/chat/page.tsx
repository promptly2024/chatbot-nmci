/* eslint-disable @next/next/no-async-client-component */
// "use client";
import ChatWindow from '@/components/ChatWindow';
import React from 'react'

const ChatId = async () => {
    return (
        <ChatWindow newChat={true} chatroomId={null} />
    )
}

export default ChatId
