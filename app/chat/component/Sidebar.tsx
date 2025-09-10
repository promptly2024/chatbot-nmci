/* eslint-disable react/no-unescaped-entities */
'use client';

import {
    ChevronDown,
    LogOut,
    Settings,
    MessageSquare,
    User,
    Search,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@radix-ui/react-separator';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import Link from 'next/link';

interface ChatSession {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export function AppSidebar({ chatSessions }: { chatSessions: ChatSession[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const NMCILogo = 'http://nmci.co.in/wp-content/uploads/2023/01/NMCI-Logo-1.png';

    useEffect(() => {
        if (status !== 'loading' && status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed');
        }
    };

    useEffect(() => {
        chatSessions.map((session) => {
            router.prefetch(`/chat/${session.id}`);
        });
    }, [chatSessions, router]);

    const handleSearch = () => {
        // Implement your search logic here
        toast.info('Search button clicked');
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <img src={NMCILogo} alt="Logo" className="h-6 w-6" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Chatbot</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Ask anything related to NMCI
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator className="my-2" />
            {/* New Chat Button */}
            <div className="px-4 py-2">
                <div className="w-full flex items-center gap-2">
                    <button
                        className="flex flex-1 items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:cursor-pointer bg-tertiary/90 transition"
                        onClick={() => router.push('/chat')}
                    >
                        <MessageSquare />
                        <span>New Chat</span>
                    </button>
                    <button
                        className="flex items-center px-2 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-tertiary/80 transition ml-2"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <Search />
                    </button>
                </div>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {chatSessions.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild isActive={pathname === `/chat/${item.id}`}>
                                        <div>
                                            <a href={`/chat/${item.id}`}
                                                className='flex items-center gap-2 p-2 hover:bg-muted cursor-pointer'>
                                                <span>{item.title}</span>
                                            </a>
                                            {/* ... 3 dots for secondary actions like delete , archive edit */}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Settings />
                                            <span>Account</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <a href="/user/dashboard/profile">
                                                        <User />
                                                        <span>Profile</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <a href="/user/dashboard/security">
                                                        <Settings />
                                                        <span>Security</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {status === 'authenticated' && session.user && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={session?.user.image} alt={session?.user.name} />
                                            <AvatarFallback className="rounded-lg">
                                                {session?.user.name}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {session?.user.name}
                                            </span>
                                            <span className="truncate text-xs">{session?.user.email}</span>
                                        </div>
                                        <ChevronDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem asChild>
                                        <a href="/user/dashboard/profile">
                                            <User />
                                            Profile
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/user/dashboard/settings">
                                            <Settings />
                                            Settings
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
