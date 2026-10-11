"use client"

import { useState } from "react";
import Image from "next/image";
import EditIcon from "@/assets/edit.png";
import DeleteIcon from "@/assets/delete.png";
import { useRouter } from "next/navigation";
import { getDateSliced, getDateTimeSliced } from "@/utils/getDateTime";
import { useTransactionStore } from "@/store/transactionStore";
import { useCurrencyStore } from "@/store/currencyStore";


export default function TransCard({ id, amount=0, date="", type="", catogory="", description="", expanded=false}: any ) {

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
                        { description.length ? description : catogory }
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

export function TransCardTools({ id, date, time }: any) {
    const router = useRouter();

    return (
        <div className="inline-flex items-center w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="w-full inline-flex items-center justify-between px-1 text-sm capitalize">
                    <button 
                        type="button"
                        aria-label="Edit transaction"
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
                        onClick={ (e) => {
                            e.stopPropagation();
                            router.push(`/newtransaction?editId=${id}`);
                        }}
                    >
                        <Image src={EditIcon} width={18} height={18} alt="edit icon" className="dark:invert opacity-70 hover:opacity-100" />
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
                        onClick={ async (e) => {
                            e.stopPropagation();
                            await useTransactionStore.getState().deleteTransaction(id);
                        } }
                    >
                        <Image src={DeleteIcon} width={18} height={18} alt="delete icon" className="dark:invert opacity-70 hover:opacity-100" />
                    </button>
                </div>
            </div>
    );
}