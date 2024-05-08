import Header from "@/components/header/header";
import styles from "./income.module.css";

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

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 180</span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 320</span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 1400 </span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 200 </span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 78 </span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 50 </span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span className="font-bold text-green-500"> + 35 </span>
                </div>

                <div className={styles.expense_card}>
                    <span>income</span>
                    <span>rate</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span>rate</span>
                </div>
            </div>
        </div>
    )
}