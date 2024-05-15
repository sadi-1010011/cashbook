"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./transcard.module.css";
import Image from "next/image";
import SaveIcon from "@/assets/edit.png";
import DeleteIcon from "@/assets/delete.png";
import { useRouter } from "next/navigation";
import { getDateSliced, getDateTimeSliced } from "@/utils/getDateTime";
import DELETE_Transaction from "@/actions/DELETETransaction";


export default function TransCard({ id, amount=0, date="", type="", catogory="", description="", expanded=false}: any ) {

    const router = useRouter();
    const toggleref = useRef();
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
        <div className={styles.trans_card} onClick={ () => expandedInfo(togglestate) } ref={toggleref}>

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
    // edit, delete transaction tools

    return (
        <>
            <div className="inline-flex items-center w-full my-0.5 p-0.5 rounded-xl">
                <div className="w-full inline-flex items-center justify-between mx-1.5 p-1 text-sm capitalize">
                    <Image src={SaveIcon} width={20} height={20} alt="edit icon" />
                    <div className="text-center">
                        <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">
                                { date || 'date unavailable' }
                        </span>
                        <br/>
                        <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">
                                { time || 'time unavailable' }
                        </span>
                    </div>
                    <Image src={DeleteIcon} width={20} height={20} alt="delete icon" onClick={ () => {
                        console.log('deleting ',id)
                        DELETE_Transaction(id); 
                        // refresh data
                        router.refresh(); 
                    } } />
                </div>
            </div>
        </>
    );
}