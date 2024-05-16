"use client"

import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import GET_Transaction_Income_History from "@/actions/GETTransactionIncomeHistory";
import { useState } from "react";
import Loading from "@/components/loading/Loading";

export default function Income() {

    const [transaction_income_history, setTransaction_income_history] = useState<any>();

    useState(() => {
        try {
            GET_Transaction_Income_History().then(data => {
                if (!data) return 0;
                setTransaction_income_history(data as any);
            });
        } catch (error) {
            console.log(error);
            // setTransaction_income_history('')
        }
    });

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