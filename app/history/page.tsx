import Header from "@/components/header/header";
import styles from "./history.module.css";
import TransCard from "@/components/transcard/transcard";
import { prisma } from "../db";

export default async function History() {

    // get DB data
    const transactions = await prisma.transaction.findMany()

    return (
        <div className="container w-full">
            <Header />

            <div className="flex">
                <div className={styles.custom_viewerwrapper}>
                    <div>daily</div>
                    <div className={styles.active_tab}>weekly</div>
                    <div>monthly</div>
                </div>
            </div>

            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

                {
                    transactions.map(transaction => <TransCard amount={transaction.amount} type={transaction.transactiontype} description={transaction.description} />)
                }
{/* 
                <TransCard amount={1500} type="income" description="weekly payment" />
                <TransCard amount={200} type="expense" description="dinner porata beef" />
                <TransCard amount={50} type="expense" description="tea at boofiya" />
                <TransCard amount={2000} type="income" description="sallary from zomato" />
                <TransCard amount={30} type="expense" description="puffs and tea" />
                <TransCard amount={50} type="expense" description="afternoon food" />
                <TransCard amount={100} type="income" description="debt return paid basith" />
                <TransCard amount={30} type="expense" description="tea & snacks" />  */}
            </div>
        </div>
    );
}