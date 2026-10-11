"use client"

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { AddSubscriptionModalProps, SubscriptionType } from "@/types";
import { SUBSCRIPTION_CATEGORIES as CATEGORIES, PRESET_SUBSCRIPTIONS } from "@/constants";
import { EditPencilIcon, RenewIcon, CloseIcon } from "@/components/icons";

export default function AddSubscriptionModal({
    isOpen,
    onClose,
    onAdd,
    onUpdate,
    initialSubscription,
    currencySymbol
}: AddSubscriptionModalProps) {
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [category, setCategory] = useState("Entertainment");
    const [nextBillingDate, setNextBillingDate] = useState("");
    const [status, setStatus] = useState<"unpaid" | "paid">("unpaid");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(initialSubscription);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Synchronize form when modal opens or initialSubscription changes
    useEffect(() => {
        if (isOpen) {
            if (initialSubscription) {
                setName(initialSubscription.name || "");
                setAmount(initialSubscription.amount !== undefined ? String(initialSubscription.amount) : "");
                setBillingCycle(initialSubscription.billingCycle || "monthly");
                setCategory(initialSubscription.category || "Entertainment");
                setNextBillingDate(initialSubscription.nextBillingDate || "");
                setStatus(initialSubscription.status || "unpaid");
            } else {
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                const yyyy = nextMonth.getFullYear();
                const mm = String(nextMonth.getMonth() + 1).padStart(2, "0");
                const dd = String(nextMonth.getDate()).padStart(2, "0");
                setNextBillingDate(`${yyyy}-${mm}-${dd}`);
                setName("");
                setAmount("");
                setBillingCycle("monthly");
                setCategory("Entertainment");
                setStatus("unpaid");
            }
        }
    }, [isOpen, initialSubscription]);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter a subscription name", { id: "sub-name-error" });
            return;
        }

        const numAmount = Number(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount", { id: "sub-amount-error" });
            return;
        }

        if (!nextBillingDate) {
            toast.error("Please select the next billing date", { id: "sub-date-error" });
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && initialSubscription && onUpdate) {
                await onUpdate(initialSubscription.id, {
                    name: name.trim(),
                    amount: numAmount,
                    billingCycle,
                    category,
                    nextBillingDate,
                    status,
                });
                toast.success("Subscription updated successfully!", { id: "sub-success" });
            } else {
                const newSub: SubscriptionType = {
                    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`,
                    name: name.trim(),
                    amount: numAmount,
                    billingCycle,
                    category,
                    nextBillingDate,
                    status,
                    createdAt: Date.now(),
                };
                await onAdd(newSub);
                toast.success("Subscription added successfully!", { id: "sub-success" });
            }
            onClose();
        } catch {
            toast.error(isEditMode ? "Failed to update subscription" : "Failed to add subscription");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectPreset = (preset: { name: string; category: string; cycle: "monthly" | "yearly" }) => {
        setName(preset.name);
        setCategory(preset.category);
        setBillingCycle(preset.cycle);
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] text-black dark:text-white animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                            {isEditMode ? (
                                <EditPencilIcon className="w-5 h-5" />
                            ) : (
                                <RenewIcon className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">
                                {isEditMode ? "Edit Subscription" : "Add New Subscription"}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {isEditMode ? "Update recurring billing and cost" : "Track recurring plans & renewals"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto sleek-scrollbar flex flex-col gap-4 py-4 px-1.5">
                    {/* Subscription Name */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sub-name" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Service / Plan Name
                        </label>
                        <input
                            id="sub-name"
                            type="text"
                            placeholder="e.g. Netflix, Spotify, ChatGPT"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 px-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black dark:text-white transition-all"
                            autoFocus
                        />

                        {/* Quick Presets */}
                        <div 
                            role="group" 
                            aria-label="Preset subscriptions"
                            className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 sleek-scrollbar"
                        >
                            <span className="text-[10px] text-gray-400 uppercase font-semibold shrink-0">Presets:</span>
                            {PRESET_SUBSCRIPTIONS.map(preset => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    aria-pressed={name === preset.name}
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                                        name === preset.name
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount & Billing Cycle */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Amount */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="sub-amount" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Amount ({currencySymbol.trim()})
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3.5 text-sm text-gray-400 pointer-events-none font-semibold">
                                    {currencySymbol.trim()}
                                </span>
                                <input
                                    id="sub-amount"
                                    type="number"
                                    placeholder="0.00"
                                    step="any"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-11 pl-8 pr-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Billing Cycle */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Cycle
                            </label>
                            <div 
                                role="radiogroup" 
                                aria-label="Billing cycle"
                                className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200/60 dark:border-slate-700 h-11 items-center"
                            >
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={billingCycle === "monthly"}
                                    onClick={() => setBillingCycle("monthly")}
                                    className={`h-9 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                                        billingCycle === "monthly"
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={billingCycle === "yearly"}
                                    onClick={() => setBillingCycle("yearly")}
                                    className={`h-9 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                                        billingCycle === "yearly"
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                    }`}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sub-category" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Category
                        </label>
                        <select
                            id="sub-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-11 px-3 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Next Billing Date */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sub-next-date" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Next Billing Date
                        </label>
                        <input
                            id="sub-next-date"
                            type="date"
                            value={nextBillingDate}
                            onChange={(e) => setNextBillingDate(e.target.value)}
                            className="w-full h-11 px-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white [color-scheme:light] dark:[color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    {/* Initial Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Current Cycle Status
                        </label>
                        <div 
                            role="radiogroup" 
                            aria-label="Subscription cycle status"
                            className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl"
                        >
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === "unpaid"}
                                onClick={() => setStatus("unpaid")}
                                className={`py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                                    status === "unpaid"
                                        ? "bg-rose-500 text-white shadow-xs font-bold"
                                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                }`}
                            >
                                Unpaid (Upcoming)
                            </button>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === "paid"}
                                onClick={() => setStatus("paid")}
                                className={`py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                                    status === "paid"
                                        ? "bg-emerald-500 text-white shadow-xs font-bold"
                                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                                }`}
                            >
                                Paid (Settled)
                            </button>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-slate-800 shrink-0 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 py-3 px-4 rounded-2xl text-xs font-bold bg-black text-white dark:bg-white dark:text-black shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                            <span>
                                {isSubmitting 
                                    ? (isEditMode ? "Saving..." : "Adding...") 
                                    : (isEditMode ? "Save Changes" : "Add Subscription")}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
