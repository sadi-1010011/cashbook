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
import RupeeIcon from "@/assets/rupee.png";
import Image from "next/image";

export default function Dashboard() {

    const [allTransactions, setAllTransactions] = useState<any>();

    let totalIncomeSum: any = 0;
    let totalExpenseSum: any = 0;

    useEffect(() => {
        // pull all trans data
        try {
            GET_Transactions().then(data => {
                setAllTransactions(data);
            });
        } catch (error){
            console.log(error);
            setAllTransactions('');
        }

    }, []);

    
    if (allTransactions) {
        let lastRecentTransactionUpto = 3;
    // calculate income, expense
        for (const record of allTransactions) {
            if (record.transactiontype === "income")
                totalIncomeSum = Number(record.amount) + totalIncomeSum;
            if (record.transactiontype === "expense")
                totalExpenseSum = Number(record.amount) + totalExpenseSum;
            
        }
    }
    

    return (
        <>
        <Header />
        <div className={styles.page_container}>
            
            <div className={`${styles.balance_card}`}>
                <h1 className="text-white inline-flex items-center justify-center">
                    <Image src={RupeeIcon} alt="rupee icon" width={22} height={22} className="mx-1" />
                    {`${ getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum) || '0' }` }
                </h1>
                {/* <span className={styles.editbalance}><Image src={EditIcon} width={15} height={15} alt="edit icon"/></span> */}
                <span className={`${styles.balance_inr} text-white`}>INR</span>
            </div>

        {
            (allTransactions) ?

            (<div className={`${styles.recentexpenses_container} text-black capitalize`}>
                <h2 className="capitalize text-black px-2 py-2 font-bold text-xl text-center">Recent transactions</h2>

                {
                    (allTransactions.length) 
                        ? 
                    allTransactions.map((item: any,index: any) => index < 3 ? <RecentTransCard key={item.id} catogory={String(item.catogory)} amount={Number(item.amount)} type={item.transactiontype} /> : false)
                        :
                    (
                        <RecentTransCard catogory={'no transactions yet'} amount={0} type={'income'} />
                        
                    )
                } 


            </div>)

        :
        
        // <Loading /> // hiding in vercel deploy bcz no backend available
        <RecentTransCard catogory={'no transactions yet'} amount={0} type={'income'} />
        

    }

        </div>
        <Footer />
        </>
    )
}