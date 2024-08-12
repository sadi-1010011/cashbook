"use client"

import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useState, useEffect } from "react";
import Localbase from "localbase";


export default function Income() {

    const db = new Localbase('kaayidb');
    const [transaction_income_history, setTransaction_income_history] = useState<any>(0);

    useEffect(() => {
        try {
            db.collection('alltransactions').doc({ 'transactiontype': 'income' }).orderBy('createdAt', 'desc').get().then((transactions: any) => {
                console.log('api block')
                console.log(transactions)
                if (transactions) setTransaction_income_history(transactions);
            });
        } catch (error) {
            console.log('err block')
            console.log(error);
            setTransaction_income_history(0);
        }
    }, []);

    return (
        (transaction_income_history) ?
        (<div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Income history</h2>

            <MishalToggle active="daily" />

                {
                    (transaction_income_history.length)
                        ?
                    transaction_income_history.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={transaction.createdAt} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)
                        :
                    <span className="capitalize font-semibold text-lg w-full my-10 text-center text-slate-500">no transactions made yet</span>

                }

            </div>
        </div>)
        :
        <Loading />
    );
}