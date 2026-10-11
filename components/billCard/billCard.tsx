"use client"

import { useState } from "react";
import Image from "next/image";
import EditIcon from "@/assets/edit.png";
import DeleteIcon from "@/assets/delete.png";
import { BillCardProps } from "@/types";
import { CheckIcon, ReceiptIcon, SolidCheckIcon } from "@/components/icons";

export default function BillCard({
    bill,
    index,
    format,
    getDueBadge,
    onEdit,
    onDelete,
    onToggleStatus,
}: BillCardProps) {
    const [togglestate, setTogglestate] = useState(false);
    const dueBadge = getDueBadge(bill.dueDate, bill.status);

    return (
        <div 
            role="button"
            tabIndex={0}
            aria-expanded={togglestate}
            aria-label={`${bill.title}, ${format(bill.amount)}, due ${new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, status ${bill.status}`}
            className={`flex flex-col w-full mx-auto rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                togglestate ? 'p-5' : 'p-4'
            }`}
            style={{ animationDelay: `${0.04 * (index + 1)}s` }}
            onClick={() => setTogglestate(!togglestate)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    if (e.target === e.currentTarget) {
                        e.preventDefault();
                        setTogglestate(!togglestate);
                    }
                }
            }}
        >
            {/* Main Header / Summary Row */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                    {/* Status Icon */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        bill.status === 'paid' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50' 
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50'
                    }`}>
                        {bill.status === 'paid' ? (
                            <CheckIcon className="w-5 h-5" strokeWidth={2.4} />
                        ) : (
                            <ReceiptIcon className="w-5 h-5" strokeWidth={2} />
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[15px] text-gray-800 dark:text-gray-100 truncate">
                            {bill.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                                Due: {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                            {dueBadge && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${dueBadge.className}`}>
                                    {dueBadge.text}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Amount & Status Text */}
                <div className="flex flex-col items-end shrink-0">
                    <span className="font-extrabold text-[16px] text-gray-900 dark:text-white">
                        {format(bill.amount)}
                    </span>
                    <span className={`text-[11px] font-semibold capitalize mt-0.5 ${
                        bill.status === 'paid' 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-rose-500 dark:text-rose-400'
                    }`}>
                        {bill.status}
                    </span>
                </div>
            </div>

            {/* Toggle Tools (matches TransCardTools) */}
            {togglestate ? (
                <div className="inline-flex items-center w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                    <div className="w-full inline-flex items-center justify-between px-1 text-sm capitalize">
                        {/* Edit Button */}
                        <button 
                            type="button"
                            aria-label="Edit bill"
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(bill);
                            }}
                        >
                            <Image src={EditIcon} width={18} height={18} alt="edit icon" className="dark:invert opacity-70 hover:opacity-100" />
                        </button>

                        {/* Center: Pay / Paid Action */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleStatus(bill);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                bill.status === 'paid' 
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/50 hover:bg-emerald-100/80' 
                                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/50 hover:bg-rose-100/80'
                            }`}
                        >
                            {bill.status === 'paid' ? (
                                <>
                                    <SolidCheckIcon className="w-3.5 h-3.5" />
                                    <span>Paid ✓</span>
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                    <span>Pay Now</span>
                                </>
                            )}
                        </button>

                        {/* Delete Button */}
                        <button 
                            type="button"
                            aria-label="Delete bill"
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-all active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(bill);
                            }}
                        >
                            <Image src={DeleteIcon} width={18} height={18} alt="delete icon" className="dark:invert opacity-70 hover:opacity-100" />
                        </button>
                    </div>
                </div>
            ) : false}
        </div>
    );
}
