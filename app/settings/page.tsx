"use client"

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";
import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import toast from "react-hot-toast";
import { useForm, ValidationError } from '@formspree/react';
import { useCurrencyStore } from "@/store/currencyStore";
import { SUPPORTED_CURRENCIES } from "@/constants/currencies";
import WipeDataModal from "@/components/wipeDataModal/wipeDataModal";

export default function Settings() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { transactions, deleteAllTransactions, setAllTransactions } = useTransactionStore();
    const { budgetLimit, budgetInitialized, fetchBudget, setBudgetLimit, clearBudgetLimit } = useBudgetStore();
    const { currentCurrency, currencyInfo, setCurrency, convert, convertToBase, format } = useCurrencyStore();
    const [budgetInput, setBudgetInput] = useState("");
    const [isCurrencyExpanded, setIsCurrencyExpanded] = useState(false);
    const [showWipeModal, setShowWipeModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_ID || 'dummy_key');

    useEffect(() => {
        setMounted(true);
        if (!budgetInitialized) {
            fetchBudget();
        }
    }, [budgetInitialized, fetchBudget]);

    useEffect(() => {
        if (budgetLimit !== null) {
            setBudgetInput(String(convert(budgetLimit)));
        }
    }, [budgetLimit, currentCurrency, convert]);

    const handleWipeData = () => {
        setShowWipeModal(true);
    };

    const confirmWipeData = async () => {
        try {
            await deleteAllTransactions();
            toast.success("All data wiped successfully.");
            setShowWipeModal(false);
        } catch (error) {
            console.error("Failed to wipe data", error);
            toast.error("Failed to wipe data.");
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'cashbook-backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    if (confirm("This will overwrite your existing data. Proceed?")) {
                        await setAllTransactions(parsed);
                        toast.success("Data imported successfully.");
                    }
                } else {
                    toast.error("Invalid backup file format.");
                }
            } catch (error) {
                console.error("Failed to parse JSON", error);
                toast.error("Failed to read the backup file.");
            }
        };
        reader.readAsText(file);
    };

    const handleBudgetSave = async () => {
        const amount = Number(budgetInput);
        if (!budgetInput || isNaN(amount) || amount <= 0) {
            toast.error("Enter a valid budget amount.");
            return;
        }
        const baseAmount = convertToBase(amount);
        await setBudgetLimit(baseAmount);
        toast.success(`Monthly budget set to ${format(baseAmount)}`);
    };

    const handleBudgetClear = async () => {
        await clearBudgetLimit();
        setBudgetInput("");
        toast.success("Budget limit removed.");
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />
            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                
                <PageHeader title="Settings" />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Dark Mode */}
                        <div className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Dark Mode</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Toggle dark mode theme</p>
                            </div>
                            {mounted && (
                                <label className="inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={resolvedTheme === 'dark'}
                                        onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                                </label>
                            )}
                        </div>

                        {/* Currency Preferences */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            {/* Card Header with Arrow Toggle */}
                            <div 
                                className="flex items-center justify-between cursor-pointer select-none group"
                                onClick={() => setIsCurrencyExpanded(!isCurrencyExpanded)}
                            >
                                <div className="pr-3">
                                    <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        Currency & Region
                                    </h3>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400">
                                        Choose your display currency. Amounts across the app will convert automatically.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCurrencyExpanded(!isCurrencyExpanded);
                                    }}
                                    aria-label={isCurrencyExpanded ? "Collapse currency list" : "Expand currency list"}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all shrink-0 active:scale-90"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isCurrencyExpanded ? 'rotate-180' : ''}`}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>
                            
                            {mounted && (
                                <div className="flex flex-col gap-2.5">
                                    {/* Primary Currencies (Always Visible): INR & USD */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {SUPPORTED_CURRENCIES.filter(c => ['INR', 'USD'].includes(c.code)).map((cur) => {
                                            const isSelected = currentCurrency === cur.code;
                                            return (
                                                <button
                                                    key={cur.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrency(cur.code);
                                                        toast.success(`Currency switched to ${cur.name} (${cur.symbol.trim()})`);
                                                    }}
                                                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                                                        isSelected
                                                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                                                            : 'bg-gray-50/70 dark:bg-slate-800/60 border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                                                    }`}
                                                >
                                                    <span className="text-2xl">{cur.flag}</span>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                            {cur.code}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                            {cur.symbol.trim()} • {cur.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active indicator when collapsed and a non-primary currency is selected */}
                                    {!isCurrencyExpanded && !['INR', 'USD'].includes(currentCurrency) && (
                                        <div className="flex items-center justify-between text-xs px-3 py-2 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                                            <span className="text-slate-500 dark:text-slate-400">Active Currency:</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                                <span>{currencyInfo.flag}</span> {currencyInfo.code} ({currencyInfo.symbol.trim()})
                                            </span>
                                        </div>
                                    )}

                                    {/* Expandable Section with Smooth Grid Rows Animation */}
                                    <div
                                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                            isCurrencyExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                    >
                                        <div className="overflow-hidden flex flex-col gap-3.5 pt-1">
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                                                    More Currencies
                                                </span>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                                    {SUPPORTED_CURRENCIES.filter(c => !['INR', 'USD'].includes(c.code)).map((cur) => {
                                                        const isSelected = currentCurrency === cur.code;
                                                        return (
                                                            <button
                                                                key={cur.code}
                                                                type="button"
                                                                onClick={() => {
                                                                    setCurrency(cur.code);
                                                                    toast.success(`Currency switched to ${cur.name} (${cur.symbol.trim()})`);
                                                                }}
                                                                className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                                                                    isSelected
                                                                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                                                                        : 'bg-gray-50/70 dark:bg-slate-800/60 border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                                                                }`}
                                                            >
                                                                <span className="text-xl">{cur.flag}</span>
                                                                <div className="flex flex-col min-w-0 flex-1">
                                                                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                                        {cur.code}
                                                                    </span>
                                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                                        {cur.symbol.trim()} • {cur.name}
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Exchange Rate Reference Dictionary */}
                                            <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Exchange Rates Dictionary</span>
                                                    <span className="text-[11px] text-slate-400">Base: INR (₹)</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl">
                                                    {SUPPORTED_CURRENCIES.filter(c => c.code !== 'INR').map(c => (
                                                        <div key={c.code} className="flex items-center justify-between py-0.5">
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{c.flag} 1 {c.code}</span>
                                                            <span className="font-mono text-gray-500 dark:text-slate-400">≈ ₹{c.inrEquivalent.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                                                    All your raw records remain safely anchored to your base currency while being seamlessly converted for display.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand / Collapse Button Bar */}
                                    <button
                                        type="button"
                                        onClick={() => setIsCurrencyExpanded(!isCurrencyExpanded)}
                                        className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pt-1 cursor-pointer select-none"
                                    >
                                        <span>{isCurrencyExpanded ? "Show fewer currencies" : "More currencies & rates"}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${isCurrencyExpanded ? 'rotate-180' : ''}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Budget Preferences */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Budget Preferences</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Set your monthly spending limit to track your budget.</p>
                            </div>
                            <div className="flex items-center gap-2.5 mt-1">
                                <div className="relative flex-1">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">{currencyInfo.symbol}</span>
                                    <input
                                        type="number"
                                        value={budgetInput}
                                        onChange={(e) => setBudgetInput(e.target.value)}
                                        placeholder="e.g. 500"
                                        className="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 text-black dark:text-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleBudgetSave}
                                    className="px-5 py-3 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                            {budgetLimit !== null && (
                                <div className="flex items-center justify-between mt-1 pt-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Current limit: <span className="font-bold text-black dark:text-white">{format(budgetLimit)}</span>/month
                                    </p>
                                    <button
                                        onClick={handleBudgetClear}
                                        className="text-xs text-rose-500 dark:text-rose-400 font-semibold hover:underline transition-colors cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Data Backup */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Data Backup</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Export or import your transactions data.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-2 w-full">
                                <button 
                                    onClick={handleExport} 
                                    className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 rounded-2xl font-semibold text-sm hover:bg-blue-100/70 dark:hover:bg-blue-900/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    <span>Export Data</span>
                                </button>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-gray-50/80 text-gray-700 dark:bg-slate-800/70 dark:text-gray-200 border border-gray-200/70 dark:border-slate-700/80 rounded-2xl font-semibold text-sm hover:bg-gray-100/80 dark:hover:bg-slate-700/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <span>Import Data</span>
                                </button>
                                <input 
                                    type="file" 
                                    accept=".json"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImport}
                                />
                            </div>
                        </div>

                        {/* Feedback Form */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Feedback</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Send us your thoughts or report an issue.</p>
                            </div>
                            {state.succeeded ? (
                                <p className="text-sm text-green-600 dark:text-green-500 mt-2 font-medium">Thanks for your feedback!</p>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        required 
                                        placeholder="Your email"
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-500" />
                                    <textarea 
                                        name="message" 
                                        required 
                                        placeholder="Your message"
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-500" />
                                    <button 
                                        type="submit" 
                                        disabled={state.submitting}
                                        className="w-fit px-5 py-2.5 mt-1 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        Send Feedback
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-rose-600 dark:text-rose-500">Danger Zone</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Permanently delete all your transactions.</p>
                            </div>
                            <button 
                                onClick={handleWipeData} 
                                className="w-fit flex items-center gap-2 px-5 py-3 mt-1 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 rounded-2xl font-semibold text-sm hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                <span>Reset App</span>
                            </button>
                        </div>
                    </div>
            </main>

            {/* Wipe Confirmation Modal */}
            <WipeDataModal
                isOpen={showWipeModal}
                onClose={() => setShowWipeModal(false)}
                onConfirm={confirmWipeData}
                onBackup={handleExport}
                transactionCount={transactions?.length || 0}
            />
        </div>
    )
}