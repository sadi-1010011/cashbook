"use client"

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { AddBillModalProps, BillType } from "@/types";
import { PRESET_BILLS, BILL_CATEGORIES } from "@/constants";
import { EditPencilIcon, ReceiptIcon, CloseIcon } from "@/components/icons";

export default function AddBillModal({
    isOpen,
    onClose,
    onAdd,
    onUpdate,
    initialBill,
    currencySymbol
}: AddBillModalProps) {
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<"unpaid" | "paid">("unpaid");
    const [category, setCategory] = useState("utilities");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(initialBill);

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

    // Synchronize form when modal opens or initialBill changes
    useEffect(() => {
        if (isOpen) {
            if (initialBill) {
                setTitle(initialBill.title || "");
                setAmount(initialBill.amount !== undefined ? String(initialBill.amount) : "");
                setDueDate(initialBill.dueDate || "");
                setStatus(initialBill.status || "unpaid");
                setCategory(initialBill.category || "utilities");
            } else {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                const yyyy = nextWeek.getFullYear();
                const mm = String(nextWeek.getMonth() + 1).padStart(2, "0");
                const dd = String(nextWeek.getDate()).padStart(2, "0");
                setDueDate(`${yyyy}-${mm}-${dd}`);
                setTitle("");
                setAmount("");
                setStatus("unpaid");
                setCategory("utilities");
            }
        }
    }, [isOpen, initialBill]);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a bill title", { id: "bill-title-error" });
            return;
        }

        const numAmount = Number(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount", { id: "bill-amount-error" });
            return;
        }

        if (!dueDate) {
            toast.error("Please select a due date", { id: "bill-date-error" });
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && initialBill && onUpdate) {
                await onUpdate(initialBill.id, {
                    title: title.trim(),
                    amount: numAmount,
                    dueDate,
                    status,
                    category,
                });
                toast.success("Bill updated successfully!", { id: "bill-success" });
            } else {
                const newBill: BillType = {
                    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `bill-${Date.now()}`,
                    title: title.trim(),
                    amount: numAmount,
                    dueDate,
                    status,
                    category,
                    createdAt: Date.now(),
                };
                await onAdd(newBill);
                toast.success("Bill added successfully!", { id: "bill-success" });
            }
            onClose();
        } catch {
            toast.error(isEditMode ? "Failed to update bill" : "Failed to add bill");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectPreset = (preset: { title: string; category: string }) => {
        setTitle(preset.title);
        setCategory(preset.category);
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
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                            {isEditMode ? (
                                <EditPencilIcon className="w-5 h-5" />
                            ) : (
                                <ReceiptIcon className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight">
                                {isEditMode ? "Edit Bill" : "Add New Bill"}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {isEditMode ? "Update bill details and due date" : "Track and manage upcoming dues"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto sleek-scrollbar flex flex-col gap-4 py-4 px-1.5">
                    {/* Bill Title */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="bill-title" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Bill Name / Title
                        </label>
                        <input
                            id="bill-title"
                            type="text"
                            placeholder="e.g. Electricity, Internet, Rent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-11 px-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white transition-all"
                            autoFocus
                        />

                        {/* Quick Presets */}
                        <div 
                            role="group" 
                            aria-label="Quick preset bills"
                            className="flex items-center gap-1.5 mt-1 overflow-x-auto pb-1 sleek-scrollbar"
                        >
                            <span className="text-[10px] text-gray-400 uppercase font-semibold shrink-0">Quick:</span>
                            {PRESET_BILLS.map(preset => (
                                <button
                                    key={preset.title}
                                    type="button"
                                    aria-pressed={title === preset.title}
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                                        title === preset.title
                                            ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    {preset.title.replace(" Bill", "")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="bill-amount" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Amount ({currencySymbol.trim()})
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-sm text-gray-400 pointer-events-none font-semibold">
                                {currencySymbol.trim()}
                            </span>
                            <input
                                id="bill-amount"
                                type="number"
                                placeholder="0.00"
                                step="any"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-11 pl-8 pr-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 focus:outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-black dark:text-white transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="bill-category" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Category
                        </label>
                        <select
                            id="bill-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-11 px-3 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white capitalize focus:outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all cursor-pointer"
                        >
                            {BILL_CATEGORIES.map(cat => (
                                <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="bill-due-date" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Due Date
                        </label>
                        <input
                            id="bill-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full h-11 px-3.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 text-black dark:text-white [color-scheme:light] dark:[color-scheme:dark] focus:outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Initial Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Status
                        </label>
                        <div 
                            role="radiogroup" 
                            aria-label="Bill payment status"
                            className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl"
                        >
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === "unpaid"}
                                onClick={() => setStatus("unpaid")}
                                className={`py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
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
                                className={`py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
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
                            className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 py-3 px-4 rounded-2xl text-xs font-bold bg-black text-white dark:bg-white dark:text-black shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                            <span>
                                {isSubmitting 
                                    ? (isEditMode ? "Saving..." : "Adding...") 
                                    : (isEditMode ? "Save Changes" : "Add Bill")}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
