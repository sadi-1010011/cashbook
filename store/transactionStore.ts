import { create } from 'zustand';
import { TransactionType } from '@/types';
import { dbService } from '@/services/db';

interface TransactionState {
    transactions: TransactionType[];
    isLoading: boolean;
    isInitialized: boolean;
    fetchTransactions: () => Promise<void>;
    addTransaction: (transaction: TransactionType) => Promise<void>;
    updateTransaction: (id: string, transaction: Partial<TransactionType>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    deleteAllTransactions: () => Promise<void>;
    setAllTransactions: (transactions: TransactionType[]) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    isLoading: true,
    isInitialized: false,

    fetchTransactions: async () => {
        set({ isLoading: true });
        try {
            const data = await dbService.getAllTransactions();
            set({ transactions: data || [], isInitialized: true });
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addTransaction: async (transaction) => {
        try {
            await dbService.addTransaction(transaction);
            // Prepend new transaction locally
            set((state) => ({ transactions: [transaction, ...state.transactions] }));
        } catch (error) {
            console.error("Failed to add transaction", error);
        }
    },

    updateTransaction: async (id, transactionUpdates) => {
        try {
            await dbService.updateTransaction(id, transactionUpdates);
            set((state) => ({
                transactions: state.transactions.map((t) =>
                    t.id === id ? { ...t, ...transactionUpdates } : t
                ),
            }));
        } catch (error) {
            console.error("Failed to update transaction", error);
        }
    },

    deleteTransaction: async (id) => {
        try {
            await dbService.deleteTransaction(id);
            set((state) => ({
                transactions: state.transactions.filter((t) => t.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete transaction", error);
        }
    },

    deleteAllTransactions: async () => {
        try {
            await dbService.deleteAllTransactions();
            set({ transactions: [] });
        } catch (error) {
            console.error("Failed to delete all transactions", error);
        }
    },

    setAllTransactions: async (transactions) => {
        try {
            await dbService.setAllTransactions(transactions);
            set({ transactions });
        } catch (error) {
            console.error("Failed to set all transactions", error);
        }
    }
}));
