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
    ZapIcon,
    ReceiptIcon
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
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
                        <BellIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "feature":
                return (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-500/15 to-indigo-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-900/60 shadow-xs">
                        <SparklesIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "privacy":
                return (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
                        <ShieldCheckIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "improvement":
            default:
                return (
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
                        <ZapIcon className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
        }
    };

    const getBadgeStyle = (category: NotificationType["category"]) => {
        switch (category) {
            case "upcoming":
                return "bg-amber-100/80 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/70 dark:border-amber-900/50";
            case "feature":
                return "bg-purple-100/80 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/70 dark:border-purple-900/50";
            case "privacy":
                return "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-900/50";
            case "improvement":
            default:
                return "bg-blue-100/80 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/70 dark:border-blue-900/50";
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

                {/* Filter Tabs */}
                <div className="w-[90%] max-w-md mx-auto mt-2 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.06s' }}>
                    <div 
                        role="tablist"
                        aria-label="Filter notifications"
                        className="inline-flex items-center justify-between w-full p-1 rounded-2xl bg-gray-200/60 dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800"
                    >
                        {(["all", "updates", "upcoming"] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                    activeTab === tab 
                                        ? 'text-white bg-black dark:text-black dark:bg-white shadow-xs' 
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "all" ? `All (${STATIC_NOTIFICATIONS.length})` : tab === "updates" ? "✨ Features" : "⚡️ Roadmap"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications Feed */}
                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-8 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((item, index) => {
                            const isItemRead = mounted ? isRead(item.id) : false;
                            const isUpcoming = item.category === "upcoming";

                            return (
                                <article
                                    key={item.id}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${item.title}, ${item.badgeText}, ${isItemRead ? 'Read' : 'Unread'}`}
                                    onClick={() => markAsRead(item.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            markAsRead(item.id);
                                        }
                                    }}
                                    className={`group relative flex flex-col p-5 sm:p-5.5 rounded-3xl transition-all duration-300 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                                        isUpcoming
                                            ? 'bg-gradient-to-br from-amber-500/[0.05] via-white to-orange-500/[0.03] dark:from-amber-950/25 dark:via-slate-900 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/50 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                            : isItemRead
                                            ? 'bg-white/85 dark:bg-slate-900/70 border-gray-100 dark:border-slate-800/80 shadow-xs hover:shadow-sm'
                                            : 'bg-white dark:bg-slate-900 border-blue-200/70 dark:border-blue-900/50 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                    style={{ animationDelay: `${0.04 * (index + 1)}s` }}
                                >
                                    {/* Top Row: Icon, Category Badge, Date & Unread Status */}
                                    <div className="flex items-start justify-between gap-3 w-full">
                                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                            {getCategoryIcon(item.category)}
                                            
                                            <div className="flex flex-col min-w-0 flex-1 pt-0.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyle(item.category)}`}>
                                                        {item.badgeText}
                                                    </span>
                                                    <span className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500">
                                                        {item.date}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-[15.5px] sm:text-[16px] text-gray-900 dark:text-white leading-snug mt-1.5 tracking-tight">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Status indicator */}
                                        <div className="shrink-0 pt-1">
                                            {!isItemRead ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                    New
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-400 transition-colors" title="Read">
                                                    <SolidCheckIcon className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <p className="text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed mt-3 pl-0.5">
                                        {item.message}
                                    </p>

                                    {/* Charismatic Footer & Interactive Action */}
                                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100/90 dark:border-slate-800/70 text-xs">
                                        {item.actionHref && item.actionLabel ? (
                                            <Link 
                                                href={item.actionHref}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(item.id);
                                                }}
                                                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white bg-gray-100/80 hover:bg-gray-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                                            >
                                                <span>{item.actionLabel}</span>
                                                <span aria-hidden="true">→</span>
                                            </Link>
                                        ) : isUpcoming ? (
                                            <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                In active development
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                Cashbook Offline Feature
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item.id);
                                            }}
                                            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                        >
                                            {isItemRead ? "Read" : "Tap to mark read"}
                                        </button>
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
                                There are no notifications in this category. Check the "All" tab to see all updates.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-2xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                            >
                                View All Notifications
                            </button>
                        </div>
                    )}

                    {/* Local Privacy Reassurance Card */}
                    <div className="mt-2 p-4.5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 text-center shadow-xs">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                            <ShieldCheckIcon className="w-4 h-4" strokeWidth={2} />
                            <span>100% On-Device & Private</span>
                        </div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                            Cashbook operates locally without telemetry. Notifications run directly inside your browser and service worker with zero cloud dependencies.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
