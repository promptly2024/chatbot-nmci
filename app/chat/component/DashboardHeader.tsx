'use client';

import React from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

interface ChatSession {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export function DashboardHeader({ chatSessions }: { chatSessions: ChatSession[] }) {
    const pathname = usePathname();

    // The path will be '/chat/[id]'
    const chatId = pathname.split('/').pop();
    const chatSession = chatSessions.find((session) => session.id === chatId);
    // show name instead of ID
    const chatName = chatSession ? chatSession.title : 'Chat';

    // Generate breadcrumbs based on current path
    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        for (let i = 0; i < paths.length; i++) {
            const path = '/' + paths.slice(0, i + 1).join('/');
            let name =
                paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace('-', ' ');

            // If last segment is chat ID, show chat name instead
            if (
                i === paths.length - 1 &&
                paths[0] === 'chat' &&
                chatSession
            ) {
                name = chatSession.title;
            }

            breadcrumbs.push({
                name,
                path,
                isLast: i === paths.length - 1,
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" title="Toggle sidebar (Ctrl + B)" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && (
                                    <BreadcrumbSeparator className="hidden md:block" />
                                )}
                                <BreadcrumbItem
                                    className={index === 0 ? 'hidden md:block' : ''}
                                >
                                    {crumb.isLast ? (
                                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={crumb.path}>
                                            {crumb.name}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}