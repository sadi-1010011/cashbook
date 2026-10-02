"use client"

import Header from "@/components/header/header";
import Link from "next/link";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import { useEffect, useRef, useState, useMemo } from "react";
import Loading from "@/components/loading/Loading";
import PlotPieChart from "@/utils/plotPieChart";
import { useTransactionStore } from "@/store/transactionStore";
import { useTheme } from "next-themes";

export default function Stats() {
    const { transactions: storeTransactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
    }, [isInitialized, fetchTransactions]);

    const { allTransactions, totalIncome, totalExpense, totalDebt, incomeCategories, expenseCategories, debtCategories } = useMemo(() => {
        let incSum = 0;
        let expSum = 0;
        let debtSum = 0;
        const incCats: Record<string, number> = {};
        const expCats: Record<string, number> = {};
        const debtCats: Record<string, number> = {};
        let filtered: any[] = [];

        if (storeTransactions) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            filtered = storeTransactions.filter((t: any) => {
                const date = new Date(t.createdAt);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            });

            for (const record of filtered) {
                const amt = Number(record.amount);
                if (record.transactiontype === "income") {
                    incSum += amt;
                    incCats[record.catogory] = (incCats[record.catogory] || 0) + amt;
                }
                if (record.transactiontype === "expense") {
                    expSum += amt;
                    expCats[record.catogory] = (expCats[record.catogory] || 0) + amt;
                }
                if (record.transactiontype === "debt") {
                    debtSum += amt;
                    debtCats[record.catogory] = (debtCats[record.catogory] || 0) + amt;
                }
            }
        }
        
        return {
            allTransactions: filtered,
            totalIncome: incSum,
            totalExpense: expSum,
            totalDebt: debtSum,
            incomeCategories: incCats,
            expenseCategories: expCats,
            debtCategories: debtCats
        };
    }, [storeTransactions]);

    const incomecanvas = useRef<HTMLCanvasElement>(null);
    const expensecanvas = useRef<HTMLCanvasElement>(null);
    const debtcanvas = useRef<HTMLCanvasElement>(null);

    // PIE CHART REPRESENTATION
    useEffect(() => {
        if (isLoading || !isInitialized) return;

        const isDark = resolvedTheme === 'dark';
        let expChart: any;
        let incChart: any;
        let debtChart: any;

        // EXPENSE PIE CHART
        if (expensecanvas.current && totalExpense > 0) {
            expChart = PlotPieChart(
                expensecanvas.current, 
                'expensechart', 
                'Expenses', 
                Object.keys(expenseCategories), 
                Object.values(expenseCategories),
                isDark
            );
        }

        // INCOME PIE CHART
        if (incomecanvas.current && totalIncome > 0) {
            incChart = PlotPieChart(
                incomecanvas.current, 
                'incomechart', 
                'Income', 
                Object.keys(incomeCategories), 
                Object.values(incomeCategories),
                isDark
            );
        }

        // DEBT PIE CHART
        if (debtcanvas.current && totalDebt > 0) {
            debtChart = PlotPieChart(
                debtcanvas.current, 
                'debtchart', 
                'Debt/Lent', 
                Object.keys(debtCategories), 
                Object.values(debtCategories),
                isDark
            );
        }

        return () => {
            if (expChart) expChart.destroy();
            if (incChart) incChart.destroy();
            if (debtChart) debtChart.destroy();
        };

    }, [totalIncome, totalExpense, totalDebt, incomeCategories, expenseCategories, debtCategories, isLoading, isInitialized, resolvedTheme]);


    return (
        <div className="container w-full bg-[#f6f5f5] dark:bg-slate-950 h-full overflow-y-scroll pb-24 text-black dark:text-white transition-colors duration-200 animate-fade-in">
            <Header />

            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <MishalToggle active="daily" />
            </div>

            { isLoading || !isInitialized ? (
                // LOADING UI
                <div style={{ minHeight: '60vh', display: "flex", alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
                    <Loading />
                </div>
            ) : (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {/* EXPENSE SECTION */}
                    {totalExpense > 0 ? (
                        <div className="flex w-11/12 max-w-md h-64 my-6 mx-auto px-2 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-200">
                            <canvas id="expensechart" className="m-auto" ref={expensecanvas}></canvas>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-11/12 max-w-md h-48 my-6 mx-auto px-4 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-200">
                            <span className="text-gray-400 dark:text-slate-500 mb-2">📉</span>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">No expenses this month</p>
                        </div>
                    )}

                    {/* INCOME SECTION */}
                    {totalIncome > 0 ? (
                        <div className="flex w-11/12 max-w-md h-64 my-6 mx-auto px-2 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-200">
                            <canvas id="incomechart" className="m-auto" ref={incomecanvas}></canvas>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-11/12 max-w-md h-48 my-6 mx-auto px-4 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-200">
                            <span className="text-gray-400 dark:text-slate-500 mb-2">📈</span>
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">No income this month</p>
                        </div>
                    )}

                    {/* DEBT SECTION */}
                    {totalDebt > 0 && (
                        <div className="flex w-11/12 max-w-md h-64 my-6 mx-auto px-2 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-200">
                            <canvas id="debtchart" className="m-auto" ref={debtcanvas}></canvas>
                        </div>
                    )}

                    {/* TOTAL IN-EX SUMMARY PILLS */}
                    <div className="flex items-center justify-evenly my-5 mx-auto px-3 w-full max-w-md capitalize">
                        <div className="my-1 mx-1 py-5 bg-green-100/70 dark:bg-green-900/30 w-1/2 text-center rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200 border border-green-200 dark:border-green-800">
                            <Link href="/income" className="text-xs uppercase tracking-wider font-bold text-green-700 dark:text-green-400">Total Income</Link>
                            <h2 className="font-extrabold text-xl py-1.5 text-black dark:text-white">{ `₹ ${ totalIncome }` }</h2>
                        </div>
                        <div className="my-1 mx-1 py-5 bg-red-100/70 dark:bg-red-900/30 w-1/2 text-center rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 border border-red-200 dark:border-red-800">
                            <Link href="/expense" className="text-xs uppercase tracking-wider font-bold text-red-700 dark:text-red-400">Total Expense</Link>
                            <h2 className="font-extrabold text-xl py-1.5 text-black dark:text-white">{ `₹ ${ totalExpense }` }</h2>
                        </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                        <Link href="/history">
                            <h4 className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold capitalize text-center py-1.5 mb-8 transition-colors duration-200">See full transaction history →</h4>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
