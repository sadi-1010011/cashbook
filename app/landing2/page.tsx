"use client"

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import BrandLogo from "@/assets/logo.png";
import { 
    DownloadIcon, 
    ShieldCheckIcon, 
    DatabaseIcon, 
    GlobeIcon, 
    RenewIcon, 
    ReceiptIcon, 
    ZapIcon, 
    BarChartIcon, 
    CreditCardIcon, 
    CheckIcon, 
    SolidCheckIcon, 
    WifiOffIcon, 
    SparklesIcon, 
    ExternalLinkIcon, 
    ChevronRightIcon, 
    ArrowPathIcon,
    ChevronDownIcon,
    CloseIcon,
    PlusIcon,
    FilterIcon,
    LineChartIcon,
    DonutChartIcon
} from "@/components/icons";

interface InstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function LandingPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    
    // Interactive Hero Mockup States
    const [activeTab, setActiveTab] = useState<'dashboard' | 'bills' | 'currencies' | 'privacy'>('dashboard');
    const [demoFilter, setDemoFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [demoCurrency, setDemoCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'JPY'>('USD');
    const [paidBills, setPaidBills] = useState<Record<string, boolean>>({ "Apartment Rent": false, "Fiber Internet": false, "Netflix Premium": true });
    const [addedDemoTx, setAddedDemoTx] = useState(false);
    
    // FAQ Accordion State
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    // Savings Slider State
    const [monthlyAppCost, setMonthlyAppCost] = useState<number>(12);

    useEffect(() => {
        setMounted(true);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as InstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            setShowInstallModal(true);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Currency Conversion Table for Demo Mockup
    const currencyRates: Record<string, { symbol: string; rate: number; flag: string; name: string }> = {
        USD: { symbol: "$", rate: 1, flag: "🇺🇸", name: "US Dollar" },
        EUR: { symbol: "€", rate: 0.92, flag: "🇪🇺", name: "Euro" },
        GBP: { symbol: "£", rate: 0.78, flag: "🇬🇧", name: "British Pound" },
        INR: { symbol: "₹", rate: 86.20, flag: "🇮🇳", name: "Indian Rupee" },
        AED: { symbol: "AED ", rate: 3.67, flag: "🇦🇪", name: "UAE Dirham" },
        JPY: { symbol: "¥", rate: 154.0, flag: "🇯🇵", name: "Japanese Yen" }
    };

    const formatDemoAmt = (usdValue: number) => {
        const c = currencyRates[demoCurrency];
        const val = usdValue * c.rate;
        if (demoCurrency === 'JPY') return `${c.symbol}${Math.round(val).toLocaleString()}`;
        return `${c.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const demoTransactionsList = useMemo(() => {
        const base = [
            { id: 1, title: "Client Invoice / Salary", cat: "Income", type: "income", usd: 5200.00, date: "Today, 10:15 AM", icon: "💼" },
            { id: 2, title: "Whole Foods Market", cat: "Groceries", type: "expense", usd: 85.50, date: "Today, 01:20 PM", icon: "🛒" },
            { id: 3, title: "WeWork Desk Space", cat: "Workspace", type: "expense", usd: 120.00, date: "Yesterday", icon: "🏢" },
            { id: 4, title: "Metro Transit Card", cat: "Travel", type: "expense", usd: 24.50, date: "Oct 10", icon: "🚇" },
        ];
        if (addedDemoTx) {
            base.unshift({ id: 0, title: "Coffee & Pastry", cat: "Cafe", type: "expense", usd: 6.75, date: "Just now", icon: "☕" });
        }
        if (demoFilter === 'all') return base;
        return base.filter(t => t.type === demoFilter);
    }, [demoFilter, addedDemoTx]);

    const faqs = [
        {
            q: "Where is my financial data stored and who can see it?",
            a: "100% on your device inside your browser's sandboxed IndexedDB database. Cashbook operates without backend microservices, user databases, or cloud accounts. Your money records never leave your physical device, making it impossible for anyone to view, sell, or scrape your data."
        },
        {
            q: "How does installing a Progressive Web App (PWA) work without the App Store?",
            a: "Cashbook uses modern PWA standards. On mobile, tap 'Download App' or tap 'Share > Add to Home Screen' in Safari/Chrome. On desktop, click the install icon in your browser URL bar. It installs in under 3 seconds, creates a native icon, runs in a dedicated standalone window, and takes less than 5 MB of space."
        },
        {
            q: "Can I use Cashbook completely without internet access?",
            a: "Yes. All application assets, logic, and databases are cached locally via our Service Worker. You can log expenses, track budgets, and manage bills mid-flight, on remote journeys, or in subways with zero network connection."
        },
        {
            q: "How do I back up or transfer my records to a new phone?",
            a: "Go to Settings and tap 'Export Data'. You'll immediately receive an unencrypted, complete JSON backup file. On your new phone or laptop, open Cashbook and tap 'Import Data' to instantly restore your entire transaction, bill, and budget ledger."
        },
        {
            q: "Does Cashbook link to my bank account or credit cards?",
            a: "No. Third-party bank linkages (like Plaid or Yodlee) store your bank credentials and monetize transaction telemetry. Cashbook gives you manual, ultra-fast control so you maintain 100% sovereignty over your financial life."
        },
        {
            q: "Is Cashbook really completely free and open source?",
            a: "Yes. Cashbook has zero subscription tiers, zero in-app purchases, and zero ads. The entire codebase is transparent and open-source on GitHub."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans selection:bg-blue-600 selection:text-white">
            
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                            <Image src={BrandLogo} alt="CashBook Logo" width={26} height={26} className="invert dark:invert-0" priority />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white leading-none">CashBook</span>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase mt-0.5">100% Offline PWA</span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                        <a href="#screens" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Live Preview</a>
                        <a href="#comparison" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Why CashBook</a>
                        <a href="#install" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Install Guide</a>
                        <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                aria-label="Toggle dark mode"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                        )}

                        <button 
                            onClick={handleInstallClick}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95"
                        >
                            <DownloadIcon className="w-3.5 h-3.5" />
                            <span>Install App</span>
                        </button>

                        <Link 
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-black text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm active:scale-95"
                        >
                            <span>Open App</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
                {/* Background decorative atmosphere */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-emerald-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
                    
                    {/* Eyebrow Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs mb-6 animate-fade-in backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>Client-Side IndexedDB Sandbox · Zero Cloud Telemetry · Instant PWA</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.12] text-slate-900 dark:text-white">
                        Take Total Custody of Your Money. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                            Zero Cloud. Zero Subscriptions.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        The modern offline-first personal finance application. Record transactions, forecast upcoming bills, audit recurring subscriptions, and convert 8 global currencies—100% private on your own device.
                    </p>

                    {/* Dual Conversion CTA Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
                        <button
                            onClick={handleInstallClick}
                            className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-slate-950 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
                        >
                            <DownloadIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            <span>Download App (Free)</span>
                        </button>

                        <Link
                            href="/dashboard"
                            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 font-bold text-sm shadow-sm hover:border-blue-400 dark:hover:border-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span>Open Web App Live</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <SolidCheckIcon className="w-4 h-4 text-emerald-500" />
                            No account or login required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <SolidCheckIcon className="w-4 h-4 text-emerald-500" />
                            Works 100% offline in browser
                        </span>
                        <span className="flex items-center gap-1.5">
                            <SolidCheckIcon className="w-4 h-4 text-emerald-500" />
                            Zero telemetry & zero ad trackers
                        </span>
                        <span className="flex items-center gap-1.5">
                            <SolidCheckIcon className="w-4 h-4 text-emerald-500" />
                            1-Click JSON data export
                        </span>
                    </div>

                    {/* INTERACTIVE SAMPLE SCREEN SHOWCASE */}
                    <div id="screens" className="mt-14 w-full max-w-4xl scroll-mt-20">
                        
                        {/* Section Header Hint */}
                        <div className="flex flex-col items-center mb-5">
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Interactive Sandbox Preview</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any tab below to test drive the live app screens directly inside this frame:</p>
                        </div>

                        {/* Interactive Tab Switcher */}
                        <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                            {[
                                { id: 'dashboard', label: '📊 Dashboard & Ledger', badge: 'Active' },
                                { id: 'bills', label: '⚡️ Bills & Subscriptions', badge: 'Deadlines' },
                                { id: 'currencies', label: '🌍 8 Global Currencies', badge: 'Rates' },
                                { id: 'privacy', label: '🛡️ Local Storage & Portability', badge: 'IndexedDB' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-102 ring-2 ring-blue-400/40'
                                            : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Device Shell Frame */}
                        <div className="relative mx-auto max-w-sm sm:max-w-md rounded-[2.75rem] p-3.5 sm:p-4 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 shadow-2xl border border-white/60 dark:border-slate-700/60 ring-1 ring-black/5">
                            
                            {/* Device Notch / Dynamic Island */}
                            <div className="w-24 h-4 bg-slate-900 dark:bg-slate-950 rounded-full mx-auto mb-2.5 flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-800" />
                                <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-700" />
                            </div>

                            {/* Inner Screen */}
                            <div className="rounded-[2.2rem] bg-[#f6f5f5] dark:bg-slate-950 overflow-hidden border border-slate-300/80 dark:border-slate-850 text-left p-4.5 sm:p-5 flex flex-col gap-3 min-h-[480px]">
                                
                                {/* Simulated App Header */}
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-slate-800/80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-xl bg-black dark:bg-white flex items-center justify-center p-1">
                                            <Image src={BrandLogo} alt="Logo" width={18} height={18} className="invert dark:invert-0" />
                                        </div>
                                        <span className="font-extrabold uppercase text-xs tracking-wider text-black dark:text-white">KAAYI</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                            IndexedDB Sandboxed
                                        </span>
                                    </div>
                                </div>

                                {/* TAB 1: DASHBOARD SCREEN */}
                                {activeTab === 'dashboard' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        {/* Total Balance Card */}
                                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Balance</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                                    {demoCurrency}
                                                </span>
                                            </div>
                                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 block">
                                                {formatDemoAmt(4850.00)}
                                            </span>
                                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800/80">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block">Total Income</span>
                                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{formatDemoAmt(6200.00)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block">Total Expenses</span>
                                                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">-{formatDemoAmt(1350.00)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Budget Gauge */}
                                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                                <span className="text-slate-700 dark:text-slate-300">Monthly Budget Cap</span>
                                                <span className="text-blue-600 dark:text-blue-400">42% Spent</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[42%]" />
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 block">
                                                {formatDemoAmt(1350)} spent of {formatDemoAmt(3200)} limit
                                            </span>
                                        </div>

                                        {/* Interactive Category Filter Pills */}
                                        <div className="flex items-center justify-between pt-0.5">
                                            <div className="flex items-center gap-1.5">
                                                {(['all', 'income', 'expense'] as const).map(f => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setDemoFilter(f)}
                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase transition-all cursor-pointer ${
                                                            demoFilter === f
                                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                                : 'bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setAddedDemoTx(!addedDemoTx)}
                                                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                                            >
                                                <PlusIcon className="w-3 h-3" />
                                                <span>{addedDemoTx ? "Reset" : "Add Demo Tx"}</span>
                                            </button>
                                        </div>

                                        {/* Recent Ledger Items */}
                                        <div className="flex flex-col gap-2">
                                            {demoTransactionsList.map((tx) => (
                                                <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800 text-xs">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-sm">{tx.icon}</span>
                                                        <div>
                                                            <span className="font-bold text-slate-900 dark:text-white block">{tx.title}</span>
                                                            <span className="text-[10px] text-slate-400">{tx.cat} · {tx.date}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`font-extrabold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                        {tx.type === 'income' ? '+' : '-'}{formatDemoAmt(tx.usd)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: BILLS & SUBSCRIPTIONS SCREEN */}
                                {activeTab === 'bills' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/30 dark:to-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Due Date Countdown Radar</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                                                    Interactive
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">
                                                Tap "Mark Paid" on any bill below to simulate 1-tap due settlement:
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {[
                                                { name: "Apartment Rent", due: "Due in 3 days", amt: 1200.00, badge: "Urgent", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
                                                { name: "Fiber Internet", due: "Due in 6 days", amt: 65.00, badge: "Upcoming", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
                                                { name: "Netflix Premium", due: "Every 15th", amt: 19.99, badge: "Auto-renew", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
                                            ].map((bill) => {
                                                const isPaid = paidBills[bill.name];
                                                return (
                                                    <div key={bill.name} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-xs font-bold text-slate-900 dark:text-white block">{bill.name}</span>
                                                                {isPaid && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Paid ✓</span>}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400">{isPaid ? "Settled for this cycle" : bill.due}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{formatDemoAmt(bill.amt)}</span>
                                                            <button
                                                                onClick={() => setPaidBills(prev => ({ ...prev, [bill.name]: !prev[bill.name] }))}
                                                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                                                    isPaid 
                                                                        ? 'bg-emerald-500 text-white' 
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                                                }`}
                                                            >
                                                                {isPaid ? "Paid" : "Pay"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center text-xs">
                                            <span className="text-slate-400 text-[11px] block">Annualized Subscriptions Leakage</span>
                                            <span className="font-extrabold text-slate-900 dark:text-white block text-sm mt-0.5">
                                                {formatDemoAmt(84.98)}/mo &rarr; {formatDemoAmt(1019.76)} / year
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: 8 CURRENCIES & BUDGETS SCREEN */}
                                {activeTab === 'currencies' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Select Active Currency</span>
                                            <div className="grid grid-cols-3 gap-1.5 mt-2">
                                                {(Object.keys(currencyRates) as Array<keyof typeof currencyRates>).map(cCode => (
                                                    <button
                                                        key={cCode}
                                                        onClick={() => setDemoCurrency(cCode as any)}
                                                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                                            demoCurrency === cCode
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'bg-gray-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        <span>{currencyRates[cCode].flag}</span>
                                                        <span>{cCode}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200">
                                            <p className="font-bold">Base Currency Anchor: INR (₹)</p>
                                            <p className="text-[11px] mt-0.5 leading-relaxed text-blue-800/80 dark:text-blue-300">
                                                All ledger entries remain faithfully recorded in base currency. When you travel or change currencies, Cashbook converts display values seamlessly.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Current Balance</span>
                                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">{formatDemoAmt(4850)}</span>
                                            </div>
                                            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Monthly Budget</span>
                                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">{formatDemoAmt(3200)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: PRIVACY & LOCAL STORAGE SCREEN */}
                                {activeTab === 'privacy' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200/60 dark:border-emerald-900/40">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">100% Client-Side Sandboxed</span>
                                            </div>
                                            <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">
                                                IndexedDB database <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-900 font-mono text-[10px]">kaayidb</code> runs locally on your browser.
                                            </span>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Storage Inspector</span>
                                            <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-slate-800">
                                                <span className="text-slate-500">Database Engine</span>
                                                <span className="font-bold font-mono">IndexedDB API</span>
                                            </div>
                                            <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-slate-800">
                                                <span className="text-slate-500">Remote Cloud Telemetry</span>
                                                <span className="font-bold text-emerald-600">0 KB (Disabled)</span>
                                            </div>
                                            <div className="flex justify-between text-xs py-1">
                                                <span className="text-slate-500">Sanitized JSON Export</span>
                                                <span className="font-bold text-blue-600">Ready</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-center border border-blue-200/50">
                                                Export JSON
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-center">
                                                Import JSON
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE VALUE PROOF STATS STRIP */}
            <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/70 dark:border-slate-800/70">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white block">0 Bytes</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold">Sent to Cloud Servers</span>
                    </div>
                    <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 block">100%</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold">Offline PWA Functionality</span>
                    </div>
                    <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 block">8 Currencies</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold">With Real-Time Dynamic Rates</span>
                    </div>
                    <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 block">$0 / Month</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold">Free & Open Source Forever</span>
                    </div>
                </div>
            </section>

            {/* BENTO GRID: COMPREHENSIVE FEATURE PILLARS */}
            <section id="features" className="py-24 bg-[#f8fafc] dark:bg-slate-950 scroll-mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Engineered for Complete Autonomy</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Built for People Who Value Privacy & Speed
                        </h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            No corporate tracking, no forced logins, and no cloud outages. Every single feature is designed to run locally on your device.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Bento Card 1: 100% Offline Engine */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200/60 dark:border-emerald-900/40 group-hover:scale-105 transition-transform">
                                    <WifiOffIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Offline-First Service Worker</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Pre-caches application code and static assets into your browser. Log transactions in underground transit, high-altitude flights, or off-grid remote cabins without a hiccup.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <span>Zero Network Dependency</span>
                                <span>⚡ 0ms Latency</span>
                            </div>
                        </div>

                        {/* Bento Card 2: Zero Telemetry */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 border border-purple-200/60 dark:border-purple-900/40 group-hover:scale-105 transition-transform">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Telemetry & Profiling</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We do not bundle Google Analytics, advertising SDKs, tracking pixels, or user behavior tracking. Your spending habits, balances, and savings goals remain private to your eyes only.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                                <span>No Cloud Databases</span>
                                <span>🔒 100% On-Device</span>
                            </div>
                        </div>

                        {/* Bento Card 3: 8 Currencies Engine */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-200/60 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                                    <GlobeIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">8 Global Currencies</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Instant conversion across INR, USD, EUR, GBP, AED, SAR, JPY, and AUD. All ledger entries stay anchored to base currency while display values convert dynamically on the fly.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                                <span>Anchor: INR (₹)</span>
                                <span>🌍 Live Rate Multipliers</span>
                            </div>
                        </div>

                        {/* Bento Card 4: Bills & Due Countdowns */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-200/60 dark:border-amber-900/40 group-hover:scale-105 transition-transform">
                                    <ReceiptIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bills & Due Countdowns</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Never miss rent or electricity deadlines again. Proactive due countdowns alert you before payment dates, with instant 1-tap paid toggles to keep ledger records updated.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                                <span>1-Tap Settlement</span>
                                <span>⏱️ Urgency Badges</span>
                            </div>
                        </div>

                        {/* Bento Card 5: Subscriptions Radar */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 border border-rose-200/60 dark:border-rose-900/40 group-hover:scale-105 transition-transform">
                                    <RenewIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Annualized Subscription Radar</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Stop the quiet drain of forgotten SaaS memberships and recurring streams. Automatically computes true annual commitments ($19.99/mo &rarr; $239.88/yr) to expose financial leaks.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                                <span>Silent Cost Auditing</span>
                                <span>📉 True Annual Projections</span>
                            </div>
                        </div>

                        {/* Bento Card 6: Total JSON Portability */}
                        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 border border-cyan-200/60 dark:border-cyan-900/40 group-hover:scale-105 transition-transform">
                                    <DatabaseIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1-Click JSON Portability</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    You own your data unconditionally. Export clean JSON backups anytime to migrate between phones or laptops. Zero proprietary vendor lock-in, forever.
                                </p>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
                                <span>Sanitized Schema</span>
                                <span>💾 Instant Restoration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAVINGS ROI CALCULATOR */}
            <section className="py-20 bg-white dark:bg-slate-900/80 border-y border-slate-200/70 dark:border-slate-800/70">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">Eliminate Subscription Tax</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        How Much Do Cloud Finance Apps Cost You?
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
                        Most personal finance apps (YNAB, Copilot, Monarch) charge $10 to $15 every month just to store your own numbers.
                    </p>

                    <div className="mt-10 p-7 sm:p-9 rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
                        <div className="flex items-center justify-between text-sm font-bold mb-4">
                            <span className="text-slate-600 dark:text-slate-400">Typical App Subscription:</span>
                            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">${monthlyAppCost} / month</span>
                        </div>

                        <input 
                            type="range" 
                            min="5" 
                            max="30" 
                            value={monthlyAppCost} 
                            onChange={(e) => setMonthlyAppCost(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
                            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                                <span className="text-xs text-rose-700 dark:text-rose-400 block font-semibold">Cost with Cloud Apps</span>
                                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 block mt-1">
                                    ${monthlyAppCost * 12} <span className="text-xs font-normal">/ yr</span>
                                </span>
                                <span className="text-[11px] text-rose-700/80 dark:text-rose-400/80 mt-1 block">Plus your personal data is monetized</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                                <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">Cost with CashBook</span>
                                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                                    $0 <span className="text-xs font-normal">forever</span>
                                </span>
                                <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 block">Saved: ${monthlyAppCost * 12}/yr + 100% privacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON TABLE: CLOUD APPS VS CASHBOOK */}
            <section id="comparison" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-16">
                <div className="text-center max-w-xl mx-auto mb-14">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">The Difference is Night & Day</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Cloud Banking Apps vs. CashBook
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
                        Why thousands of people are switching away from centralized fintech servers.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold">
                                <th className="p-4 sm:p-5 text-slate-500">Capability</th>
                                <th className="p-4 sm:p-5 text-rose-600 dark:text-rose-400">Typical Cloud Apps (Copilot, Mint, YNAB)</th>
                                <th className="p-4 sm:p-5 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">CashBook Offline PWA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Database Custody</td>
                                <td className="p-4 sm:p-5 text-slate-500">Stored on remote cloud servers (breach vulnerability)</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">100% on your device via IndexedDB</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Account Requirements</td>
                                <td className="p-4 sm:p-5 text-slate-500">Mandatory email, phone, passwords & KYC verification</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">Zero accounts, zero passwords needed</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Third-Party Telemetry</td>
                                <td className="p-4 sm:p-5 text-slate-500">Ad trackers, tracking pixels & analytics profiling</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">0 trackers, 0 cookies, 0 telemetry</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Offline Functionality</td>
                                <td className="p-4 sm:p-5 text-slate-500">Fails or hangs without active Wi-Fi / cellular data</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">Full 100% read & write speed offline</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Multi-Currency Anchor</td>
                                <td className="p-4 sm:p-5 text-slate-500">Locked to single base currency or paid upgrade tier</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">8 world currencies with live conversion</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Pricing Model</td>
                                <td className="p-4 sm:p-5 text-slate-500">$5.00 – $14.99/mo continuous subscription billing</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/15">100% Free & Open Source forever</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* HOW TO INSTALL GUIDE */}
            <section id="install" className="py-24 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80 scroll-mt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Universal Compatibility</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Install In 3 Seconds. Any Device.
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                        Powered by modern Progressive Web App (PWA) standards. No App Store gatekeeping, zero 200MB app bloat, and instant updates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 text-left">
                        {/* iOS */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">🍏</span>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">iPhone & iPad (Safari)</h3>
                                <ol className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                                    <li>Open Cashbook in <strong>Safari</strong></li>
                                    <li>Tap the <strong>Share</strong> button (box with arrow)</li>
                                    <li>Scroll and tap <strong>Add to Home Screen</strong></li>
                                </ol>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-5 block">Native Home Screen Icon &rarr;</span>
                        </div>

                        {/* Android */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">🤖</span>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">Android (Chrome)</h3>
                                <ol className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                                    <li>Tap <strong>Download App</strong> on this page</li>
                                    <li>Or open the 3-dots menu in Chrome</li>
                                    <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong></li>
                                </ol>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-5 block">Android Sandboxed App &rarr;</span>
                        </div>

                        {/* Mac / Windows */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">💻</span>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">Mac, Windows & Linux</h3>
                                <ol className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                                    <li>Open in Chrome, Edge, or Brave</li>
                                    <li>Click the <strong>Install</strong> icon in your URL address bar</li>
                                    <li>Launches in its own standalone desktop window</li>
                                </ol>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-5 block">Dedicated Desktop Dock &rarr;</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section id="faq" className="py-24 max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-16">
                <div className="text-center mb-14">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Clear Answers</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="flex flex-col gap-3.5">
                    {faqs.map((faq, idx) => (
                        <div 
                            key={idx}
                            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-all"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
                            </button>
                            {activeFaq === idx && (
                                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL HIGH-CONVERSION BOTTOM CALL TO ACTION */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-3">Instant Access · Zero Sign-Up Friction</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        Take Control of Your Personal Finances Today.
                    </h2>
                    <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Stop paying monthly subscriptions for corporate apps that track your spending. Experience true offline autonomy with Cashbook.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
                        <button
                            onClick={handleInstallClick}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-sm shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span>Download App (Free)</span>
                        </button>
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 text-white border border-slate-700 font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Open Web App Live</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center p-1">
                            <Image src={BrandLogo} alt="Logo" width={22} height={22} className="invert dark:invert-0" />
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block text-sm">CashBook</span>
                            <span className="text-[11px] text-slate-400">100% Offline Personal Finance & Expense Tracker</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
                        <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/support" className="hover:text-slate-900 dark:hover:text-white transition-colors">Developer Support</Link>
                        <a href="https://github.com/sadi-1010011/cashbook" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                            <span>GitHub</span>
                            <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                        <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">Launch App &rarr;</Link>
                    </div>
                </div>
            </footer>

            {/* INSTALL MODAL HELPER */}
            {showInstallModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={() => setShowInstallModal(false)}
                >
                    <div 
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-900 dark:text-white animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowInstallModal(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <DownloadIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">How to Install CashBook</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Add to your device in seconds</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">📱 iOS (Safari):</span>
                                <span>Tap the Share icon &rarr; select <strong>Add to Home Screen</strong>.</span>
                            </div>
                            <div className="h-px bg-slate-200/60 dark:border-slate-800" />
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">🤖 Android (Chrome):</span>
                                <span>Tap the 3 dots menu &rarr; select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                            </div>
                            <div className="h-px bg-slate-200/60 dark:border-slate-800" />
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">💻 Mac & PC:</span>
                                <span>Click the Install button inside your browser address bar.</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => setShowInstallModal(false)}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Got it
                            </button>
                            <Link
                                href="/dashboard"
                                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors shadow-sm"
                            >
                                Open App Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
