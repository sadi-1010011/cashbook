"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import BrandLogo from "@/assets/logo.png";
import DashboardScreenshot from "@/assets/screenshots/dashboard.png";
import AnalyticsScreenshot from "@/assets/screenshots/analytics.png";
import BillsScreenshot from "@/assets/screenshots/bills.png";
import CurrencyScreenshot from "@/assets/screenshots/currency.png";
import PrivacyScreenshot from "@/assets/screenshots/privacy.png";
import {
    DownloadIcon,
    ShieldCheckIcon,
    DatabaseIcon,
    GlobeIcon,
    RenewIcon,
    ReceiptIcon,
    ZapIcon,
    CheckIcon,
    WifiOffIcon,
    ExternalLinkIcon,
    ChevronDownIcon,
    CloseIcon,
    AppleIcon,
    AndroidIcon,
    DesktopMonitorIcon,
    SunIcon,
    MoonIcon
} from "@/components/icons";
import { landingFaqs } from "./seo";

interface InstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SCREENS = [
    {
        id: 'dashboard',
        label: '📊 Dashboard & Ledger',
        image: DashboardScreenshot,
        alt: 'CashBook personal finance dashboard showing live balance, monthly budget limit, and transaction ledger',
        caption: 'Live Cash Ledger · Instant balance tracking & insights'
    },
    {
        id: 'analytics',
        label: '📈 Analytics & Charts',
        image: AnalyticsScreenshot,
        alt: 'CashBook expense analytics charts with category spending donut breakdown and trends',
        caption: 'Visual Expense Analytics · Categorized charts & spending trends'
    },
    {
        id: 'bills',
        label: '⚡️ Bills & Subscriptions',
        image: BillsScreenshot,
        alt: 'CashBook bill tracker interface with upcoming payment reminders and due countdowns',
        caption: 'Bills & Commitments · Upcoming reminders & zero late fees'
    },
    {
        id: 'currencies',
        label: '🌍 8 Currencies',
        image: CurrencyScreenshot,
        alt: 'CashBook multi-currency exchange rates selector supporting 8 global currencies',
        caption: '8 Global Currencies · Live automatic exchange rates'
    },
    {
        id: 'privacy',
        label: '🛡️ Local Storage & Backup',
        image: PrivacyScreenshot,
        alt: 'CashBook offline storage monitor with sandboxed IndexedDB and one-click JSON backup',
        caption: '100% Local Device Storage · Sandboxed IndexedDB & JSON backup'
    },
] as const;

type ScreenId = typeof SCREENS[number]['id'];

export default function LandingClient() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [activeTab, setActiveTab] = useState<ScreenId>('dashboard');
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showStickyBar, setShowStickyBar] = useState(false);

    // Automatic screen switcher with pause on hover
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveTab((prev) => {
                const currentIndex = SCREENS.findIndex((s) => s.id === prev);
                const nextIndex = (currentIndex + 1) % SCREENS.length;
                return SCREENS[nextIndex].id;
            });
        }, 3800);

        return () => clearInterval(interval);
    }, [isAutoPlaying, activeTab]);

    const currentScreen = SCREENS.find((s) => s.id === activeTab) || SCREENS[0];

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
        const current = resolvedTheme || theme;
        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 76;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans selection:bg-blue-500 selection:text-white pb-24 sm:pb-0">

            {/* Accessibility: Skip to Content */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:font-semibold focus:outline-none"
            >
                Skip to content
            </a>

            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group" aria-label="CashBook Home">
                        <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                            <Image 
                                src={BrandLogo} 
                                alt="CashBook - 100% Offline Personal Finance & Expense Tracker Logo" 
                                width={26} 
                                height={26} 
                                className="invert dark:invert-0" 
                                priority 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white leading-none">CashBook</span>
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase mt-0.5">100% Offline PWA</span>
                        </div>
                    </Link>

                    <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Features</a>
                        <a href="#screens" onClick={(e) => handleNavClick(e, 'screens')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">App Preview</a>
                        <a href="#comparison" onClick={(e) => handleNavClick(e, 'comparison')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Why CashBook</a>
                        <a href="#install" onClick={(e) => handleNavClick(e, 'install')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">How to Install</a>
                        <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-2.5">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                aria-label="Toggle dark mode"
                            >
                                {(resolvedTheme || theme) === 'dark' ? (
                                    <SunIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                ) : (
                                    <MoonIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                )}
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
                            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-black text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all shadow-sm active:scale-95"
                        >
                            <span>Open App</span>
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Semantic Main Content Container */}
            <main id="main-content">
                {/* HERO SECTION */}
                <section aria-label="Introduction and Overview" className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-20 md:pb-28 overflow-hidden">
                    {/* Background decorative glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-emerald-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

                        {/* Eyebrow Pill */}
                        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-bold shadow-xs mb-5 sm:mb-6 animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span>Private by Design · Zero Cloud Tracking · 100% Offline</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.16] sm:leading-[1.12] text-slate-900 dark:text-white">
                            <span>Master Your Money Privately.</span>{" "}
                            <span className="block sm:inline bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                                Zero Cloud. Zero Subscriptions.
                            </span>
                        </h1>

                        {/* Subheadline with high-intent keywords */}
                        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed px-1 sm:px-0">
                            The ultimate offline-first personal finance and expense tracker Progressive Web App. Record daily transactions, automate recurring bills, monitor subscriptions, and convert 8 global currencies—completely sandboxed inside your device with zero cloud tracking and zero accounts.
                        </p>

                        {/* Dual Conversion CTA Buttons */}
                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5 w-full max-w-md">
                            <button
                                onClick={handleInstallClick}
                                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
                            >
                                <DownloadIcon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                <span>Download App</span>
                            </button>

                            <Link
                                href="/dashboard"
                                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-sm hover:border-blue-300 dark:hover:border-blue-800 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <span>Launch Web App</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        {/* Proof / Trust Points */}
                        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-2.5 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
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
                        </div>

                        {/* INTERACTIVE SAMPLE SCREEN SHOWCASE */}
                        <div
                            id="screens"
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                            className="mt-10 sm:mt-14 w-full max-w-4xl scroll-mt-20"
                        >
                            {/* Tab Switcher */}
                            <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 px-1 scrollbar-none w-full max-w-full">
                                {SCREENS.map((tab) => {
                                    const isCurrent = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                                                isCurrent
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02] ring-2 ring-blue-500/30'
                                                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Device Shell Frame Container with Surrounding Badges */}
                            <div className="relative mx-auto max-w-sm sm:max-w-md">

                                {/* Left Floating Badges */}
                                <div className="hidden lg:flex flex-col gap-6 absolute -left-52 xl:-left-60 top-16 z-20 pointer-events-none animate-fade-in">
                                    <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 w-[210px] text-left">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <ZapIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Performance</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">0ms Network Latency</span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 w-[210px] text-left">
                                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                            <ShieldCheckIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Privacy Guard</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">0 Bytes Cloud Leakage</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Floating Badges */}
                                <div className="hidden lg:flex flex-col gap-6 absolute -right-52 xl:-right-60 top-24 z-20 pointer-events-none animate-fade-in">
                                    <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 w-[210px] text-left">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <GlobeIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Currency Engine</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">8 Global Currencies</span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 w-[210px] text-left">
                                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                            <ReceiptIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Due Countdowns</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">Zero Late Fees</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Smartphone Mockup Presentation */}
                                <div className="relative mx-auto max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] md:max-w-[390px]">
                                    {/* Ambient backdrop glow */}
                                    <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-emerald-500/20 blur-3xl -z-10 rounded-full opacity-70 pointer-events-none" />

                                    {/* Screenshots Container */}
                                    <div className="relative aspect-[1620/2880] w-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_30px_45px_rgba(0,0,0,0.65)]">
                                        {/* Invisible spacer to guarantee exact container dimensions */}
                                        <div className="invisible pointer-events-none select-none" aria-hidden="true">
                                            <Image
                                                src={SCREENS[0].image}
                                                alt=""
                                                width={1620}
                                                height={2880}
                                                priority
                                                className="w-full h-auto block"
                                            />
                                        </div>

                                        {SCREENS.map((screen) => {
                                            const isCurrent = activeTab === screen.id;
                                            return (
                                                <div
                                                    key={screen.id}
                                                    aria-hidden={!isCurrent}
                                                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out will-change-[opacity,transform] ${
                                                        isCurrent
                                                            ? 'opacity-100 scale-100 translate-y-0 z-10 pointer-events-auto'
                                                            : 'opacity-0 scale-[0.985] translate-y-2 z-0 pointer-events-none'
                                                    }`}
                                                >
                                                    <Image
                                                        src={screen.image}
                                                        alt={screen.alt}
                                                        width={1620}
                                                        height={2880}
                                                        priority={screen.id === 'dashboard' || screen.id === 'analytics'}
                                                        className="w-full h-auto block select-none pointer-events-none"
                                                        sizes="(max-width: 640px) 340px, (max-width: 768px) 370px, 390px"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Carousel Progress Indicator Dots */}
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                                        {SCREENS.map((screen) => {
                                            const isCurrent = activeTab === screen.id;
                                            return (
                                                <button
                                                    key={screen.id}
                                                    onClick={() => setActiveTab(screen.id)}
                                                    aria-label={`Preview ${screen.label}`}
                                                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                                                        isCurrent
                                                            ? 'w-7 bg-blue-600 dark:bg-blue-400 shadow-sm shadow-blue-500/30'
                                                            : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Active Screen Caption Tag */}
                                    <div className="mt-3 text-center min-h-[36px] flex items-center justify-center">
                                        <div
                                            key={activeTab}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 animate-fade-in"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                            <span>{currentScreen.caption}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LIVE VALUE PROOF STATS STRIP */}
                <section aria-label="Key Performance Metrics" className="py-8 sm:py-12 bg-white dark:bg-slate-900 border-y border-slate-200/70 dark:border-slate-800/70">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 sm:gap-6 text-center">
                        <div>
                            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white block">0 Bytes</span>
                            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold leading-snug">Sent to Cloud Servers</span>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 block">100%</span>
                            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold leading-snug">Offline PWA Functionality</span>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 block">8 Currencies</span>
                            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold leading-snug">With Real-Time Dynamic Rates</span>
                        </div>
                        <div>
                            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-purple-400 block">$0 / Month</span>
                            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 block font-semibold leading-snug">Free & Open Source Forever</span>
                        </div>
                    </div>
                </section>

                {/* BENTO GRID VALUE PROPOSITIONS */}
                <section id="features" aria-labelledby="features-heading" className="py-14 sm:py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800/70 scroll-mt-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1.5 sm:mb-2">Engineered for Autonomy</span>
                            <h2 id="features-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Everything You Need. Zero Fluff.
                            </h2>
                            <p className="mt-2.5 sm:mt-3 text-slate-600 dark:text-slate-400 text-xs sm:text-base">
                                Built from scratch to deliver desktop-grade performance, absolute privacy, and total financial clarity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

                            {/* Bento Card 1: 100% Offline */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 sm:mb-5 border border-emerald-200/70 dark:border-emerald-900/40">
                                        <WifiOffIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">100% Offline by Default</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Works seamlessly in subways, remote flights, and dead zones. No loading spinners, no timeouts, and zero dependence on Wi-Fi or mobile towers.
                                    </p>
                                </div>
                                <Link href="/dashboard" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Service Worker Cached &rarr;
                                </Link>
                            </div>

                            {/* Bento Card 2: Zero Telemetry */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 sm:mb-5 border border-purple-200/70 dark:border-purple-900/40">
                                        <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Zero Cloud Telemetry</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        No marketing pixels, no tracking cookies, and no analytical profiling. We never see your income, your expenses, or your bank habits.
                                    </p>
                                </div>
                                <Link href="/privacy" className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Sandboxed IndexedDB &rarr;
                                </Link>
                            </div>

                            {/* Bento Card 3: 8 Global Currencies */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 sm:mb-5 border border-blue-200/70 dark:border-blue-900/40">
                                        <GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">8 Global Currencies</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Seamlessly switch between USD, EUR, GBP, INR, AED, SAR, JPY, and AUD. All ledger entries stay anchored to base currency while converting display values in real time.
                                    </p>
                                </div>
                                <Link href="/settings" className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Dynamic Rates Engine &rarr;
                                </Link>
                            </div>

                            {/* Bento Card 4: Bills & Countdowns */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 sm:mb-5 border border-amber-200/70 dark:border-amber-900/40">
                                        <ReceiptIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Recurring Bills & Deadlines</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Never get surprised by utility bills or rent. Interactive countdowns give you warning days in advance, with instant 1-tap paid toggles.
                                    </p>
                                </div>
                                <Link href="/bills" className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Zero Late Fees Tracker &rarr;
                                </Link>
                            </div>

                            {/* Bento Card 5: Subscriptions Radar */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 sm:mb-5 border border-rose-200/70 dark:border-rose-900/40">
                                        <RenewIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Subscription Radar</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        See the true annualized cost of Netflix, Spotify, cloud storage, and SaaS memberships. Stop silent subscription bleeding before it adds up.
                                    </p>
                                </div>
                                <Link href="/subscriptions" className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Annual Projections &rarr;
                                </Link>
                            </div>

                            {/* Bento Card 6: Total Data Portability */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 sm:mb-5 border border-cyan-200/70 dark:border-cyan-900/40">
                                        <DatabaseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1-Click JSON Portability</h3>
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        No lock-in. Export your complete data ledger in clean, unencrypted JSON at any time. Move it between phones, laptops, and backups freely.
                                    </p>
                                </div>
                                <Link href="/settings" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-3.5 sm:mt-4 block hover:underline">
                                    Full Ownership & Backup &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMPARISON TABLE: CLOUD APPS VS CASHBOOK */}
                <section id="comparison" aria-labelledby="comparison-heading" className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-20">
                    <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1.5 sm:mb-2">The Difference is Night & Day</span>
                        <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Cloud Apps vs. CashBook
                        </h2>
                    </div>

                    <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2.5">
                        <span>← Swipe horizontally to compare →</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <table className="w-full min-w-[540px] text-left text-xs sm:text-sm">
                            <caption className="sr-only">Comparison between Traditional Cloud Banking Apps and CashBook Offline PWA</caption>
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-xs font-bold">
                                    <th scope="col" className="p-3.5 sm:p-5 text-slate-500">Capability</th>
                                    <th scope="col" className="p-3.5 sm:p-5 text-rose-600 dark:text-rose-400">Traditional Banking & Cloud Apps</th>
                                    <th scope="col" className="p-3.5 sm:p-5 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">CashBook PWA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                                <tr>
                                    <th scope="row" className="p-3.5 sm:p-5 font-bold text-slate-900 dark:text-white">Data Storage</th>
                                    <td className="p-3.5 sm:p-5 text-slate-500">Remote cloud servers (vulnerable to breaches)</td>
                                    <td className="p-3.5 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% on your device (IndexedDB)</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="p-3.5 sm:p-5 font-bold text-slate-900 dark:text-white">Account Requirements</th>
                                    <td className="p-3.5 sm:p-5 text-slate-500">Mandatory email, phone & password sign-up</td>
                                    <td className="p-3.5 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">Zero accounts or logins required</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="p-3.5 sm:p-5 font-bold text-slate-900 dark:text-white">Third-Party Tracking</th>
                                    <td className="p-3.5 sm:p-5 text-slate-500">Ad trackers, tracking pixels & data monetization</td>
                                    <td className="p-3.5 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">0 tracking cookies, 0 telemetry</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="p-3.5 sm:p-5 font-bold text-slate-900 dark:text-white">Offline Functionality</th>
                                    <td className="p-3.5 sm:p-5 text-slate-500">Broken or read-only without active Wi-Fi</td>
                                    <td className="p-3.5 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% full read & write speed offline</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="p-3.5 sm:p-5 font-bold text-slate-900 dark:text-white">Pricing Model</th>
                                    <td className="p-3.5 sm:p-5 text-slate-500">$4.99 – $14.99/mo subscription fees</td>
                                    <td className="p-3.5 sm:p-5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10">100% Free & Open Source forever</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* HOW TO INSTALL GUIDE */}
                <section id="install" aria-labelledby="install-heading" className="py-14 sm:py-24 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1.5 sm:mb-2">Universal Compatibility</span>
                        <h2 id="install-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Install In 3 Seconds. Any Device.
                        </h2>
                        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Powered by modern Progressive Web App (PWA) standards. No App Store gatekeeping, zero 200MB app bloat, and instant updates.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-12 text-left">
                            {/* iOS */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mb-3.5 sm:mb-4 border border-slate-200/60 dark:border-slate-700 shadow-xs">
                                        <AppleIcon className="w-6 h-6 text-slate-900 dark:text-white" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">iPhone & iPad (Safari)</h3>
                                    <ol className="mt-2.5 sm:mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 sm:space-y-2.5 list-decimal list-inside leading-relaxed">
                                        <li>Open Cashbook in <strong>Safari</strong></li>
                                        <li>Tap the <strong>Share</strong> button (box with arrow)</li>
                                        <li>Scroll and tap <strong>Add to Home Screen</strong></li>
                                    </ol>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-4 sm:mt-5 block">Native Home Screen Icon &rarr;</span>
                            </div>

                            {/* Android */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5 sm:mb-4 border border-emerald-200/60 dark:border-emerald-900/40">
                                        <AndroidIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Android (Chrome)</h3>
                                    <ol className="mt-2.5 sm:mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                                        <li>Tap <strong>Download App</strong> on this page</li>
                                        <li>Or open the 3-dots menu in Chrome</li>
                                        <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong></li>
                                    </ol>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-4 sm:mt-5 block">Android Sandboxed App &rarr;</span>
                            </div>

                            {/* Mac / Windows */}
                            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5 sm:mb-4 border border-blue-200/60 dark:border-blue-900/40">
                                        <DesktopMonitorIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Mac, Windows & Linux</h3>
                                    <ol className="mt-2.5 sm:mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-decimal list-inside leading-relaxed">
                                        <li>Open in Chrome, Edge, or Brave</li>
                                        <li>Click the <strong>Install</strong> icon in your URL address bar</li>
                                        <li>Launches in its own standalone desktop window</li>
                                    </ol>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-4 sm:mt-5 block">Dedicated Desktop Dock &rarr;</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FREQUENTLY ASKED QUESTIONS */}
                <section id="faq" aria-labelledby="faq-heading" className="py-14 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
                    <div className="text-center mb-8 sm:mb-14">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1.5 sm:mb-2">Clear Answers</span>
                        <h2 id="faq-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {landingFaqs.map((faq, idx) => {
                            const isOpen = activeFaq === idx;
                            return (
                                <div 
                                    key={idx}
                                    className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 ${
                                        isOpen
                                            ? 'border-blue-500/40 dark:border-blue-500/30 shadow-md ring-2 ring-blue-500/10 dark:ring-blue-500/10 bg-white dark:bg-slate-900'
                                            : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                                    }`}
                                >
                                    <button
                                        id={`faq-btn-${idx}`}
                                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-base font-bold cursor-pointer group transition-colors duration-200"
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${idx}`}
                                    >
                                        <span className={`transition-colors duration-200 ${isOpen ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ml-3 sm:ml-4 transition-all duration-300 ${
                                            isOpen
                                                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rotate-180 scale-105'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-700'
                                        }`}>
                                            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300" />
                                        </div>
                                    </button>
                                    <div
                                        id={`faq-answer-${idx}`}
                                        role="region"
                                        aria-labelledby={`faq-btn-${idx}`}
                                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className={`px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-3.5 transition-all duration-300 ${
                                                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                                            }`}>
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* FINAL HIGH-CONVERSION BOTTOM CALL TO ACTION */}
                <section aria-labelledby="cta-heading" className="py-14 sm:py-20 md:py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2 sm:mb-3">Instant Access · No Sign Up Required</span>
                        <h2 id="cta-heading" className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Start Tracking Your Finances Privately Today.
                        </h2>
                        <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
                            Join users taking full custody of their financial records. Zero account setup, zero cloud leakage, and instant offline performance.
                        </p>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 max-w-md mx-auto">
                            <button
                                onClick={handleInstallClick}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                <span>Download App (Free)</span>
                            </button>
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-800/90 text-white border border-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Open Web App</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-medium">
                            <span>✓ MIT Open Source</span>
                            <span>✓ Zero Cloud Telemetry</span>
                            <span>✓ Works 100% Offline</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER WITH EXTENDED INTERNAL SITEMAP LINKS */}
            <footer className="py-10 sm:py-14 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-900 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center p-1.5">
                                <Image src={BrandLogo} alt="CashBook Logo" width={24} height={24} className="invert dark:invert-0" />
                            </div>
                            <div>
                                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">CashBook</span>
                                <span className="text-[11px] text-slate-400">100% Offline Personal Finance & Expense Tracker PWA</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-semibold">
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

                    {/* SEO Quick Links Matrix to Core App Modules */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2">
                            <span className="font-bold text-slate-600 dark:text-slate-300">App Modules:</span>
                            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cash Ledger</Link>
                            <Link href="/stats" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Expense Analytics</Link>
                            <Link href="/bills" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bill Tracker</Link>
                            <Link href="/subscriptions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Subscriptions Radar</Link>
                            <Link href="/history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Transaction Feed</Link>
                            <Link href="/settings" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Budget & Currencies</Link>
                        </div>
                        <p>© {new Date().getFullYear()} CashBook. Free, open source & client-side offline software.</p>
                    </div>
                </div>
            </footer>

            {/* MOBILE FLOATING STICKY CONVERSION BAR */}
            {showStickyBar && (
                <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2 animate-fade-in-up">
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
                            aria-label="Close install helper"
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

                        <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                                    <AppleIcon className="w-3.5 h-3.5" />
                                    <span>iOS (Safari):</span>
                                </div>
                                <span>Tap the Share icon &rarr; select <strong>Add to Home Screen</strong>.</span>
                            </div>
                            <div className="h-px bg-slate-200/60 dark:border-slate-800" />
                            <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                                    <AndroidIcon className="w-3.5 h-3.5" />
                                    <span>Android (Chrome):</span>
                                </div>
                                <span>Tap the 3 dots menu &rarr; select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                            </div>
                            <div className="h-px bg-slate-200/60 dark:border-slate-800" />
                            <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                                    <DesktopMonitorIcon className="w-3.5 h-3.5" />
                                    <span>Mac & PC:</span>
                                </div>
                                <span>Click the Install button inside your browser address bar.</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => setShowInstallModal(false)}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
