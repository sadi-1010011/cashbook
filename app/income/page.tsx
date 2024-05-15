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
        GET_Transaction_Income_History().then(data => {
            setTransaction_income_history(data as any);
        });
    });

    return (
        (transaction_income_history) ?
        (<div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Income history</h2>

            <MishalToggle active="monthly" />

                {
                    transaction_income_history.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={transaction.createdAt} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)

                }

            </div>
        </div>)
        :
        <Loading />
    );
}