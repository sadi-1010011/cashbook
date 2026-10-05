import { create } from 'zustand';
import { dbService } from '@/services/db';

interface BudgetState {
    budgetLimit: number | null;
    budgetLoading: boolean;
    budgetInitialized: boolean;
    fetchBudget: () => Promise<void>;
    setBudgetLimit: (amount: number) => Promise<void>;
    clearBudgetLimit: () => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
    budgetLimit: null,
    budgetLoading: false,
    budgetInitialized: false,

    fetchBudget: async () => {
        set({ budgetLoading: true });
        try {
            const amount = await dbService.getBudget();
            set({ budgetLimit: amount, budgetInitialized: true });
        } catch (error) {
            console.error("Failed to fetch budget", error);
        } finally {
            set({ budgetLoading: false });
        }
    },

    setBudgetLimit: async (amount: number) => {
        try {
            await dbService.setBudget(amount);
            set({ budgetLimit: amount });
        } catch (error) {
            console.error("Failed to set budget", error);
        }
    },

    clearBudgetLimit: async () => {
        try {
            await dbService.clearBudget();
            set({ budgetLimit: null });
        } catch (error) {
            console.error("Failed to clear budget", error);
        }
    }
}));
