"use client"

import Image from "next/image";
import RupeeIcon from "@/assets/rupee.png";
import getIncomeExpenseDiff from "@/utils/getIEDifference";
import CountUp from "react-countup";
import { useCurrencyStore } from "@/store/currencyStore";

export default function BalanceCard({ totalIncomeSum, totalExpenseSum }: { totalIncomeSum: number, totalExpenseSum: number }) {
    const { currentCurrency, currencyInfo, convert } = useCurrencyStore();
    const rawBalance = Number(getIncomeExpenseDiff(totalIncomeSum, totalExpenseSum)) || 0;
    const balance = convert(rawBalance);

    return (
        <div className="sticky top-0 z-10 flex justify-center pt-5 pb-3 bg-[#f6f5f5]/90 dark:bg-slate-950/90 backdrop-blur-md">
            <div className="flex items-center justify-between w-[90%] max-w-md py-8 px-8 bg-[#1a1a1a] text-2xl font-extrabold rounded-3xl shadow-xl border border-gray-800 transition-all">
                <h1 className="text-white flex items-center text-3xl tracking-tight">
                    {currentCurrency === 'INR' ? (
                        <Image src={RupeeIcon} alt="rupee icon" width={24} height={24} className="mr-1.5 opacity-90" />
                    ) : (
                        <span className="mr-1.5 text-2xl font-bold opacity-90 text-white">{currencyInfo.symbol.trim()}</span>
                    )}
                    <CountUp
                        key={`${currentCurrency}-${balance}`}
                        end={balance}
                        duration={1.4}
                        decimals={currencyInfo.decimals}
                        separator=","
                        useIndianSeparators={currentCurrency === 'INR'}
                        preserveValue
                    />
                </h1>
                <span className="text-gray-400 text-sm font-medium tracking-wider">{currencyInfo.code}</span>
            </div>
        </div>
    );
}
