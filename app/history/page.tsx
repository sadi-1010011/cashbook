"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useEffect, useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
 
export default function History() {    
    const { transactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
    }, [isInitialized, fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return transactions.filter((t: any) => {
            const date = new Date(t.createdAt);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
    }, [transactions]);

    return (
        !isLoading ? (
            <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
                <Header />
                <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                    <PageHeader 
                        title="Transaction History" 
                        badge={`${filteredTransactions.length} ${filteredTransactions.length === 1 ? 'record' : 'records'}`} 
                    />

                    <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <MishalToggle active="daily" />

                        <div className="flex flex-col gap-3 mt-1">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction: any) => (
                                    <TransCard 
                                        key={transaction.id} 
                                        id={transaction.id} 
                                        amount={Number(transaction.amount)} 
                                        date={String(transaction.updatedAt)} 
                                        type={transaction.transactiontype} 
                                        catogory={transaction.catogory} 
                                        description={transaction.description} 
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No transactions recorded for this period.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        ) : (
            <Loading />
        )
    );
}