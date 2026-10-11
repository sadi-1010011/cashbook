"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import Link from "next/link";
import MishalToggle, { TimeframeOption } from "@/components/mishaltoggle/mishalToggle";
import { useEffect, useState, useMemo } from "react";
import Loading from "@/components/loading/Loading";
import { useTransactionStore } from "@/store/transactionStore";
import { useCurrencyStore } from "@/store/currencyStore";
import CountUp from "react-countup";
import StatsFilterModal from "@/components/statsFilterModal/statsFilterModal";
import { StatsFilterState, TransactionType } from "@/types";
import { INITIAL_FILTER_STATE } from "@/constants";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { StatChartCard } from "@/components";

export default function Stats() {
    const { transactions: storeTransactions, fetchTransactions, isInitialized, isLoading } = useTransactionStore();
    const { currencyInfo, format } = useCurrencyStore();
    const [timeframe, setTimeframe] = useState<TimeframeOption | null>(null);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<StatsFilterState>(INITIAL_FILTER_STATE);

    useEffect(() => {
        if (!isInitialized) {
            fetchTransactions();
        }
    }, [isInitialized, fetchTransactions]);

    const availableCategories = useMemo(() => {
        if (!storeTransactions) return [];
        const set = new Set<string>();
        storeTransactions.forEach((t: TransactionType) => {
            if (t.catogory) set.add(t.catogory.trim());
        });
        return Array.from(set).sort();
    }, [storeTransactions]);

    const hasActiveFilters = 
        filters.type !== 'all' || 
        filters.category !== 'all' || 
        Boolean(filters.minAmount) || 
        Boolean(filters.maxAmount) || 
        filters.dateRange !== 'all';

    const { allTransactions, totalIncome, totalExpense, totalDebt, incomeCategories, expenseCategories, debtCategories } = useMemo(() => {
        let incSum = 0;
        let expSum = 0;
        let debtSum = 0;
        const incCats: Record<string, number> = {};
        const expCats: Record<string, number> = {};
        const debtCats: Record<string, number> = {};
        let filtered: TransactionType[] = [];

        if (storeTransactions) {
            filtered = storeTransactions.filter((t: TransactionType) => {
                const date = new Date(t.createdAt || t.updatedAt);
                if (isNaN(date.getTime())) return false;

                // 1. Transaction Type filter
                if (filters.type !== "all" && t.transactiontype !== filters.type) {
                    return false;
                }

                // 2. Category filter
                if (filters.category !== "all") {
                    if (!t.catogory || t.catogory.toLowerCase() !== filters.category.toLowerCase()) {
                        return false;
                    }
                }

                // 3. Amount filter
                const amt = Number(t.amount);
                if (filters.minAmount !== "" && !isNaN(Number(filters.minAmount))) {
                    if (amt < Number(filters.minAmount)) return false;
                }
                if (filters.maxAmount !== "" && !isNaN(Number(filters.maxAmount))) {
                    if (amt > Number(filters.maxAmount)) return false;
                }

                // 4. Date filter
                if (filters.dateRange === "year") {
                    if (date.getFullYear() !== new Date().getFullYear()) {
                        return false;
                    }
                } else if (filters.dateRange === "custom") {
                    if (filters.startDate) {
                        const start = new Date(filters.startDate);
                        start.setHours(0, 0, 0, 0);
                        if (date < start) return false;
                    }
                    if (filters.endDate) {
                        const end = new Date(filters.endDate);
                        end.setHours(23, 59, 59, 999);
                        if (date > end) return false;
                    }
                } else {
                    // Timeframe from top toggle
                    if (timeframe === "daily") {
                        const now = new Date();
                        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                        return date >= startOfToday && date <= endOfToday;
                    }
                    if (timeframe === "weekly") {
                        const now = new Date();
                        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
                        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                        return date >= startOfWeek && date <= endOfToday;
                    }
                    if (timeframe === "monthly") {
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }
                }

                return true;
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
    }, [storeTransactions, timeframe, filters]);


    const getPeriodLabel = () => {
        if (filters.dateRange === "year") return "this year";
        if (filters.dateRange === "custom") return "in date range";
        if (timeframe === "daily") return "today";
        if (timeframe === "weekly") return "this week";
        if (timeframe === "monthly") return "this month";
        return "recorded";
    };

    const handleClearAll = () => {
        setTimeframe(null);
        setFilters(INITIAL_FILTER_STATE);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Analytics & Stats" 
                    badge={
                        <span>
                            <CountUp end={allTransactions.length} duration={0.6} preserveValue /> {allTransactions.length === 1 ? 'record' : 'records'}
                        </span>
                    } 
                />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-3 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Filter Controls Row */}
                    <div className="flex items-center justify-center gap-2 w-full">
                        {/* Clear Button */}
                        <button
                            type="button"
                            onClick={handleClearAll}
                            disabled={!timeframe && !hasActiveFilters}
                            title={timeframe || hasActiveFilters ? "Clear all filters" : "No filter active"}
                            aria-label="Clear filter"
                            className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                                timeframe || hasActiveFilters
                                    ? "bg-gray-200/60 hover:bg-rose-50 text-gray-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-gray-300 dark:hover:text-rose-400 active:scale-95 cursor-pointer shadow-xs"
                                    : "bg-gray-200/60 text-gray-300 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed opacity-70"
                            }`}
                        >
                            <CloseIcon className="w-[15px] h-[15px]" strokeWidth={2.4} />
                        </button>

                        {/* MishalToggle */}
                        <div className="min-w-0 flex-1 max-w-xs">
                            <MishalToggle 
                                active={timeframe} 
                                onChange={(tab) => {
                                    setTimeframe(tab);
                                    if (filters.dateRange !== "all") {
                                        setFilters(f => ({ ...f, dateRange: "all" }));
                                    }
                                }} 
                                allowDeselect 
                                onClear={() => setTimeframe(null)} 
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            type="button"
                            onClick={() => setFilterModalOpen(true)}
                            title={hasActiveFilters ? "Filters active" : "Filter options"}
                            aria-label="Filter options"
                            className={`h-11 w-11 shrink-0 relative flex items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer shadow-xs ${
                                hasActiveFilters
                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md ring-2 ring-black/10 dark:ring-white/20"
                                    : "bg-gray-200/60 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                            }`}
                        >
                            <FilterIcon className="w-4 h-4" strokeWidth={2.2} />
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                            )}
                        </button>
                    </div>

                    {/* Active Filter Chips */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-1.5 px-1 animate-fade-in text-[11px]">
                            {filters.type !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50 font-medium capitalize">
                                    Type: {filters.type}
                                    <button 
                                        type="button" 
                                        onClick={() => setFilters(f => ({ ...f, type: "all" }))}
                                        className="hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                                        aria-label="Remove type filter"
                                    >×</button>
                                </span>
                            )}
                            {filters.category !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 font-medium capitalize">
                                    Cat: {filters.category}
                                    <button 
                                        type="button" 
                                        onClick={() => setFilters(f => ({ ...f, category: "all" }))}
                                        className="hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                                        aria-label="Remove category filter"
                                    >×</button>
                                </span>
                            )}
                            {(filters.minAmount || filters.maxAmount) && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50 font-medium">
                                    Amount: {filters.minAmount ? `≥${currencyInfo.symbol.trim()}${filters.minAmount}` : ''} {filters.maxAmount ? `≤${currencyInfo.symbol.trim()}${filters.maxAmount}` : ''}
                                    <button 
                                        type="button" 
                                        onClick={() => setFilters(f => ({ ...f, minAmount: "", maxAmount: "" }))}
                                        className="hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                                        aria-label="Remove amount filter"
                                    >×</button>
                                </span>
                            )}
                            {filters.dateRange !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/50 font-medium">
                                    {filters.dateRange === "year" ? "This Year" : `${filters.startDate || ''} → ${filters.endDate || ''}`}
                                    <button 
                                        type="button" 
                                        onClick={() => setFilters(f => ({ ...f, dateRange: "all", startDate: "", endDate: "" }))}
                                        className="hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                                        aria-label="Remove date range filter"
                                    >×</button>
                                </span>
                            )}
                        </div>
                    )}

                    { isLoading || !isInitialized ? (
                        <div className="w-full flex flex-col gap-4 mt-1 animate-fade-in">
                            <Loading fullPage={false} type="stats" />
                        </div>
                    ) : (
                        <div 
                            key={`${timeframe || 'all'}-${filters.type}-${filters.category}-${filters.minAmount}-${filters.maxAmount}-${filters.dateRange}`} 
                            className="flex flex-col gap-4 mt-1 animate-fade-in-up" 
                            style={{ animationDelay: '0.2s' }}
                        >
                            {/* EXPENSE SECTION */}
                            {(filters.type === "all" || filters.type === "expense") && (
                                <StatChartCard
                                    title="Expenses Breakdown"
                                    chartId="expensechart"
                                    categories={expenseCategories}
                                    total={totalExpense}
                                    emptyIcon="📉"
                                    emptyMessage={`No expenses ${getPeriodLabel()}`}
                                />
                            )}

                            {/* INCOME SECTION */}
                            {(filters.type === "all" || filters.type === "income") && (
                                <StatChartCard
                                    title="Income Breakdown"
                                    chartId="incomechart"
                                    categories={incomeCategories}
                                    total={totalIncome}
                                    emptyIcon="📈"
                                    emptyMessage={`No income ${getPeriodLabel()}`}
                                />
                            )}

                            {/* DEBT SECTION */}
                            {(filters.type === "all" || filters.type === "debt") && totalDebt > 0 && (
                                <StatChartCard
                                    title="Debt/Lent Breakdown"
                                    chartId="debtchart"
                                    categories={debtCategories}
                                    total={totalDebt}
                                    emptyIcon="🤝"
                                    emptyMessage={`No debt records ${getPeriodLabel()}`}
                                />
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

            {/* Filter Modal */}
            <StatsFilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onApply={(newFilters) => setFilters(newFilters)}
                onReset={() => setFilters(INITIAL_FILTER_STATE)}
                availableCategories={availableCategories}
                currencySymbol={currencyInfo.symbol}
                matchingCount={allTransactions.length}
            />
        </div>
    );
}

