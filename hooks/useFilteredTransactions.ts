import { useEffect, useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { TimeframeOption } from "@/components/mishaltoggle/mishalToggle";
import { TransactionType } from "@/types";

export type FilterType = "all" | "income" | "expense" | "debt";

export function useFilteredTransactions(
    type: FilterType = "all",
    timeframe: TimeframeOption = "weekly"
) {
    const { transactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
    }, [isInitialized, fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Weekly: last 7 days window (from 6 days ago 00:00:00 to end of today)
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);

        // Monthly: current calendar month
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return transactions
            .filter((item: TransactionType) => {
                if (type !== "all" && item.transactiontype !== type) return false;

                const date = new Date(item.createdAt || item.updatedAt);
                if (isNaN(date.getTime())) return false;

                if (timeframe === "daily") {
                    return date >= startOfToday && date <= endOfToday;
                }
                if (timeframe === "weekly") {
                    return date >= startOfWeek && date <= endOfToday;
                }
                if (timeframe === "monthly") {
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                }
                return true;
            })
            .sort((a: TransactionType, b: TransactionType) => {
                const timeA = new Date(a.createdAt || a.updatedAt).getTime() || 0;
                const timeB = new Date(b.createdAt || b.updatedAt).getTime() || 0;
                return timeB - timeA;
            });
    }, [transactions, type, timeframe]);

    return {
        transactions: filteredTransactions,
        isLoading: isLoading || !isInitialized,
    };
}
