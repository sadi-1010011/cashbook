"use client"

import Header from "@/components/header/header";
import styles from "./expense.module.css";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import Localbase from "localbase";


export default function Expense() {
    
    const db = new Localbase('kaayidb');
    db.config.debug = false
    const [transaction_expense_history, setTransaction_expense_history] = useState<any>(0);

    useEffect(()=> {
        try {
            db.collection('alltransactions').orderBy('createdAt', 'desc').get().then((transactions: any) => {
                const expensetransactions = transactions.filter((item: any) => item.transactiontype === 'income')
                if (transactions) setTransaction_expense_history(expensetransactions);
            });
        } catch (error) {
            console.log(error);
            setTransaction_expense_history(0);
        }
    }, []);

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