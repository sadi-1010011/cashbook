import Header from "@/components/header/header";
import styles from "./expense.module.css";
import TransCard from "@/components/transcard/transcard";

export default function Expense() {
    return (
        <div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Spend history</h2>

                <div className={styles.currenttab_viewerwrapper}>
                    <div>daily</div>
                    <div className={styles.active_tab}>weekly</div>
                    <div>monthly</div>
                </div>

                <TransCard amount={320} type="expense" description="Bike service" />
                <TransCard amount={30} type="expense" description="Tea & snacks" />
                <TransCard amount={3120} type="expense" description="rent to mishal" />
                <TransCard amount={320} type="expense" description="tyre puncture" />
                <TransCard amount={220} type="expense" description="mobile recharge" />
                <TransCard amount={1400} type="expense" description="debt cleared to abhi" />
                <TransCard amount={40} type="expense" description="dinner" />
                <TransCard amount={200} type="expense" description="fuel" />
              
            </div>
        </div>
    )
}