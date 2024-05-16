import Header from "@/components/header/header";
import styles from "./expense.module.css";
import TransCard from "@/components/transcard/transcard";
import { prisma } from "../db";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import Loading from "@/components/loading/Loading";

export default async function Expense() {

    let transaction_expense_history: any;
    try {
        transaction_expense_history = await prisma.transaction.findMany({
            where: {
                transactiontype: "expense"
            },
            orderBy: {
                createdAt: 'desc', // or 'desc' for descending order
            },
        });
    } catch (error) {
        console.log(error);
        transaction_expense_history = '';
    }

    return (
        <div className="container">
            <Header />
            {
            transaction_expense_history ?
            (<div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Spend history</h2>

                <MishalToggle active="daily" />

               {
                    (transaction_expense_history.length)
                        ?
                    transaction_expense_history.map((transaction: any) => <TransCard key={transaction.id} id={transaction.id} amount={Number(transaction.amount)} date={transaction.createdAt} type={transaction.transactiontype} catogory={transaction.catogory} description={transaction.description} />)
                        :
                    <span className="capitalize font-semibold text-lg w-full my-10 text-center text-slate-500">no transactions made yet</span>
                    
               }
              
            </div>)
            :
            <Loading />
            }
        </div>
    )
}