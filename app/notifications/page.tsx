"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { 
    BellIcon, 
    SparklesIcon, 
    ShieldCheckIcon, 
    SolidCheckIcon,
    ZapIcon
} from "@/components/icons";
import { useNotificationStore, STATIC_NOTIFICATIONS } from "@/store/notificationStore";
import { NotificationType } from "@/types";

export default function NotificationsPage() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "updates" | "upcoming">("all");
    const { readIds, markAsRead, markAllAsRead, isRead, getUnreadCount } = useNotificationStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const unreadCount = mounted ? getUnreadCount() : 0;

    const filteredNotifications = STATIC_NOTIFICATIONS.filter(item => {
        if (activeTab === "all") return true;
        if (activeTab === "upcoming") return item.category === "upcoming";
        if (activeTab === "updates") return item.category !== "upcoming";
        return true;
    });

    const getCategoryIcon = (category: NotificationType["category"]) => {
        switch (category) {
            case "upcoming":
                return (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
                        <BellIcon className="w-4 h-4" strokeWidth={2} />
                    </div>
                );
            case "feature":
                return (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/40">
                        <SparklesIcon className="w-4 h-4" strokeWidth={2} />
                    </div>
                );
            case "privacy":
                return (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40">
                        <ShieldCheckIcon className="w-4 h-4" strokeWidth={2} />
                    </div>
                );
            case "improvement":
            default:
                return (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                        <ZapIcon className="w-4 h-4" strokeWidth={2} />
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Notifications" 
                    badge={unreadCount > 0 ? `${unreadCount} New` : "All Caught Up"}
                    action={
                        mounted && unreadCount > 0 ? (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-gray-200/70 dark:border-slate-800 shadow-xs hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                Mark all read
                            </button>
                        ) : null
                    }
                />

                {/* Notifications Feed */}
                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-2.5 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((item, index) => {
                            const isItemRead = mounted ? isRead(item.id) : false;

                            return (
                                <article
                                    key={item.id}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${item.title}, ${isItemRead ? 'Read' : 'Unread'}`}
                                    onClick={() => markAsRead(item.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            markAsRead(item.id);
                                        }
                                    }}
                                    className={`group relative flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-200 cursor-pointer border select-none ${
                                        !isItemRead
                                            ? 'bg-white dark:bg-slate-900 border-blue-200/70 dark:border-blue-900/50 shadow-xs hover:border-blue-300 dark:hover:border-blue-800'
                                            : 'bg-white/70 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 shadow-none'
                                    }`}
                                    style={{ animationDelay: `${0.03 * (index + 1)}s` }}
                                >
                                    {/* Left Category Icon */}
                                    <div className="shrink-0 mt-0.5">
                                        {getCategoryIcon(item.category)}
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className={`text-[13.5px] font-semibold leading-snug truncate ${
                                                !isItemRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {item.title}
                                            </h3>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                    {item.date}
                                                </span>
                                                {!isItemRead ? (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Unread" />
                                                ) : (
                                                    <span className="text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-400 transition-colors" title="Read">
                                                        <SolidCheckIcon className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                            {item.message}
                                        </p>

                                        {item.actionHref && item.actionLabel && (
                                            <div className="mt-2.5 flex items-center">
                                                <Link 
                                                    href={item.actionHref}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(item.id);
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                                >
                                                    <span>{item.actionLabel}</span>
                                                    <span aria-hidden="true">→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-500 flex items-center justify-center mb-3">
                                <BellIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">All caught up! 🎉</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 max-w-xs">
                                There are no notifications to display.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
