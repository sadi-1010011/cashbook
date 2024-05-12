import Header from "@/components/header/header";
import styles from "./stats.module.css";
import Link from "next/link";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import { prisma } from "../db";
import getPercent from "@/utils/getPercent";


export default async function Stats() {

    // here we need to fetch some data and then
    // do calculations on them and show in UI

    // total income, expense
    let totalIncomeSum = 0;
    let totalExpenseSum = 0;
    let totalTravelExpense = 0;
    let totalFoodExpense = 0;
    let totalEntertainsExpense = 0;
    let travelexpensePercent = 0;
    let foodexpensePercent = 0;
    let entertainsexpensePercent = 0;

    // get data from DB
    const totalIncome = await prisma.transaction.findMany({
        orderBy: {
            createdAt: 'desc' // asc for ascending
        }
    });

    // calculate income, expense
    for (const record of totalIncome) {
        if (record.transactiontype === "income")
            totalIncomeSum += Number(record.amount);
        if (record.transactiontype === "expense")
            totalExpenseSum += Number(record.amount);
        
        // get travel only data
        if (record.catogory === "travel")
            totalTravelExpense += Number(record.amount);
        if (record.catogory === "food")
            totalFoodExpense += Number(record.amount);
        if (record.catogory === "entertains")
            totalEntertainsExpense += Number(record.amount);
    }

    // get percentage data
    travelexpensePercent = getPercent(totalTravelExpense, totalExpenseSum);
    foodexpensePercent = getPercent(totalFoodExpense, totalExpenseSum);
    entertainsexpensePercent = getPercent(totalEntertainsExpense, totalExpenseSum);



    return (
        <div className="container w-full">
            <Header />

            <MishalToggle active="daily" />

            <div className="flex flex-col ite w-10/12 text-white bg-black my-4 mx-auto px-4 py-4 rounded-xl">
                
                <h2 className="font-bold text-center py-1.5 uppercase">expense</h2>
                
                <div className="flex items-center justify-between my-4">
                    <span className={`${styles.graphbar} bg-red-500`} style={{ "width": `${travelexpensePercent}%`}}>
                        <span className={styles.graphbar_name}>Travel</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalTravelExpense }` }</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} bg-red-400`} style={{ "width": `${foodexpensePercent}%`}}>
                        <span className={styles.graphbar_name}>food</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalFoodExpense }` }</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} bg-red-300`} style={{ "width": `${entertainsexpensePercent}%`}}>
                        <span className={styles.graphbar_name}>Entertainment</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalEntertainsExpense }` }</span>
                </div>
            </div>

            <div className="flex flex-col ite w-10/12 text-white bg-black my-4 mx-auto px-4 py-4 rounded-xl">
                
                <h2 className="font-bold text-center py-1.5 uppercase">Income</h2>
                
                <div className="flex items-center justify-between my-4">
                    <span className={`${styles.graphbar} w-4/5 bg-green-500`}>
                        <span className={styles.graphbar_name}>Rent</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">$1100</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} w-1/2 bg-green-400`}>
                        <span className={styles.graphbar_name}>sallary</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">$700</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span style={{ 'width': '100%'}} className={`${styles.graphbar} bg-green-300`}>
                        <span className={styles.graphbar_name}>Bonus</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">$250</span>
                </div>
            </div>

            <div className="flex items-center justify-evenly my-3 mx-auto px-3 w-full capitalize">
                <div className="my-1 mx-1 py-5 bg-green-100 w-1/2 text-center rounded-lg hover:bg-green-200">
                    <Link href="/income" className="text-sm font-bold text-slate-500">total income</Link>
                    <h2 className="font-bold py-1.5">{ `$ ${totalIncomeSum}` }</h2>
                </div>
                <div className="my-1 mx-1 py-5 bg-red-100 w-1/2 text-center rounded-lg hover:bg-red-200">
                    <Link href="/expense" className="text-sm font-bold text-slate-500">total expense</Link>
                    <h2 className="font-bold py-1.5">{ `$ ${totalExpenseSum}` }</h2>
                </div>
            </div>

            <Link href="/history">
                <h4 className="text-xs text-slate-400 capitalize text-center py-1.5 mb-4">See transaction history</h4>
            </Link>

        </div>
    )
}