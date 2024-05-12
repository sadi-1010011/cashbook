import Header from "@/components/header/header";
import TransCard from "@/components/transcard/transcard";
import { prisma } from "../db";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";

export default async function History() {

    // get DB data
    const transactions = await prisma.transaction.findMany({
        orderBy: {
            createdAt: 'desc', // or 'asc' for descending order
          },
    })

    return (
        <div className="container w-full">
            <Header />

            <MishalToggle active="daily" />

            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

                {
                    transactions.map(transaction => <TransCard key={transaction.id} amount={transaction.amount} type={transaction.transactiontype} description={transaction.description} />)
                }

            </div>
        </div>
    );
}