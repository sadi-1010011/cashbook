"use client"

import Header from "@/components/header/header"
import Footer from "@/components/footer/footer"
import styles from './dashboard.module.css';
import {  useEffect, useState } from "react";
import Loading from "@/components/loading/Loading";
import EditIcon from "@/assets/edit-white.png";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import GET_Transactions from "@/actions/GETTransactions";
import RecentTransCard from "@/components/recentTransCard/recentTransCard";
import Image from "next/image";

export default function Dashboard() {

    const [allTransactions, setAllTransactions] = useState<any>();
    const [recentTransactions, setRecentTransactions] = useState<any>();

    let totalIncomeSum: Number = 0;
    let totalExpenseSum: Number = 0;

    let totalTravelExpense = 0;
    let totalFoodExpense = 0;
    let totalMoviesExpense = 0;

    useEffect(() => {
        // pull all trans data
        GET_Transactions().then(data => {
            setAllTransactions(data);
        });

    }, []);

    if (allTransactions) {

    }

    
    if (allTransactions) {
        let lastRecentTransactionUpto = 3;
    // calculate income, expense
        for (const record of allTransactions) {
            if (record.transactiontype === "income")
                totalIncomeSum += Number(record.amount);
            if (record.transactiontype === "expense")
                totalExpenseSum += Number(record.amount);
            
        }
    }
    

    return (
        <>
        <Header />
        <div className={styles.page_container}>
            
            <div className={`${styles.balance_card}`}>
                <h1 className="text-white">{ `$ ${ getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum) }` }</h1>
                {/* <span className={styles.editbalance}><Image src={EditIcon} width={15} height={15} alt="edit icon"/></span> */}
                <span className={`${styles.balance_inr} text-white`}>INR</span>
            </div>

            <div className={`${styles.recentexpenses_container} text-black capitalize`}>
                <h2 className="capitalize text-black px-2 py-2 font-bold text-xl text-center">Recent transactions</h2>

                {
                    (typeof allTransactions === 'undefined') ? <Loading />
                    :
                    allTransactions.map((item,index) => index < 3 ? <RecentTransCard key={item.id} catogory={String(item.catogory)} amount={Number(item.amount)} type={item.transactiontype} /> : false)
                }
 

            </div>

        </div>
        <Footer />
        </>
    )
}