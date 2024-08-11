"use client"

import Header from "@/components/header/header";
import styles from "./expense.module.css";
import TransCard from "@/components/transcard/transcard";
import { prisma } from "../db";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import GET_Transaction_Expense_History from "@/actions/GETTransactionExpenseHistory";

export default function Expense() {

    const [transaction_expense_history, setTransaction_expense_history] = useState<any>(0);

    useEffect(()=> {
        try {
           GET_Transaction_Expense_History().then(data => {
                if (!data) return 0;
                setTransaction_expense_history(data as any);
           });
        } catch (error) {
            console.log(error);
            setTransaction_expense_history(0);
        }
    });

    return (
        (transaction_expense_history) ?
        (<div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Expense history</h2>

            <MishalToggle active="daily" />

                {
                    // (transaction_income_history.length)
                        // ?
                    transaction_expense_history.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={transaction.createdAt} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)
                        // :
                    // <span className="capitalize font-semibold text-lg w-full my-10 text-center text-slate-500">no transactions made yet</span>

                }

            </div>
        </div>)
        :
        <Loading />
    );
}