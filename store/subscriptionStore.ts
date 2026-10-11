import { create } from 'zustand';
import { SubscriptionType } from '@/types';
import { dbService } from '@/services/db';

interface SubscriptionState {
    subscriptions: SubscriptionType[];
    isLoading: boolean;
    isInitialized: boolean;
    fetchSubscriptions: () => Promise<void>;
    addSubscription: (subscription: SubscriptionType) => Promise<void>;
    updateSubscription: (id: string, updates: Partial<SubscriptionType>) => Promise<void>;
    toggleSubscriptionStatus: (id: string) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    deleteAllSubscriptions: () => Promise<void>;
    setAllSubscriptions: (subscriptions: SubscriptionType[]) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    subscriptions: [],
    isLoading: true,
    isInitialized: false,

    fetchSubscriptions: async () => {
        set({ isLoading: true });
        try {
            const data = await dbService.getAllSubscriptions();
            set({ subscriptions: data || [], isInitialized: true });
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addSubscription: async (subscription: SubscriptionType) => {
        try {
            await dbService.addSubscription(subscription);
            // Prepend new subscription locally
            set((state) => ({ subscriptions: [subscription, ...state.subscriptions] }));
        } catch (error) {
            console.error("Failed to add subscription", error);
        }
    },

    updateSubscription: async (id: string, updates: Partial<SubscriptionType>) => {
        try {
            await dbService.updateSubscription(id, updates);
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
            }));
        } catch (error) {
            console.error("Failed to update subscription", error);
        }
    },

    toggleSubscriptionStatus: async (id: string) => {
        const target = get().subscriptions.find((s) => s.id === id);
        if (!target) return;
        const newStatus = target.status === 'paid' ? 'unpaid' : 'paid';

        try {
            await dbService.updateSubscription(id, { status: newStatus });
            set((state) => ({
                subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
            }));
        } catch (error) {
            console.error("Failed to toggle subscription status", error);
        }
    },

    deleteSubscription: async (id: string) => {
        try {
            await dbService.deleteSubscription(id);
            set((state) => ({
                subscriptions: state.subscriptions.filter((s) => s.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete subscription", error);
        }
    },

    deleteAllSubscriptions: async () => {
        try {
            await dbService.deleteAllSubscriptions();
            set({ subscriptions: [] });
        } catch (error) {
            console.error("Failed to delete all subscriptions", error);
        }
    },

    setAllSubscriptions: async (subscriptions: SubscriptionType[]) => {
        try {
            await dbService.setAllSubscriptions(subscriptions);
            set({ subscriptions });
        } catch (error) {
            console.error("Failed to set all subscriptions", error);
        }
    },
}));
