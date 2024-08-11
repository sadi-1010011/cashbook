"use client"

import Header from "@/components/header/header";
import styles from "./stats.module.css";
import Link from "next/link";
import MishalToggle from "@/components/mishaltoggle/mishalToggle";
import getPercent from "@/utils/getPercent";
import GET_Transactions from "@/actions/GETTransactions";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/loading/Loading";
import PlotPieChart from "@/utils/plotPieChart";

export default function Stats() {

    const [allTransactions, setAllTransactions] = useState<any>();
    const [totalIncome, setTotalIncomeSum] = useState<number>(0);
    const [totalExpense, setTotalExpenseSum] = useState<number>(0);
    const incomecanvas = useRef(null); // initial value of cnvs set to null
    const expensecanvas = useRef(null); // bcs it won't be rendered yet to draw on

    // here we need to fetch some data and then
    useEffect(() => {
        GET_Transactions().then(data => {
            setAllTransactions(data);
        });
    }, []);

    // do calculations on them and show in UI

    // total income, expense etc
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


    // PIE CHART REPRESENTATION
    
    useEffect(() => {

        // calculate all values
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

        // set total in-out amount
        setTotalIncomeSum(totalIncomeSum);
        setTotalExpenseSum(totalExpenseSum);

        // INCOME PIE CHART
        const ctx1 = incomecanvas.current!; // plot only after acquiring context
        if (ctx1) PlotPieChart(ctx1, 'incomechart', 'Income', ['salary', 'tip', 'others'], [salaryIncomePercent/3, tipIncomePercent/3, othersIncomePercent/3,]);

        // EXPENSE PIE CHART
        const ctx2 = expensecanvas.current!; // here too
        if (ctx2) PlotPieChart(ctx2, 'expensechart', 'Expense', ['Travel', 'Food', 'Movies'], [travelexpensePercent/3, foodexpensePercent/3, moviesxpensePercent/3,]);

      }, [allTransactions]);


    return (
        <div className="container w-full" style={{ backgroundColor: '#f6f5f5fe' }}>

            <Header />

            <MishalToggle active="daily" />
            {
              (allTransactions) ?
            (
            <>

            {/* EXPENSE CANVAS */}
            <div className="flex w-10/12 my-4 mx-auto px-4 py-4">
                <canvas id="expensechart" className="m-auto" ref={expensecanvas}></canvas>
            </div>

            {/* INCOME CANVAS */}
            <div className="flex w-10/12 my-4 mx-auto px-4 py-4">
                <canvas id="incomechart" className="m-auto" ref={incomecanvas}></canvas>
            </div>

            {/* TOTAL IN-EX */}
            <div className="flex items-center justify-evenly my-3 mx-auto px-3 w-full capitalize">
                <div className="my-1 mx-1 py-5 bg-green-100 w-1/2 text-center rounded-lg hover:bg-green-200">
                    <Link href="/income" className="text-sm font-bold text-slate-500">total income</Link>
                    <h2 className="font-bold py-1.5">{ `₹ ${ totalIncome }` }</h2>
                </div>
                <div className="my-1 mx-1 py-5 bg-red-100 w-1/2 text-center rounded-lg hover:bg-red-200">
                    <Link href="/expense" className="text-sm font-bold text-slate-500">total expense</Link>
                    <h2 className="font-bold py-1.5">{ `₹ ${ totalExpense }` }</h2>
                </div>
            </div>

            </>
            )

            :

            // LOADING UI

            <div style={{ minHeight: '60vh', display: "flex", alignItems: 'center' }}>
                <Loading />
            </div>
            }

            <Link href="/history">
                <h4 className="text-sm text-slate-500 font-semibold capitalize text-center py-1.5 mb-8">See transaction history</h4>
            </Link>

        </div>
    )
}
