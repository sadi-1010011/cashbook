import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationType } from '@/types';

export const STATIC_NOTIFICATIONS: NotificationType[] = [
    {
        id: "notif-bills-subs",
        title: "Bills & Subscriptions Trackers",
        message: "Track recurring bills and subscriptions with instant 1-tap paid toggles and countdowns.",
        date: "v1.2.0",
        category: "feature",
        badgeText: "New",
        actionHref: "/bills",
        actionLabel: "View Bills",
    },
    {
        id: "notif-keyboard-access",
        title: "Full Keyboard Navigation",
        message: "Fly through Cashbook with Tab, Arrow keys, Enter, and Space to log expenses faster.",
        date: "v1.2.0",
        category: "improvement",
        badgeText: "Update",
        actionHref: "/newtransaction",
        actionLabel: "Try Flow",
    },
    {
        id: "notif-multi-currency",
        title: "8 Currencies & Smart Budgets",
        message: "Convert between 8 currencies and set monthly spending limits with threshold alerts.",
        date: "v1.1.0",
        category: "feature",
        badgeText: "Feature",
        actionHref: "/settings",
        actionLabel: "Set Preferences",
    },
    {
        id: "notif-offline-privacy",
        title: "100% On-Device Storage",
        message: "Your financial records stay exclusively on your device with zero cloud tracking.",
        date: "Privacy",
        category: "privacy",
        badgeText: "Local",
        actionHref: "/settings",
        actionLabel: "View Storage",
    },
    {
        id: "notif-coming-soon",
        title: "Upcoming: Push & Due Alerts",
        message: "On-device payment reminders and due notifications are currently in active development.",
        date: "Roadmap",
        category: "upcoming",
        badgeText: "Roadmap",
        actionHref: "/settings",
        actionLabel: "Roadmap",
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
