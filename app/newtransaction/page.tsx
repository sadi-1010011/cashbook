import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import Link from "next/link";

export default function NewTransaction() {
    return (
        <div className={styles.newtrans_container}>
            <Header />
            <div className={styles.newamount_card}>
                <h3 className="capitalize text-lg font-bold">Expense</h3>
                <input className={styles.newinputamt} type="number" placeholder="$ Amount.." />
                
                <div className={styles.trans_catogorywrapper}>
                    <h3 className="capitalize text-lg font-bold">expenses made for</h3>
                    <select className={styles.selectcatogory}>
                        <option>Food</option>
                        <option>Travel</option>
                        <option>Entertainment</option>
                    </select>
                </div>

                <div>
                    <h3 className="capitalize text-lg font-bold">Description</h3>
                    <textarea className={styles.newdescription} placeholder="descripion.."></textarea>
                </div>
            </div>
            <Link href="/expense">
                <button className="text-green-600 py-5 font-bold">Save</button>
            </Link>
        </div>
    )
}