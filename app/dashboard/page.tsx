"use client"

import Header from "@/components/header/header"
import { useEffect } from "react";
import RecentTransCard from "@/components/recentTransCard/recentTransCard";
import BalanceCard from "@/components/balanceCard/balanceCard";
import Link from "next/link";
import { useTransactionStore } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useCurrencyStore } from "@/store/currencyStore";

export default function Dashboard() {
    const { transactions: allTransactions, fetchTransactions, isInitialized, isLoading, getStats } = useTransactionStore();
    const { budgetLimit, budgetInitialized, fetchBudget } = useBudgetStore();
    const { format } = useCurrencyStore();

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
                <BalanceCard totalIncomeSum={totalIncomeSum} totalExpenseSum={totalExpenseSum} />

                {/* Content Area with Consistent Vertical Gap */}
                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-6 mt-6 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Recent Transactions */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-3 px-1">
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
                                <div className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 flex items-center justify-center text-xl mb-3">
                                        <span>💳</span>
                                    </div>
                                    <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100 mb-1">No transactions yet</h3>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4 max-w-[260px]">
                                        Track your expenses and income easily by adding your first transaction.
                                    </p>
                                    <Link 
                                        href="/newtransaction" 
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-semibold text-xs active:scale-95 hover:opacity-90 transition-all shadow-sm cursor-pointer"
                                    >
                                        + Add Transaction
                                    </Link>
                                </div>
                            )
                        }
                    </section>

                    {/* Insights */}
                    {(allTransactions && allTransactions.length > 0) && (
                        <section className="w-full">
                            <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 mb-3 px-1">Insights</h2>
                            <div className="flex flex-col gap-3">
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
                        <section className="w-full">
                            <div className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Monthly Budget</h3>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 ${budgetTextColor}`}>
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
                                        {format(thisMonthExpenseSum)} <span className="font-normal">spent</span>
                                    </span>
                                    <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                                        {format(budgetLimit)} <span className="font-normal">limit</span>
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Quick Actions / Shortcuts */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Bills */}
                            <Link href="/bills" className="flex flex-col items-center justify-center py-5 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 rounded-2xl flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 tracking-wide">Bills</span>
                            </Link>

                            {/* Subscriptions */}
                            <Link href="/subscriptions" className="flex flex-col items-center justify-center py-5 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/50 rounded-2xl flex items-center justify-center mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                                <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 tracking-wide">Subscriptions</span>
                            </Link>
                        </div>
                    </section>
                </div>

            </main>
        </div>
    )
}