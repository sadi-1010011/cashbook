"use client"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EditIcon from "@/assets/edit.png";
import DeleteIcon from "@/assets/delete.png";
import { usePathname, useRouter } from "next/navigation";
import { getDateSliced, getDateTimeSliced } from "@/utils/getDateTime";
import { useTransactionStore } from "@/store/transactionStore";


export default function TransCard({ id, amount=0, date="", type="", catogory="", description="", expanded=false}: any ) {

    const router = useRouter();
    const toggleref: any = useRef(null);
    const [togglestate, setTogglestate] = useState(expanded);

    const dateInFormat = getDateSliced(date);
    const dateTimeInFormat = getDateTimeSliced(date);

    useEffect(() => {
        router.refresh();
    }, [togglestate]);
   
    function expandedInfo(isToggleON: Boolean) {
        
        if (!isToggleON && toggleref.current) {
            console.log('expand transaction info !', isToggleON);
            // animated expansion
            toggleref.current.style.padding = "1.25rem";
            setTogglestate(true); // flip toggle
        }

        if (isToggleON && toggleref.current) {
            toggleref.current.style.padding = "1rem";
            setTogglestate(false);
        }
    }
   
    return (
        <div className="flex flex-col w-full mx-auto p-4 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-100 dark:border-slate-800 cursor-pointer active:scale-[0.98]" onClick={ () => expandedInfo(togglestate) } ref={toggleref as any} style={{ padding: togglestate ? '1.25rem' : '1rem' }}>

            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <span className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 capitalize truncate">
                        { description.length ? description : catogory }
                    </span>
                    <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400 capitalize mt-0.5 truncate">{ catogory }</span>
                </div>
                <span className={`${ type === "expense" ? 'text-rose-500' : 'text-emerald-500' } font-bold text-[16px] whitespace-nowrap`}>
                    { type === "expense" ? '- ' : '+ ' }₹{ Number(amount).toLocaleString('en-IN') }
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
    const currentPath = usePathname();

    return (
        <>
            <div className="inline-flex items-center w-full mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="w-full inline-flex items-center justify-between px-1 text-sm capitalize">
                    <Image src={EditIcon} width={20} height={20} alt="edit icon" className="dark:invert cursor-pointer opacity-70 hover:opacity-100" onClick={ (e) => {
                        e.stopPropagation();
                        router.push(`/newtransaction?editId=${id}`);
                    }} />
                    <div className="text-center">
                        <span className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">
                                { date || 'date unavailable' }
                        </span>
                        <br/>
                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                                { time || 'time unavailable' }
                        </span>
                    </div>
                    <Image src={DeleteIcon} width={20} height={20} alt="delete icon" className="dark:invert cursor-pointer opacity-70 hover:opacity-100" onClick={ async (e) => {
                        e.stopPropagation();
                        console.log('deleting ',id)
                        await useTransactionStore.getState().deleteTransaction(id);
                    } } />
                </div>
            </div>
        </>
    );
}