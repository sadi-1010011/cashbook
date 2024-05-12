import Header from "@/components/header/header";
import styles from "./income.module.css";
import TransCard from "@/components/transcard/transcard";
import { prisma } from "../db";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";

export default async function Income() {

    const transaction_income_history = await prisma.transaction.findMany({
        where: {
            transactiontype: "income"
        },
        orderBy: {
            createdAt: 'desc', // or 'asc' for descending order
        },
    });

    return (
        <div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Income history</h2>

            <MishalToggle active="monthly" />

                {
                    transaction_income_history.map(transaction => <TransCard key={transaction.id} amount={transaction.amount} type={transaction.transactiontype} description={transaction.description} />)

                }

            </div>
        </div>
    )
}