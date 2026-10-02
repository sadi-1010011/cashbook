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
            toggleref.current.style.padding = "2rem 2rem 1.8rem 2rem";
            setTogglestate(true); // flip toggle
        }

        if (isToggleON && toggleref.current) {
            toggleref.current.style.padding = "1.2rem 2rem 0.25rem 2rem";
            setTogglestate(false);
        }
    }
   
    return (
        <div className="flex flex-col items-center justify-between w-full px-8 pt-5 pb-1 my-2.5 mx-auto rounded-[14px] transition-[padding] duration-300 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)] bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-100 dark:border-slate-800" onClick={ () => expandedInfo(togglestate) } ref={toggleref as any}>

            <div className="inline-flex w-full items-center justify-between">
                <span className="capitalize">{ description.length ? description : catogory }</span>
                <span className={`${ type === "expense" ? 'text-red-500' : 'text-green-500' } font-bold text-nowrap`}>
                    { type === "expense" ? `- ${amount}` : `+ ${amount}` }
                </span>
            </div>

            <div className="inline-flex w-full">
                <span className="text-xs font-extralight capitalize pb-1">{ catogory }</span>
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
            <div className="inline-flex items-center w-full my-0.5 p-0.5 rounded-xl">
                <div className="w-full inline-flex items-center justify-between mx-1.5 p-1 text-sm capitalize">
                    <Image src={EditIcon} width={20} height={20} alt="edit icon" className="dark:invert" onClick={ () => {
                        router.push(`/newtransaction?editId=${id}`);
                    }} />
                    <div className="text-center">
                        <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">
                                { date || 'date unavailable' }
                        </span>
                        <br/>
                        <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">
                                { time || 'time unavailable' }
                        </span>
                    </div>
                    <Image src={DeleteIcon} width={20} height={20} alt="delete icon" className="dark:invert" onClick={ async () => {
                        console.log('deleting ',id)
                        await useTransactionStore.getState().deleteTransaction(id);
                    } } />
                </div>
            </div>
        </>
    );
}