"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { DocumentTextIcon, ShieldCheckIcon, WarningIcon, DownloadIcon } from "@/components/icons";
import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Terms of Service" 
                    backHref="/settings"
                    badge="v1.2.0"
                />

                <div className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                    {/* Hero Highlight Card */}
                    <div className="flex flex-col gap-3 w-full bg-gradient-to-br from-blue-500/10 via-white to-indigo-500/5 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border border-blue-200/70 dark:border-blue-900/50 p-5 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/40">
                                <DocumentTextIcon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="font-bold text-[16px] text-gray-900 dark:text-white">Terms & Conditions</h2>
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mt-0.5">Simple, Transparent & Fair</p>
                            </div>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                            By using Cashbook, you agree to these simple terms. Cashbook is a local-first software tool designed to help you organize your daily finances.
                        </p>
                    </div>

                    {/* Section 1: Nature of the Software */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                <DocumentTextIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">1. Software Utility</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Cashbook is provided as a standalone client-side Progressive Web Application. It operates autonomously in your web browser without connecting to remote account servers or banking networks.
                        </p>
                    </div>

                    {/* Section 2: No Financial Advice */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                <WarningIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">2. No Financial Advice</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Calculations, exchange conversions, due countdowns, and budget percentages are for informational tracking purposes only. Cashbook does not provide certified financial, legal, tax, or investment advice.
                        </p>
                    </div>

                    {/* Section 3: Data Custody */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <DownloadIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">3. Backup Responsibility</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Because Cashbook preserves your privacy by keeping data 100% on your device, we cannot recover data if you clear your browser cache or lose your physical device. We strongly recommend regularly downloading a JSON backup from the Settings page.
                        </p>
                    </div>

                    {/* Section 4: Limitation of Liability */}
                    <div className="flex flex-col gap-3 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                                <ShieldCheckIcon className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">4. Disclaimer of Warranties</h3>
                        </div>
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            Cashbook is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Under no circumstances shall the creators be held liable for any data loss, calculation discrepancy, or financial decisions made based on the application.
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
