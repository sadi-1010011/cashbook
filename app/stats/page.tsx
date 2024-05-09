import Header from "@/components/header/header";
import Image from "next/image";
import styles from "./stats.module.css";


export default function Stats() {
    return (
        <div className="container w-full">
            <Header />
            <div className="flex flex-col ite w-10/12 text-white bg-black my-6 mx-auto px-4 py-8 rounded-xl">
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

            <div className="flex items-center justify-evenly my-3 mx-auto w-full">
                <div className="my-1.5 py-5 bg-green-100 w-1/3 text-center rounded-lg">income</div>
                <div className="my-1.5 py-5 bg-green-100 w-1/3 text-center rounded-lg">expense</div>
            </div>
        </div>
    )
}