"use client";
import { SessionProvider } from 'next-auth/react'
import { Toaster } from './ui/sonner';

const SessionWrapper = ({ children }) => (
    <SessionProvider>
        <Toaster />
        {children}
    </SessionProvider>
);

export default SessionWrapper;