"use client"

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON, INITIAL_FILTER_STATE } from "@/constants";
import { FilterIcon, CloseIcon } from "@/components/icons";
import { StatsFilterState, StatsFilterModalProps } from "@/types";

export type { StatsFilterState, StatsFilterModalProps };
export { INITIAL_FILTER_STATE };

export default function StatsFilterModal({
    isOpen,
    onClose,
    filters,
    onApply,
    onReset,
    availableCategories,
    currencySymbol,
    matchingCount
}: StatsFilterModalProps) {
    const [mounted, setMounted] = useState(false);
    const [draft, setDraft] = useState<StatsFilterState>(filters);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync draft with current filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setDraft(filters);
        }
    }, [isOpen, filters]);

    if (!isOpen || !mounted) return null;

    const handleApply = () => {
        onApply(draft);
        onClose();
    };

    const handleReset = () => {
        setDraft(INITIAL_FILTER_STATE);
        onReset();
        onClose();
    };

    const isFiltered = 
        draft.type !== "all" ||
        draft.category !== "all" ||
        Boolean(draft.minAmount) ||
        Boolean(draft.maxAmount) ||
        draft.dateRange !== "all";

    const modalContent = (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] text-black dark:text-white animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (Pinned) */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-700 dark:text-gray-200">
                            <FilterIcon className="w-4 h-4" strokeWidth={2.2} />
                        </div>
                        <div>
                            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">Filter Statistics</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Refine charts & category breakdown</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Close filter modal"
                    >
                        <CloseIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto sleek-scrollbar flex flex-col gap-5 py-4 pr-1">
                    {/* 1. Transaction Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Transaction Type
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl">
                            {(["all", "expense", "income", "debt"] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setDraft(d => ({ ...d, type }))}
                                    className={`py-2 px-1 text-center capitalize text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                                        draft.type === type
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                    }`}
                                >
                                    {type === "all" ? "All" : type === "debt" ? "Debt" : type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Category */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Category
                            </label>
                            {/*
                            SHOWS CLEAR CATEGORY BUTTON WHEN A CATEGORY IS SELECTED
                            {draft.category !== "all" && (
                                <button
                                    type="button"
                                    onClick={() => setDraft(d => ({ ...d, category: "all" }))}
                                    className="text-[11px] text-blue-500 hover:underline cursor-pointer font-medium"
                                >
                                    Clear Category
                                </button>
                            )} */}
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto sleek-scrollbar p-0.5">
                            <button
                                type="button"
                                onClick={() => setDraft(d => ({ ...d, category: "all" }))}
                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                    draft.category === "all"
                                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                All Categories
                            </button>
                            {availableCategories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setDraft(d => ({ ...d, category: cat }))}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                                        draft.category.toLowerCase() === cat.toLowerCase()
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                }`}
                                >
                                    <Image
                                        src={CATEGORY_ICONS[cat.toLowerCase()] || DEFAULT_CATEGORY_ICON}
                                        width={14}
                                        height={14}
                                        alt={cat}
                                        className={`shrink-0 transition-all ${
                                            draft.category.toLowerCase() === cat.toLowerCase()
                                                ? "invert dark:invert-0 opacity-100"
                                                : "dark:invert opacity-75"
                                        }`}
                                    />
                                    <span>{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Amount Range */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Amount Range ({currencySymbol.trim()})
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Min Amount</span>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-xs text-gray-400 pointer-events-none font-semibold">
                                        {currencySymbol.trim()}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={draft.minAmount}
                                        onChange={(e) => setDraft(d => ({ ...d, minAmount: e.target.value }))}
                                        className="w-full h-10 pl-7 pr-3 text-xs rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-hidden focus:ring-1.5 focus:ring-black dark:focus:ring-white text-black dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Max Amount</span>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-xs text-gray-400 pointer-events-none font-semibold">
                                        {currencySymbol.trim()}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="No limit"
                                        value={draft.maxAmount}
                                        onChange={(e) => setDraft(d => ({ ...d, maxAmount: e.target.value }))}
                                        className="w-full h-10 pl-7 pr-3 text-xs rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-hidden focus:ring-1.5 focus:ring-black dark:focus:ring-white text-black dark:text-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick amount presets */}
                        <div className="flex items-center gap-1.5 mt-0.5 overflow-x-auto pb-1 sleek-scrollbar">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold shrink-0">Quick:</span>
                            {[500, 1000, 2500, 5000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setDraft(d => ({ ...d, minAmount: String(amt), maxAmount: "" }))}
                                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                                        draft.minAmount === String(amt) && !draft.maxAmount
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    &gt; {currencySymbol.trim()}{amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Date Scope */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Date Range Scope
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl">
                            {(["all", "year", "custom"] as const).map(scope => (
                                <button
                                    key={scope}
                                    type="button"
                                    onClick={() => setDraft(d => ({ ...d, dateRange: scope }))}
                                    className={`py-2 px-1 text-center capitalize text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                                        draft.dateRange === scope
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                    }`}
                                >
                                    {scope === "all" ? "All Time" : scope === "year" ? "This Year" : "Custom"}
                                </button>
                            ))}
                        </div>

                        {draft.dateRange === "custom" && (
                            <div className="grid grid-cols-2 gap-2.5 mt-1 animate-fade-in">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">From Date</span>
                                    <input
                                        type="date"
                                        value={draft.startDate}
                                        onChange={(e) => setDraft(d => ({ ...d, startDate: e.target.value }))}
                                        className="w-full h-10 px-3 text-xs rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white [color-scheme:light] dark:[color-scheme:dark] focus:outline-hidden focus:ring-1.5 focus:ring-black dark:focus:ring-white transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">To Date</span>
                                    <input
                                        type="date"
                                        value={draft.endDate}
                                        onChange={(e) => setDraft(d => ({ ...d, endDate: e.target.value }))}
                                        className="w-full h-10 px-3 text-xs rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white [color-scheme:light] dark:[color-scheme:dark] focus:outline-hidden focus:ring-1.5 focus:ring-black dark:focus:ring-white transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pinned Footer Action Buttons */}
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-gray-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={!isFiltered}
                        className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all ${
                            isFiltered
                                ? "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 cursor-pointer active:scale-95"
                                : "bg-gray-100/50 dark:bg-slate-800/40 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        Reset All
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="flex-2 py-3 px-4 rounded-2xl text-xs font-bold bg-black text-white dark:bg-white dark:text-black shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <span>Apply Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
