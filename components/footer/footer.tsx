"use client"

import Link from "next/link";
import StatsIcon from "@/assets/statsicon.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransactionFormStore } from "@/store/transactionFormStore";
import toast from "react-hot-toast";

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();
    const { isValid, isDirty, isEditing, isSubmitting, submitHandler } = useTransactionFormStore();

    if (pathname === '/') return null;

    const isNewTransactionPage = pathname === '/newtransaction';

    const handleCancel = () => {
        if (isDirty) {
            toast((t) => (
                <div className="flex flex-col gap-2 p-1 min-w-[220px]">
                    <div className="flex items-center gap-2">
                        <span className="text-base">⚠️</span>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Discard changes?</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your transaction details will not be saved.
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-gray-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-all active:scale-95 cursor-pointer"
                        >
                            Keep Editing
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.push('/dashboard');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white transition-all shadow-sm cursor-pointer"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            ), {
                id: "discard-confirmation",
                duration: 5000,
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
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1"/>
                    <rect width="7" height="5" x="14" y="3" rx="1"/>
                    <rect width="7" height="9" x="14" y="12" rx="1"/>
                    <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
            </Link>
            
            {/* Center Dynamic Action Button */}
            {!isNewTransactionPage ? (
                <Link 
                    href="/newtransaction" 
                    aria-label="New transaction"
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-lg transform -translate-y-2 active:scale-90 bg-black text-white dark:bg-white dark:text-black hover:scale-105 shadow-black/20 dark:shadow-white/10 cursor-pointer"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:rotate-90"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
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
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="transition-transform duration-300 transform scale-105 animate-fade-in"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
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
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="22" 
                        height="22" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-transform duration-300 animate-fade-in"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
            
            <Link href="/stats" className={`p-3 rounded-2xl transition-all duration-300 ${pathname === '/stats' ? 'bg-black/10 dark:bg-white/10 shadow-inner backdrop-blur-md scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <Image src={StatsIcon} alt="stats" width="25" height="25" className="dark:invert" />
            </Link>
        </footer>
    );
}