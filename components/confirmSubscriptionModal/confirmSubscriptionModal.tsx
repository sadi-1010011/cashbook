"use client"

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ConfirmSubscriptionModalProps } from "@/types";
import { CloseIcon, TrashIcon, CheckIcon, UndoIcon } from "@/components/icons";

export default function ConfirmSubscriptionModal({
    isOpen,
    onClose,
    onConfirm,
    subscription,
    currencySymbol,
    mode = "status"
}: ConfirmSubscriptionModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isProcessing) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isProcessing, onClose]);

    if (!isOpen || !subscription || !mounted) return null;

    const isDeleteMode = mode === "delete";
    const isPaying = subscription.status === "unpaid";

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm();
            onClose();
        } catch {
            // Error handling done by caller
        } finally {
            setIsProcessing(false);
        }
    };

    const formattedDate = (() => {
        try {
            return new Date(subscription.nextBillingDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        } catch {
            return subscription.nextBillingDate;
        }
    })();

    const modalContent = (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => !isProcessing && onClose()}
        >
            <div 
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-black dark:text-white animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => !isProcessing && onClose()}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    aria-label="Close modal"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>

                {/* Status Indicator Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-inner ${
                    isDeleteMode
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50"
                        : isPaying
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                        : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50"
                }`}>
                    {isDeleteMode ? (
                        <TrashIcon className="w-7 h-7" />
                    ) : isPaying ? (
                        <CheckIcon className="w-7 h-7" strokeWidth={2.4} />
                    ) : (
                        <UndoIcon className="w-7 h-7" />
                    )}
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {isDeleteMode 
                        ? "Delete Subscription?" 
                        : isPaying 
                        ? "Mark as Paid?" 
                        : "Mark as Unpaid?"}
                </h2>

                {/* Description */}
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs">
                    {isDeleteMode ? (
                        <>
                            Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{subscription.name}"</span>? This will permanently remove it from your subscriptions list.
                        </>
                    ) : isPaying ? (
                        <>
                            Are you sure you want to mark <span className="font-semibold text-gray-800 dark:text-gray-200">"{subscription.name}"</span> as paid for this cycle?
                        </>
                    ) : (
                        <>
                            Are you sure you want to move <span className="font-semibold text-gray-800 dark:text-gray-200">"{subscription.name}"</span> back to unpaid renewals?
                        </>
                    )}
                </p>

                {/* Subscription Summary Pill */}
                <div className="w-full mt-4 p-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-between text-left">
                    <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{subscription.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Next: {formattedDate} · <span className="capitalize">{subscription.billingCycle}</span></p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                            {currencySymbol}{Number(subscription.amount).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleConfirm}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                            isDeleteMode
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : isPaying
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                        }`}
                    >
                        {isProcessing 
                            ? (isDeleteMode ? "Deleting..." : "Updating...") 
                            : isDeleteMode
                            ? "Yes, Delete"
                            : isPaying 
                            ? "Yes, Mark Paid" 
                            : "Yes, Mark Unpaid"}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
