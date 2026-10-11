"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import Link from "next/link";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import { useEffect, useRef, useState, useMemo } from "react";
import Loading from "@/components/loading/Loading";
import PlotPieChart, { ChartTypeOption } from "@/utils/plotPieChart";
import { useTransactionStore } from "@/store/transactionStore";
import { useTheme } from "next-themes";
import { useCurrencyStore } from "@/store/currencyStore";

export default function Stats() {
    const { transactions: storeTransactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();
    const { resolvedTheme } = useTheme();
    const { currentCurrency, currencyInfo, convert, format } = useCurrencyStore();

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

    const [expenseChartType, setExpenseChartType] = useState<ChartTypeOption>('doughnut');
    const [incomeChartType, setIncomeChartType] = useState<ChartTypeOption>('doughnut');
    const [debtChartType, setDebtChartType] = useState<ChartTypeOption>('doughnut');

    // CHARTS REPRESENTATION
    useEffect(() => {
        if (isLoading || !isInitialized) return;

        const isDark = resolvedTheme === 'dark';
        let expChart: any;
        let incChart: any;
        let debtChart: any;

        // EXPENSE CHART
        if (expensecanvas.current && totalExpense > 0) {
            expChart = PlotPieChart(
                expensecanvas.current, 
                'expensechart', 
                'Expenses', 
                Object.keys(expenseCategories), 
                Object.values(expenseCategories).map(v => convert(v)),
                isDark,
                currencyInfo.symbol,
                currencyInfo.locale,
                expenseChartType
            );
        }

        // INCOME CHART
        if (incomecanvas.current && totalIncome > 0) {
            incChart = PlotPieChart(
                incomecanvas.current, 
                'incomechart', 
                'Income', 
                Object.keys(incomeCategories), 
                Object.values(incomeCategories).map(v => convert(v)),
                isDark,
                currencyInfo.symbol,
                currencyInfo.locale,
                incomeChartType
            );
        }

        // DEBT CHART
        if (debtcanvas.current && totalDebt > 0) {
            debtChart = PlotPieChart(
                debtcanvas.current, 
                'debtchart', 
                'Debt/Lent', 
                Object.keys(debtCategories), 
                Object.values(debtCategories).map(v => convert(v)),
                isDark,
                currencyInfo.symbol,
                currencyInfo.locale,
                debtChartType
            );
        }

        return () => {
            if (expChart) expChart.destroy();
            if (incChart) incChart.destroy();
            if (debtChart) debtChart.destroy();
        };

    }, [totalIncome, totalExpense, totalDebt, incomeCategories, expenseCategories, debtCategories, isLoading, isInitialized, resolvedTheme, currentCurrency, currencyInfo, convert, expenseChartType, incomeChartType, debtChartType]);


    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Analytics & Stats" 
                    badge={`${allTransactions.length} ${allTransactions.length === 1 ? 'record' : 'records'}`} 
                />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <MishalToggle active="daily" />

                    { isLoading || !isInitialized ? (
                        <div style={{ minHeight: '40vh', display: "flex", alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
                            <Loading />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {/* EXPENSE SECTION */}
                            {totalExpense > 0 ? (
                                <div className="flex flex-col w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Expenses Breakdown</h3>
                                        <ChartTypeSwitcher currentType={expenseChartType} onChange={setExpenseChartType} />
                                    </div>
                                    <div className="h-60 w-full flex items-center justify-center">
                                        <canvas id="expensechart" className="m-auto" ref={expensecanvas}></canvas>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-44 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200">
                                    <span className="text-gray-400 dark:text-slate-500 mb-2 text-2xl">📉</span>
                                    <p className="text-[14px] text-gray-500 dark:text-slate-400 font-medium">No expenses this month</p>
                                </div>
                            )}

                            {/* INCOME SECTION */}
                            {totalIncome > 0 ? (
                                <div className="flex flex-col w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Income Breakdown</h3>
                                        <ChartTypeSwitcher currentType={incomeChartType} onChange={setIncomeChartType} />
                                    </div>
                                    <div className="h-60 w-full flex items-center justify-center">
                                        <canvas id="incomechart" className="m-auto" ref={incomecanvas}></canvas>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-44 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200">
                                    <span className="text-gray-400 dark:text-slate-500 mb-2 text-2xl">📈</span>
                                    <p className="text-[14px] text-gray-500 dark:text-slate-400 font-medium">No income this month</p>
                                </div>
                            )}

                            {/* DEBT SECTION */}
                            {totalDebt > 0 && (
                                <div className="flex flex-col w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Debt/Lent Breakdown</h3>
                                        <ChartTypeSwitcher currentType={debtChartType} onChange={setDebtChartType} />
                                    </div>
                                    <div className="h-60 w-full flex items-center justify-center">
                                        <canvas id="debtchart" className="m-auto" ref={debtcanvas}></canvas>
                                    </div>
                                </div>
                            )}

                            {/* TOTAL IN-EX SUMMARY PILLS */}
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <Link href="/income" className="flex flex-col items-center justify-center py-5 px-3 bg-emerald-50/70 dark:bg-emerald-950/30 text-center rounded-3xl hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 transition-all duration-200 border border-emerald-200/60 dark:border-emerald-900/50 shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.98]">
                                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">Total Income</span>
                                    <h2 className="font-extrabold text-xl py-1 text-black dark:text-white">{ format(totalIncome) }</h2>
                                </Link>
                                <Link href="/expense" className="flex flex-col items-center justify-center py-5 px-3 bg-rose-50/70 dark:bg-rose-950/30 text-center rounded-3xl hover:bg-rose-100/70 dark:hover:bg-rose-900/40 transition-all duration-200 border border-rose-200/60 dark:border-rose-900/50 shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.98]">
                                    <span className="text-[11px] uppercase tracking-wider font-bold text-rose-600 dark:text-rose-400">Total Expense</span>
                                    <h2 className="font-extrabold text-xl py-1 text-black dark:text-white">{ format(totalExpense) }</h2>
                                </Link>
                            </div>
                            
                            <div className="flex justify-center mt-3">
                                <Link href="/history" className="inline-flex items-center gap-1.5 py-3 px-5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 hover:bg-blue-100/70 active:scale-95 transition-all">
                                    See full transaction history →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function ChartTypeSwitcher({
    currentType,
    onChange
}: {
    currentType: ChartTypeOption;
    onChange: (type: ChartTypeOption) => void;
}) {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200/50 dark:border-slate-700/50">
            <button
                type="button"
                onClick={() => onChange('doughnut')}
                aria-label="Donut Chart"
                title="Donut Chart"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === 'doughnut'
                        ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                        : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => onChange('bar')}
                aria-label="Bar Graph"
                title="Bar Graph"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === 'bar'
                        ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                        : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10" />
                    <line x1="18" y1="20" x2="18" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => onChange('line')}
                aria-label="Line Chart"
                title="Line Chart"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === 'line'
                        ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                        : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                </svg>
            </button>
        </div>
    );
}
