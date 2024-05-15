"use client"

import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import GET_Transactions from "@/actions/GETTransactions";
import { useEffect, useState } from "react";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";

export default function History() {    

    const [transactions, setTransactions] = useState<any>();
    const router = useRouter();

   useEffect(() => {
        GET_Transactions().then(data => {
            setTransactions(data as any)
        });
    }, []);

    useEffect(() => {
        router.refresh();
    }, [transactions]);

    return (
        (transactions) ?
        (<div className="container w-full">
            <Header />
            <MishalToggle active="daily" />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">
                {
                    transactions ? (transactions.map(transaction => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={String(transaction.updatedAt)} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)) : <Loading />
                }
            </div>
        </div>)
        :
        <Loading />
    );
}