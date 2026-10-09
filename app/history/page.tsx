"use client"

import Header from "@/components/header/header";
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
        (!isLoading) ?
        (<div className="container w-full bg-[#f6f5f5] dark:bg-slate-950 h-full overflow-y-scroll pb-24 text-black dark:text-white transition-colors duration-200 animate-fade-in">
            <Header />
            <div className="animate-fade-in-up flex justify-center w-[90%] max-w-md mx-auto mt-4" style={{ animationDelay: '0.1s' }}>
                <MishalToggle active="daily" />
            </div>
            <div className="flex flex-col gap-3 my-4 mx-auto w-[90%] max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {
                    (filteredTransactions.length > 0)
                        ?
                    (filteredTransactions.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={String(transaction.updatedAt)} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />))
                        :
                    (<span className="capitalize font-semibold text-lg w-full my-10 text-center text-slate-500">no transactions made yet</span>)
                    
                }
            </div>
        </div>)
        :
        <Loading />
    );
}