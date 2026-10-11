"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";

interface Subscription {
    id: string;
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly';
    category: string;
    nextBillingDate: string;
}

const CATEGORIES = ['All', 'Entertainment', 'Productivity', 'Utilities', 'Software'];

export default function Subscriptions() {
    const [activeCategory, setActiveCategory] = useState('All');
    const { format } = useCurrencyStore();
    
    // Initial dummy data
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([
        { id: '1', name: 'Netflix', amount: 499, billingCycle: 'monthly', category: 'Entertainment', nextBillingDate: '2026-10-15' },
        { id: '2', name: 'Spotify', amount: 119, billingCycle: 'monthly', category: 'Entertainment', nextBillingDate: '2026-10-18' },
        { id: '3', name: 'Notion', amount: 800, billingCycle: 'yearly', category: 'Productivity', nextBillingDate: '2027-01-10' },
        { id: '4', name: 'AWS', amount: 1250, billingCycle: 'monthly', category: 'Utilities', nextBillingDate: '2026-11-05' },
    ]);

    const filteredSubscriptions = subscriptions.filter(sub => 
        activeCategory === 'All' || sub.category === activeCategory
    );

    // Calculate approximate monthly cost (assuming yearly is divided by 12)
    const totalMonthly = subscriptions.reduce((sum, sub) => sum + (sub.billingCycle === 'monthly' ? sub.amount : Math.round(sub.amount / 12)), 0);

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                
                <PageHeader 
                    title="Subscriptions" 
                    badge={`Monthly: ${format(totalMonthly)}`} 
                />

                {/* Category Pills (Scrollable) */}
                <div className="w-full mt-2">
                    <div className="flex overflow-x-auto sleek-scrollbar px-5 py-2 w-[90%] max-w-md mx-auto gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                                    activeCategory === category 
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                        : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-slate-800'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between px-5 mt-4 mb-4 w-[90%] max-w-md mx-auto">
                    <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 px-1">{activeCategory === 'All' ? 'All' : activeCategory} Subscriptions</h2>
                    <button className="flex items-center justify-center py-2 px-3.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/50 font-semibold text-xs rounded-2xl hover:bg-purple-100/80 active:scale-95 transition-all cursor-pointer shadow-xs">
                        + Add New
                    </button>
                </div>

                {/* Subscriptions List */}
                <section className="px-5 w-[90%] max-w-md mx-auto flex flex-col gap-3">
                    {filteredSubscriptions.length > 0 ? (
                        filteredSubscriptions.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/50 font-bold text-xl uppercase">
                                        {sub.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[15px] text-gray-800 dark:text-gray-100">{sub.name}</span>
                                        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Next: {new Date(sub.nextBillingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-[15px] text-gray-800 dark:text-gray-100">{format(sub.amount)}</span>
                                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{sub.billingCycle}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No subscriptions in this category.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
