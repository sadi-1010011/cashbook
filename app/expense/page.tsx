"use client"

import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import Localbase from "localbase";


export default function Expense() {

    const db = new Localbase('kaayidb');
    db.config.debug = false
    const [transaction_expense_history, setTransaction_expense_history] = useState<any>(0);

    useEffect(() => {
        try {
            db.collection('alltransactions').orderBy('createdAt', 'desc').get().then((transactions: any) => {
                const expensetransactions = transactions.filter((item: any) => item.transactiontype === 'expense')
                if (transactions) setTransaction_expense_history(expensetransactions);
            });
        } catch (error) {
            console.log(error);
            setTransaction_expense_history(0);
        }
    }, []);

    return (
        (transaction_expense_history) ?
            (<div className="container bg-[#f6f5f5] dark:bg-slate-950 min-h-full text-black dark:text-white transition-colors duration-200">
                <Header />
                <div className="flex flex-col gap-3 my-4 mx-auto w-[90%] max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                    <h2 className="capitalize font-bold text-xl my-2 text-center tracking-tight text-gray-900 dark:text-gray-100">Expense History</h2>

                    <div className="flex justify-center w-full mb-4">
                        <MishalToggle active="daily" />
                    </div>

                    {
                        (transaction_expense_history.length)
                        ?
                        transaction_expense_history.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={transaction.createdAt} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)
                        :
                        <span className="capitalize font-semibold text-[15px] w-full my-10 text-center text-slate-500">No transactions made yet</span>
                    }

                </div>
            </div>)
            :
            <Loading />
    );
}