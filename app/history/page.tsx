"use client"

import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import Localbase from "localbase";
 
export default function History() {    

    const [transactions, setTransactions] = useState<any>();
    const db = new Localbase('kaayidb');
    db.config.debug = false

    useEffect(() => {
        try {
            db.collection('alltransactions').orderBy('createdAt', 'desc').get().then((transactions: any) => {
                if (transactions.length) setTransactions(transactions);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        (transactions) ?
        (<div className="container w-full">
            <Header />
            <MishalToggle active="daily" />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">
                {
                    (transactions.length)
                        ?
                    (transactions.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={String(transaction.updatedAt)} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />))
                        :
                    (<span className="capitalize font-semibold text-lg w-full my-10 text-center text-slate-500">no transactions made yet</span>)
                    
                }
            </div>
        </div>)
        :
        <Loading />
    );
}