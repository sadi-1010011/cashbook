"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDateSliced, getDateTimeSliced } from "@/utils/getDateTime";
import { useTransactionStore } from "@/store/transactionStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { TransCardProps, TransCardToolsProps } from "@/types";
import { EditPencilIcon, TrashIcon } from "@/components/icons";
import toast from "react-hot-toast";

export default function TransCard({
    id,
    amount = 0,
    date = "",
    type = "",
    catogory = "",
    description = "",
    expanded = false
}: TransCardProps) {

    const { format } = useCurrencyStore();
    const [togglestate, setTogglestate] = useState(expanded);

    const dateInFormat = getDateSliced(date);
    const dateTimeInFormat = getDateTimeSliced(date);

    return (
        <div 
            className={`flex flex-col w-full mx-auto rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] ${togglestate ? 'p-5' : 'p-4'}`} 
            onClick={() => setTogglestate(!togglestate)}
        >

            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <span className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 capitalize truncate">
                        { description?.length ? description : catogory }
                    </span>
                    <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 capitalize mt-0.5 truncate">{ catogory }</span>
                </div>
                <span className={`${ type === "expense" ? 'text-rose-500' : 'text-emerald-500' } font-bold text-[16px] whitespace-nowrap`}>
                    { type === "expense" && Number(amount) !== 0 ? '- ' : type === "income" ? '+ ' : '' }{ format(Number(amount)) }
                </span>
            </div>

            {/* date as dd-mm-yyyy */}
            {
                togglestate ? <TransCardTools id={id} date={ dateInFormat } time={ dateTimeInFormat } /> : false
            }

        </div>
    );
}

export function TransCardTools({ id, date, time }: TransCardToolsProps) {
    const router = useRouter();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast((t) => (
            <div className="flex flex-col gap-2 p-1 min-w-[220px]">
                <div className="flex items-center gap-2">
                    <span className="text-base">🗑️</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Delete transaction?</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    This transaction will be permanently removed.
                </p>
                <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-gray-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-all active:scale-95 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await useTransactionStore.getState().deleteTransaction(id);
                            toast.success("Transaction deleted.");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white transition-all shadow-sm cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            id: `delete-tx-${id}`,
            duration: 5000,
        });
    };

    return (
        <div className="inline-flex items-center w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="w-full inline-flex items-center justify-between px-1 text-sm capitalize">
                <button 
                    type="button"
                    aria-label="Edit transaction"
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/newtransaction?editId=${id}`);
                    }}
                >
                    <EditPencilIcon className="w-4 h-4" />
                </button>
                <div className="text-center">
                    <span className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">
                        { date || 'date unavailable' }
                    </span>
                    <br/>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                        { time || 'time unavailable' }
                    </span>
                </div>
                <button 
                    type="button"
                    aria-label="Delete transaction"
                    className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-all active:scale-90 cursor-pointer"
                    onClick={handleDelete}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}