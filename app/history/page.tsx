"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import TransCard from "@/components/transcard/transcard";
import MishalToggle, { TimeframeOption } from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useState } from "react";
import CountUp from "react-countup";
import { TransactionType } from "@/types";
import { useFilteredTransactions } from "@/hooks";

export default function History() {
    const [timeframe, setTimeframe] = useState<TimeframeOption>("weekly");
    const { transactions: filteredTransactions, isLoading } = useFilteredTransactions("all", timeframe);

    return (
        !isLoading ? (
            <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
                <Header />
                <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                    <PageHeader
                        title="Transaction History"
                        badge={
                            <span>
                                <CountUp end={filteredTransactions.length} duration={0.6} preserveValue /> {filteredTransactions.length === 1 ? 'record' : 'records'}
                            </span>
                        }
                    />

                    <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <MishalToggle active={timeframe} onChange={setTimeframe} />

                        <div className="flex flex-col gap-3 mt-1">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction: TransactionType, index: number) => (
                                    <div
                                        key={`${timeframe}-${transaction.id}`}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
                                    >
                                        <TransCard
                                            id={transaction.id}
                                            amount={Number(transaction.amount)}
                                            date={String(transaction.updatedAt || transaction.createdAt)}
                                            type={transaction.transactiontype}
                                            catogory={transaction.catogory}
                                            description={transaction.description}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        No transactions recorded for {timeframe === 'daily' ? 'today' : timeframe === 'weekly' ? 'this week' : 'this month'}.
                                    </p>
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