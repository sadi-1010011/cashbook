import Localbase from "localbase";
import { TransactionType } from "@/types";

const db = new Localbase('kaayidb');
db.config.debug = false;

const COLLECTION = 'alltransactions';
const BUDGET_COLLECTION = 'budget';

export const dbService = {
    getAllTransactions: async (): Promise<TransactionType[]> => {
        const data = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
        return data || [];
    },
    
    addTransaction: async (transaction: TransactionType): Promise<void> => {
        await db.collection(COLLECTION).add(transaction);
    },

    updateTransaction: async (id: string, transaction: Partial<TransactionType>): Promise<void> => {
        await db.collection(COLLECTION).doc({ id }).update(transaction);
    },

    deleteTransaction: async (id: string): Promise<void> => {
        await db.collection(COLLECTION).doc({ id }).delete();
    },

    deleteAllTransactions: async (): Promise<void> => {
        await db.collection(COLLECTION).delete();
    },

    setAllTransactions: async (transactions: TransactionType[]): Promise<void> => {
        // Clear existing and set new
        await db.collection(COLLECTION).delete();
        // Localbase doesn't seem to have a bulk insert, we can iterate or use add
        for (const t of transactions) {
            await db.collection(COLLECTION).add(t);
        }
    },

    getTransactionById: async (id: string): Promise<TransactionType | null> => {
        const data = await db.collection(COLLECTION).doc({ id }).get();
        return data;
    },
    
    initDefaultDB: async (): Promise<void> => {
        const data = await db.collection(COLLECTION).get();
        if (!data || data.length === 0) {
            console.log(`db created successfuly! with ${COLLECTION}`);
        }
    },

    // Budget methods
    getBudget: async (): Promise<number | null> => {
        try {
            const data = await db.collection(BUDGET_COLLECTION).doc({ id: 'monthly_budget' }).get();
            return data?.amount ?? null;
        } catch {
            return null;
        }
    },

    setBudget: async (amount: number): Promise<void> => {
        try {
            // Try to update existing
            const existing = await db.collection(BUDGET_COLLECTION).doc({ id: 'monthly_budget' }).get();
            if (existing) {
                await db.collection(BUDGET_COLLECTION).doc({ id: 'monthly_budget' }).update({ amount });
            } else {
                await db.collection(BUDGET_COLLECTION).add({ id: 'monthly_budget', amount });
            }
        } catch {
            // If get fails (no doc), add new
            await db.collection(BUDGET_COLLECTION).add({ id: 'monthly_budget', amount });
        }
    },

    clearBudget: async (): Promise<void> => {
        try {
            await db.collection(BUDGET_COLLECTION).doc({ id: 'monthly_budget' }).delete();
        } catch {
            // Ignore if doesn't exist
        }
    }
};
