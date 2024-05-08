import Header from "@/components/header/header";
import styles from "./expense.module.css";

export default function Expense() {
    return (
        <div className="container">
            <Header />
            <div className="flex items-center flex-col my-2 mx-auto py-2 px-4">

            <h2 className="capitalize font-bold text-lg my-2">Spend history</h2>

                <div className={styles.expense_viewerwrapper}>
                    <div>daily</div>
                    <div className={styles.active_tab}>weekly</div>
                    <div>monthly</div>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 320</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 30</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 110</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 320</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 220</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 1220</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 380</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 80</span>
                </div>

                <div className={styles.expense_card}>
                    <span>expense</span>
                    <span className="font-bold text-red-500"> - 200</span>
                </div>
            </div>
        </div>
    )
}