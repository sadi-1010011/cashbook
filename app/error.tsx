"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WarningIcon, ArrowPathIcon, HomeIcon } from "@/components/icons";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Log the error locally for diagnosis
        console.error("App Router caught an unhandled error:", error);
    }, [error]);

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5f5] dark:bg-slate-950 text-black dark:text-white px-4 py-12 transition-colors duration-200">
            <div className="w-full max-w-md flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-xl animate-fade-in-up">
                {/* Warning Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200/60 dark:border-rose-900/50 flex items-center justify-center mb-5 shadow-xs">
                    <WarningIcon className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
                    Application Error
                </span>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                    Something went wrong
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                    CashBook encountered an unexpected issue. Because all your transactions, bills, and settings are stored locally on your device, <span className="font-semibold text-gray-700 dark:text-gray-300">your data is completely safe</span>.
                </p>

                {/* Optional Collapsible Technical Details */}
                {error?.message && (
                    <div className="w-full mb-6 text-left">
                        <button
                            type="button"
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium underline underline-offset-2 mb-2 cursor-pointer"
                        >
                            {showDetails ? "Hide technical details" : "Show technical details"}
                        </button>
                        {showDetails && (
                            <div className="p-3 bg-gray-50 dark:bg-slate-800/80 rounded-2xl border border-gray-200/70 dark:border-slate-700/80 text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32 sleek-scrollbar break-words">
                                {error.message}
                                {error.digest && (
                                    <div className="mt-1 text-[10px] text-gray-400">
                                        Digest: {error.digest}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Recovery Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
