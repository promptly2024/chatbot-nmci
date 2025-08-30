"use client";
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react';
import { Toaster } from './ui/sonner';

const SessionWrapper = ({ children }) => (
    <SessionProvider>
        <Toaster />
        {children}
    </SessionProvider>
);

export default SessionWrapper;