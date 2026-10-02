"use client"

import Header from "@/components/header/header"
import { useEffect } from "react";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import RecentTransCard from "@/components/recentTransCard/recentTransCard";
import RupeeIcon from "@/assets/rupee.png";
import Image from "next/image";
import Link from "next/link";
import { useTransactionStore } from "@/store/transactionStore";

export default function Dashboard() {
    const { transactions: allTransactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();

    let totalIncomeSum: number = 0;
    let totalExpenseSum: number = 0;

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
    }, [isInitialized, fetchTransactions]);


    // calculate income, expense
    let topCategory = "None";
    let topCategoryAmount = 0;
    let largestExpense = 0;

    if (allTransactions && allTransactions.length > 0) {
        let lastRecentTransactionUpto = 3;
        const categoryTotals: any = {};

        allTransactions.forEach((transaction: any) => {
            const amt = Number(transaction.amount);
            if (transaction.transactiontype === "income") {
                totalIncomeSum = amt + totalIncomeSum;
            }
            if (transaction.transactiontype === "expense" || transaction.transactiontype === "debt") {
                totalExpenseSum = amt + totalExpenseSum;
                
                // only track insights for actual expenses, not debt (or optionally track both)
                if (transaction.transactiontype === "expense") {
                    categoryTotals[transaction.catogory] = (categoryTotals[transaction.catogory] || 0) + amt;
                    if (amt > largestExpense) {
                        largestExpense = amt;
                    }
                }
            }
        });

        for (const cat in categoryTotals) {
            if (categoryTotals[cat] > topCategoryAmount) {
                topCategoryAmount = categoryTotals[cat];
                topCategory = cat;
            }
        }
    }


    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">

                {/* Balance card — sticky within scroll */}
                <div className="sticky top-0 z-10 flex justify-center pt-5 pb-3 bg-[#f6f5f5]/80 dark:bg-slate-950/80 backdrop-blur-lg">
                    <div className="flex items-center justify-between w-4/5 py-14 px-8 bg-[#121212e2] text-2xl font-extrabold rounded-[22px] backdrop-blur-sm shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
                        <h1 className="text-white inline-flex items-center justify-center">
                            <Image src={RupeeIcon} alt="rupee icon" width={22} height={22} className="mx-1" />
                            {`${getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum) || '0'}`}
                        </h1>
                        <span className="text-white text-lg leading-relaxed">INR</span>
                    </div>
                </div>

                {/* Income / Expense summary pills */}
                {/* <div className="grid grid-cols-2 gap-3 px-6 mt-2 mb-4">
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 transition-colors duration-200">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Income</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">₹{totalIncomeSum}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 transition-colors duration-200">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Expense</span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">₹{totalExpenseSum}</span>
                    </div>
                </div> */}

                {/* Recent Transactions */}
                <section className="px-6 mt-4">
                    <div className="relative flex items-center justify-center mb-3">
                        <h2 className="font-bold text-lg text-black dark:text-white text-center">Recent Transactions</h2>
                        {allTransactions && allTransactions.length > 6 && (
                            <Link href="/history" className="absolute right-0 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline transition-colors duration-200">
                                View all →
                            </Link>
                        )}
                    </div>

                    {
                        (allTransactions && allTransactions.length > 0) ? (
                            <div className="max-h-[380px] overflow-y-auto sleek-scrollbar">
                                {allTransactions.slice(0, 6).map((item: any) => (
                                    <RecentTransCard key={item.id} catogory={String(item.catogory)} amount={Number(item.amount)} type={item.transactiontype} description={item.description} />
                                ))}
                            </div>
                        ) : isLoading ? (
                            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : (
                            <RecentTransCard catogory={'no transactions yet'} amount={0} type={'income'} />
                        )
                    }
                </section>

                {/* Insights */}
                {(allTransactions && allTransactions.length > 0) && (
                    <section className="w-full mt-2 mb-6 px-6">
                        <h2 className="font-bold text-lg text-black dark:text-white mb-1 text-center">Insights</h2>
                        <div className="flex flex-col w-full">
                            <RecentTransCard 
                                catogory={topCategory} 
                                amount={topCategoryAmount} 
                                type="expense" 
                                description="Top Spend Category" 
                            />
                            <RecentTransCard 
                                catogory="Highest Transaction" 
                                amount={largestExpense} 
                                type="expense" 
                                description="Largest Single Item" 
                            />
                        </div>
                    </section>
                )}

            </main>
        </div>
    )
}