import Header from "@/components/header/header";
import styles from "./stats.module.css";
import Link from "next/link";


export default function Stats() {
    return (
        <div className="container w-full">
            <Header />

            <div className="flex">
                <div className={styles.expense_viewerwrapper}>
                    <div>daily</div>
                    <div className={styles.active_tab}>weekly</div>
                    <div>monthly</div>
                </div>
            </div>

            <div className="flex flex-col ite w-10/12 text-white bg-black my-4 mx-auto px-4 py-4 rounded-xl">
                
                <h2 className="font-bold text-center py-1.5 uppercase">expense</h2>
                
                <div className="flex items-center justify-between my-4">
                    <span className={`${styles.graphbar} w-4/5 bg-red-500`}>
                        <span className={styles.graphbar_name}>Travel</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$1300</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} w-1/2 bg-red-400`}>
                        <span className={styles.graphbar_name}>food</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$800</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} w-1/6 bg-red-300`}>
                        <span className={styles.graphbar_name}>Entertainment</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$200</span>
                </div>
            </div>

            <div className="flex flex-col ite w-10/12 text-white bg-black my-4 mx-auto px-4 py-4 rounded-xl">
                
                <h2 className="font-bold text-center py-1.5 uppercase">Income</h2>
                
                <div className="flex items-center justify-between my-4">
                    <span className={`${styles.graphbar} w-4/5 bg-green-500`}>
                        <span className={styles.graphbar_name}>Rent</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$1100</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} w-1/2 bg-green-400`}>
                        <span className={styles.graphbar_name}>sallary</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$700</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} w-1/6 bg-green-300`}>
                        <span className={styles.graphbar_name}>Bonus</span>
                    </span>
                    <span className="text-sm px-1 font-semibold">$250</span>
                </div>
            </div>

            <div className="flex items-center justify-evenly my-3 mx-auto px-3 w-full capitalize">
                <div className="my-1 mx-1 py-5 bg-green-100 w-1/2 text-center rounded-lg hover:bg-green-200">
                    <Link href="/income" className="text-sm font-bold text-slate-500">total income</Link>
                    <h2 className="font-bold py-1.5">$3480</h2>
                </div>
                <div className="my-1 mx-1 py-5 bg-red-100 w-1/2 text-center rounded-lg hover:bg-red-200">
                    <Link href="/expense" className="text-sm font-bold text-slate-500">total expense</Link>
                    <h2 className="font-bold py-1.5">$480</h2>
                </div>
            </div>

            <Link href="/">
                <h4 className="text-xs text-slate-400 capitalize text-center py-1.5">See transaction history</h4>
            </Link>

        </div>
    )
}