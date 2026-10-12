"use client"

import Link from "next/link";
import SettingsIcon from "@/assets/settings.png";
import Image from "next/image";
import { BellIcon } from "@/components/icons";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect, useState } from "react";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const unreadCount = useNotificationStore(state => state.getUnreadCount());

    useEffect(() => {
        setMounted(true);
    }, []);

    // Show unread indicator dot if there are unread notifications
    const showDot = mounted ? unreadCount > 0 : true;

    return (
        <header className="flex items-center justify-between w-full px-8 py-4 mx-auto bg-white dark:bg-slate-950 text-black dark:text-white transition-colors duration-200">
            <Link href="/dashboard" className="font-extrabold uppercase text-[1.2rem] tracking-wider py-1">kaayi</Link>
            <div className="flex items-center gap-3">
                <Link 
                    href="/notifications" 
                    className="relative p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Notifications ${mounted && unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                >
                    <BellIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={2} />
                    {showDot && (
                        <span 
                            className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse" 
                            aria-hidden="true"
                        />
                    )}
                </Link>
                <Link 
                    href="/settings"
                    className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Settings"
                >
                    <Image src={SettingsIcon} alt="settings" width="22" height="22" className="dark:invert opacity-80 hover:opacity-100 transition-opacity" />
                </Link>
            </div>
        </header>
    );
}