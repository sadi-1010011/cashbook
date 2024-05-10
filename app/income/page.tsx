import Header from "@/components/header/header";
import styles from "./income.module.css";
import TransCard from "@/components/transcard/transcard";

export default function Income() {
    return (
        <div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Income history</h2>

                <div className={styles.expense_viewerwrapper}>
                    <div>daily</div>
                    <div className={styles.active_tab}>weekly</div>
                    <div>monthly</div>
                </div>

                <TransCard amount={1800} type="income" description="sallary credited" />
                <TransCard amount={320} type="income" description="debt repayed mishal" />
                <TransCard amount={140} type="income" description="commision from amazon affiliates" />

            </div>
        </div>
    )
}