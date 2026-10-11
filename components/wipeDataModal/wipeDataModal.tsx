"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { WipeDataModalProps } from "@/types";
import { CloseIcon, WarningIcon, DownloadIcon } from "@/components/icons";

export default function WipeDataModal({
    isOpen,
    onClose,
    onConfirm,
    onBackup,
    transactionCount,
    billCount = 0,
    subscriptionCount = 0,
}: WipeDataModalProps) {
    const [isWiping, setIsWiping] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsWiping(true);
        try {
            await onConfirm();
        } finally {
            setIsWiping(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => !isWiping && onClose()}
        >
            <div 
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-black dark:text-white animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={() => !isWiping && onClose()}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>

                {/* Danger Warning Header */}
                <div className="flex flex-col items-center text-center mt-1">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mb-3 shadow-inner">
                        <WarningIcon className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Reset All Data?
                    </h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        This will permanently delete all your data: <span className="font-semibold text-rose-500">{transactionCount}</span> transactions{billCount > 0 ? `, ${billCount} bills` : ''}{subscriptionCount > 0 ? `, ${subscriptionCount} subscriptions` : ''}, and your budget limit. This action cannot be undone.
                    </p>
                </div>

                {/* Backup Recommendation Box */}
                <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-3.5 flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5">
                        <span className="text-base leading-none">🛡️</span>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Recommended Safety Step</span>
                            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-normal mt-0.5">
                                Take a backup file before resetting so you can restore your transactions later if you change your mind.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            onBackup();
                            toast.success("Backup downloaded! Now safe to proceed.");
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-amber-100/50 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                        <DownloadIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>Download Backup First</span>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 mt-1">
                    <button
                        type="button"
                        disabled={isWiping}
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isWiping}
                        onClick={handleConfirm}
                        className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                        {isWiping ? "Resetting..." : "Yes, Wipe Data"}
                    </button>
                </div>
            </div>
        </div>
    );
}
