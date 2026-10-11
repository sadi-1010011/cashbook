"use client"

import { useState } from "react";
import toast from "react-hot-toast";

interface WipeDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    onBackup: () => void;
    transactionCount: number;
}

export default function WipeDataModal({
    isOpen,
    onClose,
    onConfirm,
    onBackup,
    transactionCount
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Danger Warning Header */}
                <div className="flex flex-col items-center text-center mt-1">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mb-3 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Reset All Data?
                    </h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        This will permanently delete all your <span className="font-semibold text-rose-500">{transactionCount}</span> transactions. This action cannot be undone.
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
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
