// src/app/dashboard/layout.tsx
import type React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './component/Sidebar';
import { DashboardHeader } from './component/DashboardHeader';
import prisma from '@/lib/db';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const getChatSession = async () => {
    const chatSessions = await prisma.chatSession.findMany();
    return chatSessions;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const chatSessions = await getChatSession();
    return (
        <SidebarProvider>
            < div className="flex min-h-screen w-full" >
                <AppSidebar chatSessions={chatSessions} />
                <SidebarInset className="flex-1">
                    <DashboardHeader chatSessions={chatSessions} />
                    <main className="flex-1 p-4 md:p-6">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
