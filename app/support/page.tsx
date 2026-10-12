"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { 
    CodeBracketIcon, 
    ExternalLinkIcon, 
    LifebuoyIcon, 
    DatabaseIcon, 
    RefreshCwIcon, 
    DownloadIcon, 
    ShieldCheckIcon,
    DocumentTextIcon,
    ChevronRightIcon
} from "@/components/icons";
import Link from "next/link";

export default function DeveloperSupportPage() {
    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Developer Support" 
                    backHref="/settings"
                    badge="Open Source"
                />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                    {/* Hero Support Card */}
                    <div className="flex flex-col gap-3 w-full bg-gradient-to-br from-indigo-500/10 via-white to-blue-500/5 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/70 dark:border-indigo-900/50 p-5 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-900/40">
                                <CodeBracketIcon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="font-bold text-[16px] text-gray-900 dark:text-white">Developer & Community Hub</h2>
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold mt-0.5">Transparent · Community-Driven</p>
                            </div>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                            Cashbook is an offline-first personal finance application built with modern web technologies. Whether you discovered a bug, want to contribute, or need architecture details, this page has you covered.
                        </p>
                    </div>

                    {/* Section 1: GitHub Repository & Feedback */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                <LifebuoyIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">1. GitHub & Issue Tracking</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Have an issue, feature request, or suggestion? Our open repository tracks bugs and discussions directly on GitHub.
                        </p>

                        <div className="flex flex-col gap-2 mt-1">
                            <a 
                                href="https://github.com/sadi-1010011/cashbook" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all duration-150 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                                        <CodeBracketIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Source Code Repository</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">github.com/sadi-1010011/cashbook</span>
                                    </div>
                                </div>
                                <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                            </a>

                            <a 
                                href="https://github.com/sadi-1010011/cashbook/issues" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all duration-150 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                                        <LifebuoyIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Report a Bug / Request Feature</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Open a ticket with repro steps</span>
                                    </div>
                                </div>
                                <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Section 2: Technical Architecture */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <DatabaseIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">2. Architecture & Tech Stack</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Cashbook runs as an entirely client-executed PWA with no backend microservices or server-side databases:
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Framework</p>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Next.js 16 (App Router)</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Storage Engine</p>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">IndexedDB API</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Styling & Theme</p>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Tailwind CSS + Dark Mode</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Offline / PWA</p>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Service Worker Cache</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 mt-1">
                            <p className="font-semibold mb-0.5">Local Inspection</p>
                            <p className="text-[11px] leading-relaxed">
                                You can inspect your records directly in browser DevTools under <code className="px-1 py-0.5 bg-white/70 dark:bg-slate-900/80 rounded font-mono text-[10px]">Application &gt; Storage &gt; IndexedDB &gt; kaayidb</code>.
                            </p>
                        </div>
                    </div>

                    {/* Section 3: Troubleshooting & FAQs */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <RefreshCwIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">3. Troubleshooting & Offline PWA</h3>
                        </div>

                        <div className="flex flex-col gap-2.5 text-[13px] text-slate-600 dark:text-slate-300">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Changes or new version not reflecting?</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Service Workers aggressively cache assets for instant offline starts. Use the <em>Hard Reload & Clear Cache</em> button in Settings, or close all active tabs and reopen.
                                </p>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-slate-800 w-full" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Migrating to a new phone or computer?</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Go to Settings &rarr; tap <strong>Export Backup (JSON)</strong> on your old device, transfer the file, and tap <strong>Import Backup</strong> on your new device.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation Cards */}
                    <div className="flex flex-col gap-2 w-full">
                        <Link 
                            href="/privacy"
                            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 shadow-sm transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Privacy Policy</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Zero tracking & local database commitment</span>
                                </div>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <Link 
                            href="/terms"
                            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 shadow-sm transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <DocumentTextIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Terms of Service</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Software utility license & disclaimers</span>
                                </div>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Footer note */}
                    <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                        Cashbook · Offline Personal Finance & Expense Tracker
                    </p>
                </div>
            </main>
        </div>
    );
}
