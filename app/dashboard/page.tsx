"use client"

import Header from "@/components/header/header"
import { useEffect } from "react";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import RecentTransCard from "@/components/recentTransCard/recentTransCard";
import RupeeIcon from "@/assets/rupee.png";
import Image from "next/image";
import Link from "next/link";
import { useTransactionStore } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";

export default function Dashboard() {
    const { transactions: allTransactions, fetchTransactions, isInitialized, isLoading, getStats } = useTransactionStore();
    const { budgetLimit, budgetInitialized, fetchBudget } = useBudgetStore();

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
        if (!budgetInitialized) {
            fetchBudget();
        }
    }, [isInitialized, fetchTransactions, budgetInitialized, fetchBudget]);

    const {
        totalIncomeSum,
        totalExpenseSum,
        todayExpenseSum,
        thisMonthExpenseSum,
        // topCategory,
        // topCategoryAmount,
        largestExpense
    } = getStats();

    // Budget progress helpers
    const budgetPercent = budgetLimit ? Math.min((thisMonthExpenseSum / budgetLimit) * 100, 100) : 0;
    const budgetOverflow = budgetLimit ? thisMonthExpenseSum > budgetLimit : false;
    const budgetBarColor = budgetPercent >= 90 ? 'bg-red-500' : budgetPercent >= 75 ? 'bg-amber-500' : 'bg-emerald-500';
    const budgetTextColor = budgetPercent >= 90 ? 'text-red-600 dark:text-red-400' : budgetPercent >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';


    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">

                {/* Balance card — sticky within scroll */}
                <div className="sticky top-0 z-10 flex justify-center pt-5 pb-3 bg-[#f6f5f5]/90 dark:bg-slate-950/90 backdrop-blur-md">
                    <div className="flex items-center justify-between w-[90%] max-w-md py-8 px-8 bg-[#1a1a1a] text-2xl font-extrabold rounded-3xl shadow-xl border border-gray-800 transition-all">
                        <h1 className="text-white flex items-center text-3xl tracking-tight">
                            <Image src={RupeeIcon} alt="rupee icon" width={24} height={24} className="mr-1.5 opacity-90" />
                            {`${getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum) || '0'}`}
                        </h1>
                        <span className="text-gray-400 text-sm font-medium tracking-wider">INR</span>
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
                <section className="px-5 mt-6 w-[90%] max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100">Recent Transactions</h2>
                        {allTransactions && allTransactions.length > 6 && (
                            <Link href="/history" className="text-blue-500 dark:text-blue-400 text-xs font-semibold hover:text-blue-600 transition-colors">
                                View all →
                            </Link>
                        )}
                    </div>

                    {
                        (allTransactions && allTransactions.length > 0) ? (
                            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto sleek-scrollbar pb-1">
                                {allTransactions.slice(0, 6).map((item: any) => (
                                    <RecentTransCard key={item.id} catogory={String(item.catogory)} amount={Number(item.amount)} type={item.transactiontype} description={item.description} />
                                ))}
                            </div>
                        ) : isLoading ? (
                            <div className="w-full text-center py-8 text-gray-400 text-sm font-medium">Loading transactions...</div>
                        ) : (
                            <RecentTransCard catogory={'no transactions yet'} amount={0} type={'income'} />
                        )
                    }
                </section>


                {/* Insights */}
                {(allTransactions && allTransactions.length > 0) && (
                    <section className="px-5 mt-8 mb-4 w-[90%] max-w-md mx-auto">
                        <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 mb-4 px-1">Insights</h2>
                        <div className="flex flex-col gap-3">
                            {/* <RecentTransCard 
                                catogory={topCategory} 
                                amount={topCategoryAmount} 
                                type="expense" 
                                description="Top Spend Category" 
                            /> */}
                            <RecentTransCard
                                catogory="Today's Total"
                                amount={todayExpenseSum}
                                type="expense"
                                description="Today's Expense"
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

                {/* Budget Progress */}
                {budgetLimit !== null && (
                    <section className="px-5 mt-8 mb-6 w-[90%] max-w-md mx-auto">
                        <div className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm transition-colors duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Monthly Budget</h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800 ${budgetTextColor}`}>
                                    {budgetOverflow ? 'Over Budget!' : `${budgetPercent.toFixed(0)}% used`}
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${budgetBarColor}`}
                                    style={{ width: `${budgetPercent}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                                    ₹{thisMonthExpenseSum.toLocaleString('en-IN')} <span className="font-normal">spent</span>
                                </span>
                                <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                                    ₹{budgetLimit.toLocaleString('en-IN')} <span className="font-normal">limit</span>
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Actions / Shortcuts */}
                <section className="px-5 mb-10 w-[90%] max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Bills */}
                        <Link href="/bills" className="flex flex-col items-center justify-center py-5 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 tracking-wide">Bills</span>
                        </Link>

                        {/* Subscriptions */}
                        <Link href="/subscriptions" className="flex flex-col items-center justify-center py-5 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 tracking-wide">Subscriptions</span>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    )
}