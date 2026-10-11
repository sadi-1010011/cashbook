import Localbase from "localbase";
import { TransactionType, BillType, SubscriptionType } from "@/types";

const db = new Localbase('kaayidb');
db.config.debug = false;

const COLLECTION = 'alltransactions';
const BUDGET_COLLECTION = 'budget';
const BILLS_COLLECTION = 'bills';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

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
        // Clear existing and set new concurrently
        await db.collection(COLLECTION).delete();
        await Promise.all(transactions.map((t) => db.collection(COLLECTION).add(t)));
    },

    getTransactionById: async (id: string): Promise<TransactionType | null> => {
        const data = await db.collection(COLLECTION).doc({ id }).get();
        return data;
    },
    
    initDefaultDB: async (): Promise<void> => {
        await db.collection(COLLECTION).get();
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
    },

    // Bills methods
    getAllBills: async (): Promise<BillType[]> => {
        try {
            const data = await db.collection(BILLS_COLLECTION).orderBy('dueDate', 'asc').get();
            return data || [];
        } catch (error) {
            console.error("Failed to fetch bills from db", error);
            return [];
        }
    },

    addBill: async (bill: BillType): Promise<void> => {
        await db.collection(BILLS_COLLECTION).add(bill);
    },

    updateBill: async (id: string, updates: Partial<BillType>): Promise<void> => {
        await db.collection(BILLS_COLLECTION).doc({ id }).update(updates);
    },

    deleteBill: async (id: string): Promise<void> => {
        await db.collection(BILLS_COLLECTION).doc({ id }).delete();
    },

    deleteAllBills: async (): Promise<void> => {
        await db.collection(BILLS_COLLECTION).delete();
    },

    setAllBills: async (bills: BillType[]): Promise<void> => {
        await db.collection(BILLS_COLLECTION).delete();
        await Promise.all(bills.map((b) => db.collection(BILLS_COLLECTION).add(b)));
    },

    // Subscriptions methods
    getAllSubscriptions: async (): Promise<SubscriptionType[]> => {
        try {
            const data = await db.collection(SUBSCRIPTIONS_COLLECTION).orderBy('nextBillingDate', 'asc').get();
            return data || [];
        } catch (error) {
            console.error("Failed to fetch subscriptions from db", error);
            return [];
        }
    },

    addSubscription: async (subscription: SubscriptionType): Promise<void> => {
        await db.collection(SUBSCRIPTIONS_COLLECTION).add(subscription);
    },

    updateSubscription: async (id: string, updates: Partial<SubscriptionType>): Promise<void> => {
        await db.collection(SUBSCRIPTIONS_COLLECTION).doc({ id }).update(updates);
    },

    deleteSubscription: async (id: string): Promise<void> => {
        await db.collection(SUBSCRIPTIONS_COLLECTION).doc({ id }).delete();
    },

    deleteAllSubscriptions: async (): Promise<void> => {
        await db.collection(SUBSCRIPTIONS_COLLECTION).delete();
    },

    setAllSubscriptions: async (subscriptions: SubscriptionType[]): Promise<void> => {
        await db.collection(SUBSCRIPTIONS_COLLECTION).delete();
        await Promise.all(subscriptions.map((sub) => db.collection(SUBSCRIPTIONS_COLLECTION).add(sub)));
    },

    // Global wipe
    wipeAllData: async (): Promise<void> => {
        await Promise.all([
            db.collection(COLLECTION).delete(),
            db.collection(BUDGET_COLLECTION).delete(),
            db.collection(BILLS_COLLECTION).delete(),
            db.collection(SUBSCRIPTIONS_COLLECTION).delete(),
        ]);
    }
};
