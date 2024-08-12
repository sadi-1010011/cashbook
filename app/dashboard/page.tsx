"use client"

import Header from "@/components/header/header"
import Footer from "@/components/footer/footer"
import styles from './dashboard.module.css';
import {  useEffect, useState } from "react";
// import Loading from "@/components/loading/Loading";
// import EditIcon from "@/assets/edit-white.png";
// import GET_Transactions from "@/actions/GETTransactions";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import RecentTransCard from "@/components/recentTransCard/recentTransCard";
import RupeeIcon from "@/assets/rupee.png";
import Image from "next/image";
import Localbase from "localbase";


export default function Dashboard() {
    
    const [allTransactions, setAllTransactions] = useState<any>();
    let totalIncomeSum: number = 0;
    let totalExpenseSum: number = 0;
    
    
    function getAllTransactions() {
        console.log('getting all transactions from db!');
        const db = new Localbase('kaayidb');
        db.collection('alltransactions').orderBy('createdAt', 'desc').get().then((alltransactions: any) => {
            console.log(alltransactions)
            setAllTransactions(alltransactions);
        }); 
    }

    // new offline storage 
    useEffect(() => {
        // if db already exist
        try {
            getAllTransactions();
        } catch (error) {
            console.log('db unavailable')
            // initDefaultDB();
        }

    }, []);
        

    // calculate income, expense
    if (allTransactions) {
        let lastRecentTransactionUpto = 3;

        allTransactions.map((transaction: any) => {
            if (transaction.transactiontype === "income")
                totalIncomeSum = Number(transaction.amount) + totalIncomeSum;
            if (transaction.transactiontype === "expense")
                totalExpenseSum = Number(transaction.amount) + totalExpenseSum;
        })
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