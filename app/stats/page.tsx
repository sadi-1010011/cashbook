"use client"

import Header from "@/components/header/header";
import styles from "./stats.module.css";
import Link from "next/link";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import getPercent from "@/utils/getPercent";
import GET_Transactions from "@/actions/GETTransactions";
import { useEffect, useState } from "react";
import Loading from "@/components/loading/Loading";


export default function Stats() {

    const [allTransactions, setAllTransactions] = useState<any>();

    useEffect(() => {
        GET_Transactions().then(data => {
            setAllTransactions(data);
        });
    }, []);

    // here we need to fetch some data and then
    // do calculations on them and show in UI

    // total income, expense
    let totalIncomeSum = 0;
    let totalExpenseSum = 0;

    let totalTravelExpense = 0;
    let totalFoodExpense = 0;
    let totalMoviesExpense = 0;

    let totalSalaryIncome = 0;
    let totalTipIncome = 0;
    let totalOthersIncome = 0;


    let travelexpensePercent = 0;
    let foodexpensePercent = 0;
    let moviesxpensePercent = 0;

    let salaryIncomePercent = 0;
    let tipIncomePercent = 0;
    let othersIncomePercent = 0;


    if (allTransactions) {
        // calculate income, expense
        for (const record of allTransactions) {
            if (record.transactiontype === "income")
                totalIncomeSum += Number(record.amount);
            if (record.transactiontype === "expense")
                totalExpenseSum += Number(record.amount);
            
            // get catogorywise only data - EXPESES
            switch (record.catogory) {
                case "travel": totalTravelExpense += Number(record.amount); break;
                case "food": totalFoodExpense += Number(record.amount); break;
                case "movies": totalMoviesExpense += Number(record.amount); break;
            }

            // get catogorywise only data - INCOME
            switch (record.catogory) {
                case "salary": totalSalaryIncome += Number(record.amount); break;
                case "tip": totalTipIncome += Number(record.amount); break;
                case "others": totalOthersIncome += Number(record.amount); break;
            }
        }

        // get percentage data - EXPENSE
        travelexpensePercent = getPercent(totalTravelExpense, totalExpenseSum);
        foodexpensePercent = getPercent(totalFoodExpense, totalExpenseSum);
        moviesxpensePercent = getPercent(totalMoviesExpense, totalExpenseSum);

        // get percentage data - INCOME
        salaryIncomePercent = getPercent(totalSalaryIncome, totalIncomeSum);
        tipIncomePercent = getPercent(totalTipIncome, totalIncomeSum);
        othersIncomePercent = getPercent(totalOthersIncome, totalIncomeSum);
    }


    return (
        <div className="container w-full">
            <Header />

            <MishalToggle active="daily" />
            {
                (allTransactions) ?

            (
            <>
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
                    <span className={`${styles.graphbar} bg-red-300`} style={{ "width": `${moviesxpensePercent}%`}}>
                        <span className={styles.graphbar_name}>Movies</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalMoviesExpense }` }</span>
                </div>
            </div>

            <div className="flex flex-col ite w-10/12 text-white bg-black my-4 mx-auto px-4 py-4 rounded-xl">
                
                <h2 className="font-bold text-center py-1.5 uppercase">Income</h2>
                
                <div className="flex items-center justify-between my-4">
                    <span className={`${styles.graphbar} bg-green-500`} style={{ "width": `${ salaryIncomePercent }%`}}>
                        <span className={styles.graphbar_name}>salary</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalSalaryIncome }` }</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} bg-green-400`} style={{ "width": `${tipIncomePercent}%`}}>
                        <span className={styles.graphbar_name}>tip</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalTipIncome }` }</span>
                </div>

                <div className="flex items-center justify-between my-3">
                    <span className={`${styles.graphbar} bg-green-300`} style={{ "width": `${othersIncomePercent}%`}}>
                        <span className={styles.graphbar_name}>others</span>
                    </span>
                    <span className="text-sm px-1 font-semibold whitespace-nowrap">{ `$ ${ totalOthersIncome }` }</span>
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
            </>
            )
            :
            <Loading />
            }

            <Link href="/history">
                <h4 className="text-sm text-slate-500 font-semibold capitalize text-center py-1.5 mb-8">See transaction history</h4>
            </Link>

        </div>
    )
}