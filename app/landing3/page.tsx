"use client";

import { useState, useEffect } from "react";
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
    ChevronDownIcon,
    CloseIcon,
    WarningIcon,
    UploadIcon,
    PlusIcon,
    UndoIcon
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
    const [activeTab, setActiveTab] = useState<'dashboard' | 'bills' | 'currencies' | 'privacy'>('dashboard');
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [installPlatform, setInstallPlatform] = useState<'ios' | 'android' | 'desktop'>('ios');
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Interactive Playground States inside the Mockup
    const [demoCurrency, setDemoCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
    const [paidBills, setPaidBills] = useState<Record<string, boolean>>({ "Apartment Rent": false, "Fiber Internet": false });
    const [offlineSimulated, setOfflineSimulated] = useState(false);

    // Interactive Savings Calculator State
    const [monthlyAppCost, setMonthlyAppCost] = useState(12);

    useEffect(() => {
        setMounted(true);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as InstallPromptEvent);
        };

        const handleScroll = () => {
            if (window.scrollY > 450) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('scroll', handleScroll);
        };
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

    // Currency Conversion rates relative to USD for interactive mock demo
    const rates: Record<'USD' | 'EUR' | 'GBP' | 'INR', { symbol: string; rate: number; name: string }> = {
        USD: { symbol: '$', rate: 1.0, name: 'US Dollar' },
        EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
        GBP: { symbol: '£', rate: 0.78, name: 'British Pound' },
        INR: { symbol: '₹', rate: 86.2, name: 'Indian Rupee' },
    };

    const formatDemoAmt = (usdValue: number) => {
        const target = rates[demoCurrency];
        const val = usdValue * target.rate;
        if (demoCurrency === 'INR') {
            return `${target.symbol}${Math.round(val).toLocaleString()}`;
        }
        return `${target.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const toggleBillPaid = (name: string) => {
        setPaidBills(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const faqs = [
        {
            q: "Where is my financial data stored?",
            a: "100% on your device inside your browser's sandboxed IndexedDB database. Cashbook operates without remote servers, user databases, or cloud accounts. Your money records never leave your physical device."
        },
        {
            q: "How do I download and install Cashbook without an App Store?",
            a: "Cashbook is a Progressive Web App (PWA). On mobile, tap the 'Install App' button or tap 'Share > Add to Home Screen' in Safari/Chrome. On desktop, click the Install icon in your browser URL bar. It installs instantly with zero storage bloat."
        },
        {
            q: "Does Cashbook connect to my bank account or credit cards?",
            a: "No, by design. Cashbook is strictly zero-telemetry and decentralized. By avoiding third-party banking aggregators (like Plaid or Yodlee), your bank credentials and transaction logs remain completely immune to cloud leaks, scraping, and cyberattacks."
        },
        {
            q: "What happens if I clear my browser cookies or history?",
            a: "IndexedDB data is persistent across regular cookie clearings in modern browsers. Furthermore, Cashbook includes an instant 1-click 'Export JSON' feature in Settings. You can download an encrypted backup file to your device or cloud folder in under 2 seconds."
        },
        {
            q: "How do I transfer or back up my data to a new phone?",
            a: "In Settings, tap 'Export Data' to generate a clean, portable JSON backup file. When you switch devices, open Cashbook on your new phone and tap 'Import Data' to restore your complete transaction and budget ledger in seconds."
        },
        {
            q: "Is Cashbook really free forever? Where is the catch?",
            a: "Yes, 100% free and open-source under the MIT license. There are zero monthly subscriptions, no premium feature gates, no ads, and no data sales. Because Cashbook operates serverless on your own hardware, we have no hosting costs to pass on to you."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white pb-16 sm:pb-0">

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/70 dark:border-slate-800/70 transition-colors">
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

                    <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                        <a href="#screens" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Live Preview</a>
                        <a href="#savings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ROI Calculator</a>
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
                            <span>Install PWA</span>
                        </button>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 active:scale-95"
                        >
                            <span>Open App</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28 overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-emerald-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/5 blur-3xl -z-10 rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

                    {/* Social Proof / Security Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>Private by Design · Zero Cloud Tracking · 100% Offline</span>
                    </div>

                    {/* High-Impact Value Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-slate-900 dark:text-white">
                        Master Your Money Privately. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                            Zero Cloud. Zero Subscriptions.
                        </span>
                    </h1>

                    {/* Concise Pain-Point Subtitle */}
                    <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        The ultimate offline-first finance tracker. Record daily expenses, automate recurring bills, monitor subscriptions, and convert 8 global currencies—completely sandboxed inside your device.
                    </p>

                    {/* Dual Conversion CTA Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
                        <button
                            onClick={handleInstallClick}
                            className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-slate-950 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
                        >
                            <DownloadIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            <span>Download App (Free)</span>
                        </button>

                        <Link
                            href="/dashboard"
                            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-sm hover:border-blue-400 dark:hover:border-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span>Launch Web App</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {/* Risk-Reversal Badges */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4 text-emerald-500" />
                            No account or login required
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4 text-emerald-500" />
                            Runs 100% offline in browser
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4 text-emerald-500" />
                            Zero telemetry & ads
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckIcon className="w-4 h-4 text-emerald-500" />
                            Free & Open Source
                        </span>
                    </div>

                    {/* INTERACTIVE SAMPLE SCREEN SHOWCASE */}
                    <div id="screens" className="mt-14 w-full max-w-4xl relative">

                        {/* Interactive Floating Micro-Badges (Desktop / Tablet) */}
                        <div className="hidden lg:flex flex-col gap-3 absolute -left-20 top-24 z-20 pointer-events-none animate-fade-in">
                            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 max-w-[210px] text-left">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <ZapIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Performance</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">0ms Network Latency</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 max-w-[210px] text-left">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Privacy Guard</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">0 Bytes Cloud Leakage</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col gap-3 absolute -right-20 top-24 z-20 pointer-events-none animate-fade-in">
                            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 max-w-[210px] text-left">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <GlobeIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Currency Engine</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">8 Global Currencies</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 max-w-[210px] text-left">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <ReceiptIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium">Due Countdowns</span>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">Zero Late Fees</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Feature Tab Switcher */}
                        <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                            {[
                                { id: 'dashboard', label: '📊 Dashboard & Ledger', icon: BarChartIcon },
                                { id: 'bills', label: '⚡️ Bills & Subscriptions', icon: ReceiptIcon },
                                { id: 'currencies', label: '🌍 8 Currencies & Budgets', icon: GlobeIcon },
                                { id: 'privacy', label: '🛡️ Local Storage & Backup', icon: DatabaseIcon },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                                        : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Offline Simulator Bar */}
                        <div className="mb-4 flex items-center justify-center gap-2.5 text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Test Offline Resilience:</span>
                            <button
                                onClick={() => setOfflineSimulated(!offlineSimulated)}
                                className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer ${offlineSimulated
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                <WifiOffIcon className="w-3.5 h-3.5" />
                                <span>{offlineSimulated ? 'Airplane Mode: ON (Simulated)' : 'Simulate Airplane Mode'}</span>
                            </button>
                        </div>

                        {/* Realistic Device Shell Frame */}
                        <div className="relative mx-auto max-w-sm sm:max-w-md rounded-[2.8rem] p-3 sm:p-4 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 shadow-2xl border border-white/50 dark:border-slate-700/50">
                            {/* Inner Screen */}
                            <div className="rounded-[2.2rem] bg-[#f6f5f5] dark:bg-slate-950 overflow-hidden border border-slate-300/80 dark:border-slate-800 text-left p-4.5 sm:p-5 flex flex-col gap-3 min-h-[490px]">

                                {/* App Header Simulation */}
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200/70 dark:border-slate-800/80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-xl bg-black dark:bg-white flex items-center justify-center p-1">
                                            <Image src={BrandLogo} alt="Logo" width={18} height={18} className="invert dark:invert-0" />
                                        </div>
                                        <span className="font-extrabold uppercase text-xs tracking-wider text-black dark:text-white">CASHBOOK</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {offlineSimulated ? (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse">
                                                ✈️ 100% Offline Mode
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                                ● Local Sandbox
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* TAB 1: DASHBOARD SCREEN */}
                                {activeTab === 'dashboard' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        {/* Total Balance Card */}
                                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Balance</span>
                                                <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                                                    <span>Currency:</span>
                                                    <span className="text-blue-600 dark:text-blue-400">{demoCurrency}</span>
                                                </div>
                                            </div>
                                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 block">
                                                {formatDemoAmt(4850)}
                                            </span>
                                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800/80">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block">Income</span>
                                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{formatDemoAmt(6200)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 block">Expenses</span>
                                                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">-{formatDemoAmt(1350)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Budget Gauge */}
                                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                                <span className="text-slate-700 dark:text-slate-300">Monthly Budget</span>
                                                <span className="text-blue-600 dark:text-blue-400">42% Used</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[42%]" />
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 block">
                                                {formatDemoAmt(1350)} of {formatDemoAmt(3200)} limit spent
                                            </span>
                                        </div>

                                        {/* Recent Ledger Activity */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity</span>
                                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">View All</span>
                                            </div>
                                            {[
                                                { title: "Monthly Salary", cat: "Income", amt: `+${formatDemoAmt(5200)}`, color: "text-emerald-600" },
                                                { title: "Grocery Supermarket", cat: "Food", amt: `-${formatDemoAmt(85.5)}`, color: "text-slate-900 dark:text-white" },
                                                { title: "Coworking Space", cat: "Work", amt: `-${formatDemoAmt(120)}`, color: "text-slate-900 dark:text-white" },
                                            ].map((tx, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-gray-100 dark:border-slate-800 text-xs">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white block">{tx.title}</span>
                                                        <span className="text-[10px] text-slate-400">{tx.cat} · Today</span>
                                                    </div>
                                                    <span className={`font-extrabold ${tx.color}`}>{tx.amt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: BILLS & SUBSCRIPTIONS SCREEN (Interactive 1-Tap Paid) */}
                                {activeTab === 'bills' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/30 dark:to-slate-900 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Upcoming Commitments</span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tap below to test 1-click payment toggle</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                                Interactive
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {[
                                                { name: "Apartment Rent", due: "Due in 3 days", amt: "$1,200.00", badge: "Urgent", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
                                                { name: "Fiber Internet", due: "Due in 6 days", amt: "$65.00", badge: "Upcoming", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
                                                { name: "Netflix Premium", due: "Every 15th", amt: "$19.99/mo", badge: "Auto-renew", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
                                            ].map((bill, idx) => {
                                                const isPaid = paidBills[bill.name];
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => toggleBillPaid(bill.name)}
                                                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${isPaid
                                                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                                                            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-blue-200'
                                                            }`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`text-xs font-bold ${isPaid ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                                    {bill.name}
                                                                </span>
                                                                {isPaid && <SolidCheckIcon className="w-3.5 h-3.5 text-emerald-600" />}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400">{isPaid ? 'Paid for this cycle ✓' : bill.due}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className={`text-xs font-extrabold ${isPaid ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                                {bill.amt}
                                                            </span>
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : bill.badgeColor}`}>
                                                                {isPaid ? 'Paid' : bill.badge}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center text-xs">
                                            <span className="text-slate-400 text-[11px]">Total Monthly Subscriptions</span>
                                            <span className="font-extrabold text-slate-900 dark:text-white block text-sm mt-0.5">
                                                $84.98 / month (<span className="text-emerald-600 dark:text-emerald-400">$1,019.76 / yr</span>)
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: 8 CURRENCIES & BUDGETS SCREEN (Interactive Currency Switch) */}
                                {activeTab === 'currencies' && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Tap to Switch Active Currency</span>
                                            <div className="grid grid-cols-4 gap-1.5 mt-2">
                                                {(['USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
                                                    <button
                                                        key={curr}
                                                        onClick={() => setDemoCurrency(curr)}
                                                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${demoCurrency === curr
                                                            ? 'bg-blue-600 text-white shadow-xs'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                            }`}
                                                    >
                                                        {curr}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-xs">
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider">Active Anchor: INR (₹)</span>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px] mt-0.5 block">
                                                Display converted to {rates[demoCurrency].name} ({rates[demoCurrency].symbol}) seamlessly across ledger.
                                            </span>
                                        </div>

                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Global Rate Equivalents</span>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {[
                                                { flag: "🇺🇸", code: "USD", eq: "$1.00" },
                                                { flag: "🇮🇳", code: "INR", eq: "₹86.20" },
                                                { flag: "🇪🇺", code: "EUR", eq: "€0.92" },
                                                { flag: "🇬🇧", code: "GBP", eq: "£0.78" },
                                                { flag: "🇦🇪", code: "AED", eq: "3.67 AED" },
                                                { flag: "🇸🇦", code: "SAR", eq: "3.75 SAR" },
                                            ].map((curr, idx) => (
                                                <div key={idx} className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{curr.flag} {curr.code}</span>
                                                    <span className="font-mono text-slate-400 text-[11px]">{curr.eq}</span>
                                                </div>
                                            ))}
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
                                                No remote server has write or read permission to your database.
                                            </span>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Device Storage Monitor</span>
                                            <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-slate-800">
                                                <span className="text-slate-500">Database Engine</span>
                                                <span className="font-bold font-mono">IndexedDB (kaayidb)</span>
                                            </div>
                                            <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-slate-800">
                                                <span className="text-slate-500">Cloud Telemetry</span>
                                                <span className="font-bold text-emerald-600">0 KB (Disabled)</span>
                                            </div>
                                            <div className="flex justify-between text-xs py-1">
                                                <span className="text-slate-500">Data Backup</span>
                                                <span className="font-bold text-blue-600">JSON Portability</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-center border border-blue-200/50 flex items-center justify-center gap-1.5">
                                                <DownloadIcon className="w-3.5 h-3.5" />
                                                <span>Export JSON</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-center flex items-center justify-center gap-1.5">
                                                <UploadIcon className="w-3.5 h-3.5" />
                                                <span>Import JSON</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE ROI / SUBSCRIPTION SAVINGS CALCULATOR */}
            <section id="savings" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/70 dark:border-slate-800/70">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">
                            Stop Paying Monthly App Rent
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Calculate Your Savings vs. Cloud Budget Apps
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Most budgeting apps charge $8–$15/month and harvest your financial data. Cashbook is 100% free forever.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-lg">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Slider Controls */}
                            <div className="w-full md:w-1/2 flex flex-col gap-4">
                                <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Current Budget App Subscription:</span>
                                    <span className="text-blue-600 dark:text-blue-400 text-base font-extrabold">${monthlyAppCost}/month</span>
                                </label>
                                <input
                                    type="range"
                                    min="4"
                                    max="25"
                                    step="1"
                                    value={monthlyAppCost}
                                    onChange={(e) => setMonthlyAppCost(Number(e.target.value))}
                                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                                    <span>$4/mo (Basic)</span>
                                    <span>$12/mo (YNAB / Copilot)</span>
                                    <span>$25/mo (Multi-tool)</span>
                                </div>

                                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
                                    💡 <strong>Fun Fact:</strong> Over 5 years, paying for a traditional budgeting app costs more than a brand-new smartphone!
                                </div>
                            </div>

                            {/* Savings Results Display */}
                            <div className="w-full md:w-1/2 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 text-center">
                                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">1-Year Savings</span>
                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                                        ${(monthlyAppCost * 12).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">Kept in your wallet</span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 text-center">
                                    <span className="text-[11px] font-semibold text-slate-400 block uppercase">5-Year Savings</span>
                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                                        ${(monthlyAppCost * 60).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">Compound savings</span>
                                </div>

                                <div className="col-span-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                                        <span className="font-bold text-emerald-800 dark:text-emerald-300">Data Exposure Risk</span>
                                    </div>
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">0% (Pure Local Sandbox)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID VALUE PROPOSITIONS */}
            <section id="features" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-800/70">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Engineered for Autonomy</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Everything You Need. Zero Fluff.
                        </h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                            Built from scratch to deliver desktop-grade performance, absolute privacy, and total financial clarity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Bento Card 1: 100% Offline */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200/70 dark:border-emerald-900/40 group-hover:scale-105 transition-transform">
                                    <WifiOffIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Offline by Default</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Works seamlessly in subways, remote flights, and dead zones. No loading spinners, no timeouts, and zero dependence on Wi-Fi or mobile towers.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 block">Service Worker Cached &rarr;</span>
                        </div>

                        {/* Bento Card 2: Zero Telemetry */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 border border-purple-200/70 dark:border-purple-900/40 group-hover:scale-105 transition-transform">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Cloud Telemetry</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    No marketing pixels, no tracking cookies, and no analytical profiling. We never see your income, your expenses, or your bank habits.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-4 block">Sandboxed IndexedDB &rarr;</span>
                        </div>

                        {/* Bento Card 3: 8 Global Currencies */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-200/70 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                                    <GlobeIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">8 Global Currencies</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Seamlessly switch between USD, EUR, GBP, INR, AED, SAR, JPY, and AUD. All ledger entries stay anchored to base currency while converting display values in real time.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-4 block">Dynamic Rates Engine &rarr;</span>
                        </div>

                        {/* Bento Card 4: Bills & Countdowns */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-200/70 dark:border-amber-900/40 group-hover:scale-105 transition-transform">
                                    <ReceiptIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recurring Bills & Deadlines</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Never get surprised by utility bills or rent. Interactive countdowns give you warning days in advance, with instant 1-tap paid toggles.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-4 block">Zero Late Fees &rarr;</span>
                        </div>

                        {/* Bento Card 5: Subscriptions Radar */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 border border-rose-200/70 dark:border-rose-900/40 group-hover:scale-105 transition-transform">
                                    <RenewIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Radar</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    See the true annualized cost of Netflix, Spotify, cloud storage, and SaaS memberships. Stop silent subscription bleeding before it adds up.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-4 block">Annual Projections &rarr;</span>
                        </div>

                        {/* Bento Card 6: Total Data Portability */}
                        <div className="p-6 rounded-3xl bg-[#f8fafc] dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 border border-cyan-200/70 dark:border-cyan-900/40 group-hover:scale-105 transition-transform">
                                    <DatabaseIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1-Click JSON Portability</h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    No lock-in. Export your complete data ledger in clean, portable JSON at any time. Move it between phones, laptops, and backups freely.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-4 block">Full Ownership &rarr;</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON TABLE: CLOUD APPS VS CASHBOOK */}
            <section id="comparison" className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">The Difference is Night & Day</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Cloud Apps vs. CashBook vs. Spreadsheets
                    </h2>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 text-xs font-bold">
                                <th className="p-4 sm:p-5 text-slate-500">Capability</th>
                                <th className="p-4 sm:p-5 text-rose-600 dark:text-rose-400">Cloud Budget Apps (YNAB / Copilot)</th>
                                <th className="p-4 sm:p-5 text-slate-500">Manual Spreadsheets</th>
                                <th className="p-4 sm:p-5 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">CashBook PWA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Data Storage</td>
                                <td className="p-4 sm:p-5 text-slate-500">Remote cloud servers (data breach risk)</td>
                                <td className="p-4 sm:p-5 text-slate-500">Google Drive / OneDrive</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% on your device (IndexedDB)</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Account Requirements</td>
                                <td className="p-4 sm:p-5 text-slate-500">Mandatory email, phone & password</td>
                                <td className="p-4 sm:p-5 text-slate-500">Google / Microsoft login</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">Zero accounts or logins required</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Third-Party Tracking</td>
                                <td className="p-4 sm:p-5 text-slate-500">Ad pixels & data monetization</td>
                                <td className="p-4 sm:p-5 text-slate-500">Cloud telemetry</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">0 tracking cookies, 0 telemetry</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Offline Functionality</td>
                                <td className="p-4 sm:p-5 text-slate-500">Broken or read-only without Wi-Fi</td>
                                <td className="p-4 sm:p-5 text-slate-500">Clunky on mobile offline</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% full speed offline</td>
                            </tr>
                            <tr>
                                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Pricing Model</td>
                                <td className="p-4 sm:p-5 text-slate-500">$8.00 – $15.00/mo ($96–$180/yr)</td>
                                <td className="p-4 sm:p-5 text-slate-500">Free, but steep learning curve</td>
                                <td className="p-4 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% Free & Open Source forever</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* HOW TO INSTALL GUIDE WITH INTERACTIVE DEVICE TABS */}
            <section id="install" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Zero App Store Hassle</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Install in 5 Seconds On Any Device
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                        Cashbook installs directly to your home screen or desktop dock via modern Progressive Web App (PWA) standards.
                    </p>

                    {/* Platform Selector Tabs */}
                    <div className="flex items-center justify-center gap-2 mt-8 mb-8">
                        <button
                            onClick={() => setInstallPlatform('ios')}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${installPlatform === 'ios'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <span>🍏 iPhone & iPad</span>
                        </button>
                        <button
                            onClick={() => setInstallPlatform('android')}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${installPlatform === 'android'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <span>🤖 Android</span>
                        </button>
                        <button
                            onClick={() => setInstallPlatform('desktop')}
                            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${installPlatform === 'desktop'
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <span>💻 Mac & Windows</span>
                        </button>
                    </div>

                    <div className="max-w-md mx-auto text-left">
                        {/* iOS */}
                        {installPlatform === 'ios' && (
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-fade-in">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xl">
                                        🍏
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">iPhone & iPad Safari Setup</h3>
                                        <span className="text-[11px] text-slate-400">Zero App Store download needed</span>
                                    </div>
                                </div>
                                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-3 list-decimal list-inside leading-relaxed">
                                    <li>Open this page in <strong>Safari</strong> on your iPhone or iPad.</li>
                                    <li>Tap the <strong>Share</strong> button at the bottom of the screen (box with upward arrow).</li>
                                    <li>Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.</li>
                                    <li>Tap <strong>Add</strong> in the top-right corner. Done!</li>
                                </ol>
                                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <span>✓ Standalone Home Screen Icon</span>
                                    <span>Zero storage bloat</span>
                                </div>
                            </div>
                        )}

                        {/* Android */}
                        {installPlatform === 'android' && (
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-fade-in">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xl">
                                        🤖
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Android Chrome Setup</h3>
                                        <span className="text-[11px] text-slate-400">Direct 1-tap installation</span>
                                    </div>
                                </div>
                                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-3 list-decimal list-inside leading-relaxed">
                                    <li>Tap the <strong>Download App</strong> button above or in the navigation bar.</li>
                                    <li>Or tap the <strong>three vertical dots (⋮)</strong> in Chrome’s top bar.</li>
                                    <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                                    <li>Tap <strong>Install</strong> to confirm.</li>
                                </ol>
                                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <span>✓ Native Android Sandbox</span>
                                    <span>Full offline cache</span>
                                </div>
                            </div>
                        )}

                        {/* Desktop */}
                        {installPlatform === 'desktop' && (
                            <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm animate-fade-in">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xl">
                                        💻
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Mac, Windows & Linux Setup</h3>
                                        <span className="text-[11px] text-slate-400">Runs as a dedicated native desktop window</span>
                                    </div>
                                </div>
                                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-3 list-decimal list-inside leading-relaxed">
                                    <li>Open this site in Chrome, Edge, or Brave on your computer.</li>
                                    <li>Click the <strong>Install icon</strong> in the right side of the URL address bar.</li>
                                    <li>Click <strong>Install</strong> to add Cashbook to your Applications or Dock.</li>
                                    <li>Launches instantly in its own clean window without browser tabs.</li>
                                </ol>
                                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <span>✓ Independent Desktop App</span>
                                    <span>Keyboard shortcut ready</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Got Questions?</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4.5 text-left text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {activeFaq === idx && (
                                <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL HIGH-CONVERSION BOTTOM CALL TO ACTION */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-3">Instant Access · No Sign Up Required</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        Start Tracking Your Finances Privately Today.
                    </h2>
                    <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Join users taking full custody of their financial records. Zero account setup, zero cloud leakage, and instant offline performance.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
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
                            <span>Open Web App</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
                        <span>✓ MIT Open Source</span>
                        <span>✓ Zero Cloud Telemetry</span>
                        <span>✓ Works 100% Offline</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
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

            {/* MOBILE FLOATING STICKY CONVERSION BAR */}
            {showStickyBar && (
                <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2 animate-fade-in-up">
                    <div className="flex items-center gap-2 pl-1">
                        <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center p-1 shrink-0">
                            <Image src={BrandLogo} alt="Logo" width={16} height={16} className="invert dark:invert-0" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs leading-none text-slate-900 dark:text-white">CashBook</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-none mt-0.5">Free PWA</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleInstallClick}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
                        >
                            <DownloadIcon className="w-3 h-3" />
                            <span>Install</span>
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                        >
                            <span>Open App →</span>
                        </Link>
                    </div>
                </div>
            )}

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
                            <div className="h-px bg-slate-200/60 dark:bg-slate-800" />
                            <div>
                                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">🤖 Android (Chrome):</span>
                                <span>Tap the 3 dots menu &rarr; select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                            </div>
                            <div className="h-px bg-slate-200/60 dark:bg-slate-800" />
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
