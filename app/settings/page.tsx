"use client"

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useBillStore } from "@/store/billStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { dbService } from "@/services/db";
import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import toast from "react-hot-toast";
import { useForm, ValidationError } from '@formspree/react';
import { useCurrencyStore } from "@/store/currencyStore";
import { SUPPORTED_CURRENCIES } from "@/constants/currencies";
import WipeDataModal from "@/components/wipeDataModal/wipeDataModal";
import Link from "next/link";
import { 
    ChevronDownIcon, 
    DownloadIcon, 
    UploadIcon, 
    TrashIcon, 
    CloseIcon, 
    DatabaseIcon, 
    RefreshCwIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CodeBracketIcon,
    ChevronRightIcon
} from "@/components/icons";
import { BackupData, TransactionType, BillType, SubscriptionType } from "@/types";

function formatBytes(bytes: number): string {
    if (bytes <= 0 || isNaN(bytes)) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    const value = bytes / Math.pow(k, i);
    return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${sizes[i]}`;
}

const isValidTransaction = (t: any): t is TransactionType => {
    return (
        t &&
        typeof t === 'object' &&
        typeof t.id === 'string' &&
        typeof t.amount === 'number' &&
        !isNaN(t.amount) &&
        typeof t.title === 'string' &&
        (t.type === 'income' || t.type === 'expense')
    );
};

const isValidBill = (b: any): b is BillType => {
    return (
        b &&
        typeof b === 'object' &&
        typeof b.id === 'string' &&
        typeof b.amount === 'number' &&
        !isNaN(b.amount) &&
        typeof b.title === 'string'
    );
};

const isValidSubscription = (s: any): s is SubscriptionType => {
    return (
        s &&
        typeof s === 'object' &&
        typeof s.id === 'string' &&
        typeof s.amount === 'number' &&
        !isNaN(s.amount) &&
        typeof s.name === 'string'
    );
};

interface ParsedImportData {
    transactions: TransactionType[];
    bills: BillType[];
    subscriptions: SubscriptionType[];
    budget: number | null | undefined;
    isLegacy: boolean;
}

export default function Settings() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { transactions, deleteAllTransactions, setAllTransactions, fetchTransactions, isInitialized: transInitialized } = useTransactionStore();
    const { bills, deleteAllBills, setAllBills, fetchBills, isInitialized: billsInitialized } = useBillStore();
    const { subscriptions, deleteAllSubscriptions, setAllSubscriptions, fetchSubscriptions, isInitialized: subsInitialized } = useSubscriptionStore();
    const { budgetLimit, budgetInitialized, fetchBudget, setBudgetLimit, clearBudgetLimit } = useBudgetStore();
    const { currentCurrency, currencyInfo, setCurrency, convert, convertToBase, format } = useCurrencyStore();
    const [budgetInput, setBudgetInput] = useState("");
    const [isCurrencyExpanded, setIsCurrencyExpanded] = useState(false);
    const [showWipeModal, setShowWipeModal] = useState(false);
    const [pendingImport, setPendingImport] = useState<ParsedImportData | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_PROJECT_ID || 'dummy_key');
    const [storageEstimate, setStorageEstimate] = useState<{ usage: number; quota: number } | null>(null);
    const [isCalculatingStorage, setIsCalculatingStorage] = useState(false);

    const updateStorageEstimate = useCallback(async (isManual = false) => {
        setIsCalculatingStorage(true);
        const startTime = Date.now();
        try {
            if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                setStorageEstimate({
                    usage: estimate.usage || 0,
                    quota: estimate.quota || 0,
                });
            }
            if (isManual) {
                // Keep rotating animation running for a few seconds for clear feedback
                const elapsed = Date.now() - startTime;
                const minDuration = 1800;
                if (elapsed < minDuration) {
                    await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
                }
                toast.success("Storage size updated", { id: "storage-refresh" });
            }
        } catch (e) {
            console.error("Storage estimate error", e);
        } finally {
            setIsCalculatingStorage(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            updateStorageEstimate(false);
        }
    }, [mounted, updateStorageEstimate, transactions.length, bills.length, subscriptions.length]);

    const recordBytes = useMemo(() => {
        try {
            const payload = JSON.stringify({
                transactions,
                bills,
                subscriptions,
                budget: budgetLimit
            });
            return new Blob([payload]).size;
        } catch {
            return 0;
        }
    }, [transactions, bills, subscriptions, budgetLimit]);

    const totalRecordCount = transactions.length + bills.length + subscriptions.length;

    useEffect(() => {
        setMounted(true);
        if (!budgetInitialized) fetchBudget();
        if (!transInitialized) fetchTransactions();
        if (!billsInitialized) fetchBills();
        if (!subsInitialized) fetchSubscriptions();
    }, [budgetInitialized, fetchBudget, transInitialized, fetchTransactions, billsInitialized, fetchBills, subsInitialized, fetchSubscriptions]);

    useEffect(() => {
        if (budgetLimit !== null) {
            setBudgetInput(String(convert(budgetLimit)));
        }
    }, [budgetLimit, currentCurrency, convert]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && pendingImport && !isImporting) {
                setPendingImport(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [pendingImport, isImporting]);

    const handleWipeData = () => {
        setShowWipeModal(true);
    };

    const confirmWipeData = async () => {
        try {
            await Promise.all([
                deleteAllTransactions(),
                deleteAllBills(),
                deleteAllSubscriptions(),
                clearBudgetLimit()
            ]);
            setBudgetInput("");
            toast.success("All data wiped successfully.");
            setShowWipeModal(false);
            updateStorageEstimate(false);
        } catch (error) {
            console.error("Failed to wipe data", error);
            toast.error("Failed to wipe data.");
        }
    };

    const handleExport = async () => {
        try {
            const [transactionsData, billsData, subsData, budgetData] = await Promise.all([
                dbService.getAllTransactions(),
                dbService.getAllBills(),
                dbService.getAllSubscriptions(),
                dbService.getBudget()
            ]);

            const backupPayload: BackupData = {
                version: 1,
                exportedAt: new Date().toISOString(),
                transactions: transactionsData,
                bills: billsData,
                subscriptions: subsData,
                budget: budgetData
            };

            const dataStr = JSON.stringify(backupPayload, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const exportFileDefaultName = `cashbook-backup-${new Date().toISOString().slice(0, 10)}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', url);
            linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
            URL.revokeObjectURL(url);

            toast.success("Backup downloaded successfully.");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to generate backup.");
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsed = JSON.parse(content);
                let importData: ParsedImportData | null = null;

                if (Array.isArray(parsed)) {
                    // Legacy backup format (array of transactions)
                    const sanitizedTransactions = parsed.filter(isValidTransaction);
                    importData = {
                        transactions: sanitizedTransactions,
                        bills: [],
                        subscriptions: [],
                        budget: undefined,
                        isLegacy: true,
                    };
                } else if (parsed && typeof parsed === 'object') {
                    if (
                        Array.isArray(parsed.transactions) || 
                        Array.isArray(parsed.bills) || 
                        Array.isArray(parsed.subscriptions) ||
                        parsed.budget !== undefined
                    ) {
                        const sanitizedTransactions = Array.isArray(parsed.transactions)
                            ? parsed.transactions.filter(isValidTransaction)
                            : [];
                        const sanitizedBills = Array.isArray(parsed.bills)
                            ? parsed.bills.filter(isValidBill)
                            : [];
                        const sanitizedSubs = Array.isArray(parsed.subscriptions)
                            ? parsed.subscriptions.filter(isValidSubscription)
                            : [];
                        const parsedBudget = typeof parsed.budget === 'number' && !isNaN(parsed.budget) && parsed.budget > 0
                            ? parsed.budget
                            : parsed.budget === null
                            ? null
                            : undefined;

                        importData = {
                            transactions: sanitizedTransactions,
                            bills: sanitizedBills,
                            subscriptions: sanitizedSubs,
                            budget: parsedBudget,
                            isLegacy: false,
                        };
                    }
                }

                if (
                    importData && 
                    (importData.transactions.length > 0 || 
                     importData.bills.length > 0 || 
                     importData.subscriptions.length > 0 || 
                     importData.budget !== undefined)
                ) {
                    setPendingImport(importData);
                } else {
                    toast.error("No valid financial records found in backup.");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            } catch (error) {
                console.error("Failed to parse JSON", error);
                toast.error("Failed to read the backup file.");
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    };

    const executeImport = async () => {
        if (!pendingImport) return;
        setIsImporting(true);
        try {
            const promises: Promise<void>[] = [];
            
            if (pendingImport.isLegacy) {
                if (pendingImport.transactions.length > 0) {
                    promises.push(setAllTransactions(pendingImport.transactions));
                }
            } else {
                promises.push(setAllTransactions(pendingImport.transactions));
                promises.push(setAllBills(pendingImport.bills));
                promises.push(setAllSubscriptions(pendingImport.subscriptions));
                
                if (typeof pendingImport.budget === 'number') {
                    promises.push(setBudgetLimit(pendingImport.budget));
                    setBudgetInput(String(convert(pendingImport.budget)));
                } else if (pendingImport.budget === null) {
                    promises.push(clearBudgetLimit());
                    setBudgetInput("");
                }
            }

            await Promise.all(promises);
            toast.success("Backup restored successfully!");
            setPendingImport(null);
            updateStorageEstimate(false);
        } catch (error) {
            console.error("Import failed", error);
            toast.error("Failed to restore backup.");
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isCurrencyExpanded ? 'rotate-180' : ''}`}
                                    />
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
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleBudgetSave();
                                            }
                                        }}
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
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Export or import your complete financial data (transactions, bills, subscriptions, and budget).</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-2 w-full">
                                <button 
                                    onClick={handleExport} 
                                    className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 rounded-2xl font-semibold text-sm hover:bg-blue-100/70 dark:hover:bg-blue-900/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                                >
                                    <DownloadIcon className="w-4 h-4 shrink-0" />
                                    <span>Export Data</span>
                                </button>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="flex items-center justify-center gap-2 w-full py-3 px-3 bg-gray-50/80 text-gray-700 dark:bg-slate-800/70 dark:text-gray-200 border border-gray-200/70 dark:border-slate-700/80 rounded-2xl font-semibold text-sm hover:bg-gray-100/80 dark:hover:bg-slate-700/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                                >
                                    <UploadIcon className="w-4 h-4 shrink-0" />
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

                        {/* Storage Occupied Card */}
                        <div className="flex flex-col gap-3.5 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                        <DatabaseIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">Storage & Data Size</h3>
                                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Local device storage occupied by Cashbook.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => updateStorageEstimate(true)}
                                    disabled={isCalculatingStorage}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60"
                                    title="Recalculate storage estimate"
                                    aria-label="Recalculate storage estimate"
                                >
                                    <RefreshCwIcon className={`w-4 h-4 transition-colors ${isCalculatingStorage ? 'animate-spin text-blue-500 dark:text-blue-400' : ''}`} />
                                </button>
                            </div>

                            {/* Storage Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                        Total App Storage
                                    </span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                            {storageEstimate ? formatBytes(storageEstimate.usage) : formatBytes(recordBytes)}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                                        PWA Cache & DB
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                        Financial Records
                                    </span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                            {formatBytes(recordBytes)}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                                        {totalRecordCount} total {totalRecordCount === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                            </div>

                            {/* Item Count Chips */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                                    {transactions.length} Transactions
                                </span>
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                                    {bills.length} Bills
                                </span>
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                                    {subscriptions.length} Subscriptions
                                </span>
                            </div>

                            {/* Local device privacy indicator */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/80 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span>100% stored offline on this device · Zero external servers</span>
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

                        {/* About & Legal */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">About & Legal</h3>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400">Offline architecture, privacy policy, and developer hub.</p>
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    v1.2.0
                                </span>
                            </div>

                            <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800/80 mt-1">
                                <Link 
                                    href="/privacy"
                                    className="flex items-center justify-between py-3 group hover:opacity-90 transition-opacity"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <ShieldCheckIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Privacy Policy</span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">100% on-device data · Zero tracking</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <Link 
                                    href="/terms"
                                    className="flex items-center justify-between py-3 group hover:opacity-90 transition-opacity"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <DocumentTextIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Terms of Service</span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">Software utility license & disclaimers</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <Link 
                                    href="/support"
                                    className="flex items-center justify-between py-3 group hover:opacity-90 transition-opacity"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                            <CodeBracketIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-gray-900 dark:text-white block group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Developer Support</span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">Open source docs, GitHub repo & FAQs</span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div>
                                <h3 className="font-bold text-[15px] text-rose-600 dark:text-rose-500">Danger Zone</h3>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400">Permanently delete all your data (transactions, bills, subscriptions, and budget).</p>
                            </div>
                            <button 
                                onClick={handleWipeData} 
                                className="w-fit flex items-center gap-2 px-5 py-3 mt-1 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 rounded-2xl font-semibold text-sm hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-all shadow-xs active:scale-95 cursor-pointer"
                            >
                                <TrashIcon className="w-4 h-4 shrink-0" />
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
                billCount={bills?.length || 0}
                subscriptionCount={subscriptions?.length || 0}
            />

            {/* Restore Backup Confirmation Modal */}
            {pendingImport && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={() => !isImporting && setPendingImport(null)}
                >
                    <div 
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-black dark:text-white animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => !isImporting && setPendingImport(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center mt-1">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-3 shadow-inner">
                                <UploadIcon className="w-7 h-7" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Restore Backup?
                            </h2>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                This will replace your current data with the contents of your backup file:
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
                            <div className="flex justify-between py-0.5 border-b border-gray-100 dark:border-slate-700/40">
                                <span className="text-gray-500 dark:text-gray-400">Transactions:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{pendingImport.transactions.length}</span>
                            </div>
                            {!pendingImport.isLegacy ? (
                                <>
                                    <div className="flex justify-between py-0.5 border-b border-gray-100 dark:border-slate-700/40">
                                        <span className="text-gray-500 dark:text-gray-400">Bills:</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">{pendingImport.bills.length}</span>
                                    </div>
                                    <div className="flex justify-between py-0.5 border-b border-gray-100 dark:border-slate-700/40">
                                        <span className="text-gray-500 dark:text-gray-400">Subscriptions:</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">{pendingImport.subscriptions.length}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between py-0.5 border-b border-gray-100 dark:border-slate-700/40 text-[11px] text-slate-500 dark:text-slate-400 italic">
                                    <span>Format:</span>
                                    <span>Legacy backup (transactions only)</span>
                                </div>
                            )}
                            {pendingImport.budget !== undefined && (
                                <div className="flex justify-between py-0.5">
                                    <span className="text-gray-500 dark:text-gray-400">Monthly Budget:</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-100">
                                        {pendingImport.budget !== null ? format(pendingImport.budget) : 'None'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-medium">
                            ⚠️ Warning: Existing database items will be overwritten.
                        </p>

                        <div className="grid grid-cols-2 gap-2.5 mt-1">
                            <button
                                type="button"
                                disabled={isImporting}
                                onClick={() => {
                                    setPendingImport(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="w-full py-3 px-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isImporting}
                                onClick={executeImport}
                                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                {isImporting ? "Restoring..." : "Restore Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}