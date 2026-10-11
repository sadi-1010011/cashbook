import { create } from 'zustand';
import { BillType } from '@/types';
import { dbService } from '@/services/db';

interface BillState {
    bills: BillType[];
    isLoading: boolean;
    isInitialized: boolean;
    fetchBills: () => Promise<void>;
    addBill: (bill: BillType) => Promise<void>;
    updateBill: (id: string, updates: Partial<BillType>) => Promise<void>;
    toggleBillStatus: (id: string) => Promise<void>;
    deleteBill: (id: string) => Promise<void>;
    deleteAllBills: () => Promise<void>;
    setAllBills: (bills: BillType[]) => Promise<void>;
}

export const useBillStore = create<BillState>((set, get) => ({
    bills: [],
    isLoading: true,
    isInitialized: false,

    fetchBills: async () => {
        set({ isLoading: true });
        try {
            const data = await dbService.getAllBills();
            set({ bills: data || [], isInitialized: true });
        } catch (error) {
            console.error("Failed to fetch bills", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addBill: async (bill: BillType) => {
        try {
            await dbService.addBill(bill);
            // Prepend new bill locally
            set((state) => ({ bills: [bill, ...state.bills] }));
        } catch (error) {
            console.error("Failed to add bill", error);
        }
    },

    updateBill: async (id: string, updates: Partial<BillType>) => {
        try {
            await dbService.updateBill(id, updates);
            set((state) => ({
                bills: state.bills.map((b) => (b.id === id ? { ...b, ...updates } : b)),
            }));
        } catch (error) {
            console.error("Failed to update bill", error);
        }
    },

    toggleBillStatus: async (id: string) => {
        const target = get().bills.find((b) => b.id === id);
        if (!target) return;
        const newStatus = target.status === 'paid' ? 'unpaid' : 'paid';

        try {
            await dbService.updateBill(id, { status: newStatus });
            set((state) => ({
                bills: state.bills.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
            }));
        } catch (error) {
            console.error("Failed to toggle bill status", error);
        }
    },

    deleteBill: async (id: string) => {
        try {
            await dbService.deleteBill(id);
            set((state) => ({
                bills: state.bills.filter((b) => b.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete bill", error);
        }
    },

    deleteAllBills: async () => {
        try {
            await dbService.deleteAllBills();
            set({ bills: [] });
        } catch (error) {
            console.error("Failed to delete all bills", error);
        }
    },

    setAllBills: async (bills: BillType[]) => {
        try {
            await dbService.setAllBills(bills);
            set({ bills });
        } catch (error) {
            console.error("Failed to set all bills", error);
        }
    },
}));
