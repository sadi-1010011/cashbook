"use client"

import Header from "@/components/header/header";
import { useState } from "react";

interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
    isRecurring?: boolean;
}

export default function Bills() {
    // Initial dummy data to showcase the UI
    const [bills, setBills] = useState<Bill[]>([
        { id: '1', title: 'Electricity Bill', amount: 1200, dueDate: '2026-10-15', status: 'unpaid', isRecurring: true },
        { id: '2', title: 'Internet', amount: 800, dueDate: '2026-10-18', status: 'paid', isRecurring: true },
        { id: '3', title: 'Water Bill', amount: 350, dueDate: '2026-10-22', status: 'unpaid', isRecurring: true },
        { id: '4', title: 'Credit Card', amount: 4500, dueDate: '2026-11-05', status: 'unpaid' },
    ]);

    const [activeTab, setActiveTab] = useState('upcoming');

    const toggleStatus = (id: string) => {
        setBills(bills.map(b => b.id === id ? { ...b, status: b.status === 'paid' ? 'unpaid' : 'paid' } : b));
    };

    const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + b.amount, 0);

    const filteredBills = bills.filter(b => {
        if (activeTab === 'upcoming') return b.status === 'unpaid';
        if (activeTab === 'paid') return b.status === 'paid';
        if (activeTab === 'recurring') return b.isRecurring;
        return true;
    });

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                
                {/* Tabs */}
                <div className="sticky top-0 z-10 pt-4 pb-2 bg-[#f6f5f5]/90 dark:bg-slate-950/90 backdrop-blur-md">
                    <div className="w-full flex">
                        <div className="inline-flex items-center justify-center w-full max-w-xs mx-auto p-1 rounded-2xl bg-gray-200/50 dark:bg-slate-800">
                            {
                                ['upcoming', 'paid', 'recurring'].map((item, index) => 
                                    <div key={index} className={`px-4 py-3 mx-1 text-center capitalize text-sm font-bold w-full rounded-xl cursor-pointer transition-all duration-200 active:scale-95 ${
                                        activeTab === item 
                                            ? 'text-white bg-black dark:text-black dark:bg-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                    }`} onClick={ () => setActiveTab(item) }>
                                        { item }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-5 mt-4 mb-4 w-[90%] max-w-md mx-auto">
                    <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 px-1 capitalize">{activeTab} Bills</h2>
                    <button className="flex items-center justify-center py-1.5 px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all">
                        + Add Bill
                    </button>
                </div>

                <section className="px-5 w-[90%] max-w-md mx-auto flex flex-col gap-3">
                    {filteredBills.length > 0 ? (
                        filteredBills.map(bill => (
                            <div key={bill.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bill.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[15px] text-gray-800 dark:text-gray-100">{bill.title}</span>
                                        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-bold text-[15px] text-gray-800 dark:text-gray-100">₹{bill.amount.toLocaleString('en-IN')}</span>
                                    <button 
                                        onClick={() => toggleStatus(bill.id)}
                                        className={`px-3 py-1 text-[11px] font-bold rounded-full transition-colors active:scale-95 ${bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'}`}
                                    >
                                        {bill.status === 'paid' ? 'Paid' : 'Pay Now'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No bills added yet.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
