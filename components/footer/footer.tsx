"use client"

import Link from "next/link";
import StatsIcon from "@/assets/statsicon.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransactionFormStore } from "@/store/transactionFormStore";
import toast from "react-hot-toast";
import { DashboardGridIcon, PlusIcon, CheckIcon, CloseIcon } from "@/components/icons";

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();
    const { isValid, isDirty, isEditing, isSubmitting, submitHandler } = useTransactionFormStore();

    if (pathname === '/' || pathname === '/landing') return null;

    const isNewTransactionPage = pathname === '/newtransaction';

    const handleCancel = () => {
        if (isDirty) {
            toast((t) => (
                <div className="flex flex-col gap-2 p-1 min-w-[240px] text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center shrink-0 text-sm">
                            ⚠️
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Discard changes?</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-0.5 leading-relaxed">
                        Your transaction details will not be saved.
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Keep Editing
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.push('/dashboard');
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            ), {
                id: "discard-confirmation",
                duration: 5000,
                className: "!bg-white dark:!bg-slate-900 !text-gray-900 dark:!text-white border border-gray-200/80 dark:border-slate-800 !shadow-xl !rounded-3xl !p-3.5",
            });
        } else {
            router.push('/dashboard');
        }
    };

    const handleSave = () => {
        if (submitHandler && !isSubmitting) {
            submitHandler();
        }
    };

    return (
        <footer className="flex items-center justify-evenly fixed bottom-0 w-full py-5 z-[99] rounded-t-[1.8em] bg-[#f6f5f5]/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 text-black dark:text-white shadow-[0_-4px_10px_-5px_rgba(115,115,115,0.75)] transition-colors duration-200">
            <Link href="/dashboard" className={`p-3 rounded-2xl transition-all duration-300 ${pathname === '/dashboard' ? 'bg-black/10 dark:bg-white/10 shadow-inner backdrop-blur-md scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <DashboardGridIcon className="w-[26px] h-[26px]" />
            </Link>
            
            {/* Center Dynamic Action Button */}
            {!isNewTransactionPage ? (
                <Link 
                    href="/newtransaction" 
                    aria-label="New transaction"
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-lg transform -translate-y-2 active:scale-90 bg-black text-white dark:bg-white dark:text-black hover:scale-105 shadow-black/20 dark:shadow-white/10 cursor-pointer"
                >
                    <PlusIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
                </Link>
            ) : isValid ? (
                /* Ready State: Green Checkmark */
                <button 
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    aria-label={isEditing ? "Update transaction" : "Save transaction"}
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-xl transform -translate-y-2 active:scale-90 scale-105 bg-emerald-500 hover:bg-emerald-600 text-white ring-4 ring-emerald-500/25 shadow-emerald-500/35 cursor-pointer disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <CheckIcon className="w-6 h-6 transition-transform duration-300 transform scale-105 animate-fade-in" strokeWidth={3} />
                    )}
                </button>
            ) : (
                /* Incomplete State: Red Cross (Cancel / Discard) */
                <button 
                    type="button"
                    onClick={handleCancel}
                    aria-label="Cancel transaction"
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-lg transform -translate-y-2 active:scale-90 scale-105 bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20 shadow-rose-500/30 cursor-pointer"
                >
                    <CloseIcon className="w-[22px] h-[22px] transition-transform duration-300 animate-fade-in" strokeWidth={2.5} />
                </button>
            )}
            
            <Link href="/stats" className={`p-3 rounded-2xl transition-all duration-300 ${pathname === '/stats' ? 'bg-black/10 dark:bg-white/10 shadow-inner backdrop-blur-md scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <Image src={StatsIcon} alt="stats" width="25" height="25" className="dark:invert" />
            </Link>
        </footer>
    );
}