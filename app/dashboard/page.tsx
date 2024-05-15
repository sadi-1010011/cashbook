"use client"

import Header from "@/components/header/header"
import Footer from "@/components/footer/footer"
import styles from './dashboard.module.css';
import Image from "next/image";
import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import EntertainmentIcon from "@/assets/entertainmenticon.png";
import Link from "next/link";
import {  useEffect, useState } from "react";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import GET_Transactions from "@/actions/GETTransactions";

export default function Dashboard() {

    const [allTransactions, setAllTransactions] = useState<any>();

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
        }
    }
    

    return (
        <>
        <Header />
        <div className={styles.page_container}>
            
            <div className={`${styles.balance_card}`}>
                <h1 className="text-white">{ `$ ${ getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum) }` }</h1>
                <span className={`${styles.balance_inr} text-white`}>INR</span>
            </div>

            <div className={`${styles.recentexpenses_container} text-black capitalize`}>
                <h2 className="capitalize text-black px-2 py-2 font-bold text-xl text-center">Recent expenses</h2>
                
                <Link href="/expense">
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={TravelIcon} width={30} height={30} alt="travel icon" />
                        <span className="font-semibold px-3">Travel</span>
                    </div>
                    <span className="font-bold text-red-500">{ `$ ${ totalTravelExpense }` }</span>
                </div>
                </Link>

                <Link href="/expense">
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={FoodIcon} width={30} height={30} alt="food icon" />
                        <span className="font-semibold px-3">Food</span>
                    </div>
                    <span className="font-bold text-red-500">{ `$ ${ totalFoodExpense }` }</span>
                </div>
                </Link>

                <Link href="/expense">
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={EntertainmentIcon} width={30} height={30} alt="Movies icon" />
                        <span className="font-semibold px-3">Movies</span>
                    </div>
                    <span className="font-bold text-red-500">{ `$ ${ totalMoviesExpense }` }</span>
                </div>
                </Link>

            </div>

        </div>
        <Footer />
        </>
    )
}