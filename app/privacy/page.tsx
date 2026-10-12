"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { ShieldCheckIcon, DatabaseIcon, DownloadIcon, TrashIcon, CheckIcon } from "@/components/icons";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Privacy Policy" 
                    backHref="/settings"
                    badge="100% Offline"
                />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                    {/* Hero Highlight Card */}
                    <div className="flex flex-col gap-3 w-full bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-900/50 p-5 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-900/40">
                                <ShieldCheckIcon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="font-bold text-[16px] text-gray-900 dark:text-white">Your Data Never Leaves Your Device</h2>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5">Privacy by Design · Zero Tracking</p>
                            </div>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                            Cashbook is built on a strict local-first philosophy. We do not collect, transmit, monetize, or store your financial activity on any cloud server.
                        </p>
                    </div>

                    {/* Section 1: Where Data Lives */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <DatabaseIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">1. Local Device Storage</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Every transaction, bill, subscription, and budget you add is stored solely in your device’s browser sandbox via <strong>IndexedDB</strong>. Neither Cashbook nor any third party has remote access to your database.
                        </p>
                        <div className="p-3 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>No user accounts, no passwords, and no cloud logins required.</span>
                        </div>
                    </div>

                    {/* Section 2: Zero Telemetry */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                <ShieldCheckIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">2. Zero Telemetry & Tracking</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            We do not run Google Analytics, advertising SDKs, tracking pixels, or user behavior profiling. Your spending habits and balances remain strictly private to you.
                        </p>
                    </div>

                    {/* Section 3: Data Ownership & Portability */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                <DownloadIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">3. Full Data Ownership</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            You retain 100% ownership of your data. You can export a full, unencrypted JSON backup anytime from Settings and transfer or restore it onto any compatible device.
                        </p>
                    </div>

                    {/* Section 4: Deletion & Control */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                <TrashIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">4. Instant Data Erasure</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Using the <strong>Reset App</strong> option in Settings completely wipes your IndexedDB records instantly. Clearing browser site data or uninstalling the PWA also erases all stored data immediately.
                        </p>
                    </div>

                    {/* Navigation Link back */}
                    <div className="flex items-center justify-center pt-2">
                        <Link 
                            href="/settings"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            ← Back to Settings
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
