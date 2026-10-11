import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationType } from '@/types';

export const STATIC_NOTIFICATIONS: NotificationType[] = [
    {
        id: "notif-coming-soon",
        title: "Smart Push & Due Alerts",
        message: "Smart on-device reminders and notifications are landing soon. Never miss an upcoming payment — 100% offline with zero cloud servers.",
        date: "Roadmap",
        category: "upcoming",
        badgeText: "Coming Soon",
        actionHref: "/settings",
        actionLabel: "Preview Roadmap",
    },
    {
        id: "notif-bills-subs",
        title: "Bills & Subscriptions Trackers",
        message: "Keep tabs on rent, utility bills, and services like Netflix or Spotify with instant 1-tap paid toggles and due countdowns.",
        date: "v1.2.0",
        category: "feature",
        badgeText: "New Feature",
        actionHref: "/bills",
        actionLabel: "Explore Bills",
    },
    {
        id: "notif-keyboard-access",
        title: "Full Keyboard Navigation",
        message: "Fly through Cashbook with Tab, Arrow keys, Enter, and Space — navigate category grids and log transactions without a mouse.",
        date: "v1.2.0",
        category: "improvement",
        badgeText: "Productivity",
        actionHref: "/newtransaction",
        actionLabel: "Try Keyboard Flow",
    },
    {
        id: "notif-offline-privacy",
        title: "100% Offline & Private Storage",
        message: "Your financial records stay exclusively on your device. Zero external servers, zero telemetry, and complete privacy by design.",
        date: "Security",
        category: "privacy",
        badgeText: "Local Only",
        actionHref: "/settings",
        actionLabel: "Check Storage Size",
    },
    {
        id: "notif-multi-currency",
        title: "20+ Currencies & Smart Budgets",
        message: "Switch across global currencies with instant conversions, and set monthly expense caps with proactive threshold warnings.",
        date: "v1.1.0",
        category: "feature",
        badgeText: "Global & Smart",
        actionHref: "/settings",
        actionLabel: "Set Currency & Budget",
    },
];

interface NotificationState {
    readIds: string[];
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    isRead: (id: string) => boolean;
    getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            readIds: [],

            markAsRead: (id: string) => {
                const current = get().readIds;
                if (!current.includes(id)) {
                    set({ readIds: [...current, id] });
                }
            },

            markAllAsRead: () => {
                const allIds = STATIC_NOTIFICATIONS.map(n => n.id);
                set({ readIds: allIds });
            },

            isRead: (id: string) => {
                return get().readIds.includes(id);
            },

            getUnreadCount: () => {
                const read = get().readIds;
                return STATIC_NOTIFICATIONS.filter(n => !read.includes(n.id)).length;
            },
        }),
        {
            name: "cashbook-notifications-storage",
        }
    )
);
