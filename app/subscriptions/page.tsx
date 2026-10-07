"use client";

import React from 'react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const subscriptions = [
    { id: 1, name: 'Netflix', price: 649, date: '12th', status: 'Active', icon: 'movie', color: '#EF4444', bg: '#FEE2E2' },
    { id: 2, name: 'Spotify', price: 119, date: '15th', status: 'Active', icon: 'music_note', color: '#22C55E', bg: '#D1FAE5' },
    { id: 3, name: 'Amazon Prime', price: 1499, date: 'Annual (Oct)', status: 'Active', icon: 'local_shipping', color: '#3B82F6', bg: '#DBEAFE' },
    { id: 4, name: 'Gym Membership', price: 1200, date: '1st', status: 'Active', icon: 'fitness_center', color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  const upcoming = [
    { id: 1, name: 'Netflix', price: 649, date: 'Oct 12' },
    { id: 2, name: 'Spotify', price: 119, date: 'Oct 15' },
  ];

  return (
    <div className="bg-[#F6F5F5] min-h-screen text-[#1c1b1b] flex flex-col justify-between selection:bg-[#ebe7e7] selection:text-[#191919] font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="w-full max-w-lg mx-auto min-h-screen flex flex-col bg-[#fdf8f8] pb-10 relative shadow-md">
        
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-5 py-3 max-w-lg mx-auto bg-[#fdf8f8] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link href="/dashboard2" className="w-10 h-10 rounded-full flex items-center justify-center text-[#444748] hover:text-[#191919] bg-[#f1edec] active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h1 className="text-[20px] leading-[28px] tracking-tight font-extrabold text-[#191919]">Subscriptions</h1>
          </div>
          <button aria-label="Add Subscription" className="w-10 h-10 rounded-full flex items-center justify-center text-[#1c1b1b] hover:text-[#191919] active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
        </header>

        <main className="flex-1 px-5 flex flex-col gap-5 mt-2">
          
          {/* Hero Summary Card */}
          <section className="w-full bg-[#E9D5FF]/30 border border-[#E9D5FF] text-[#191919] rounded-[24px] p-6 shadow-sm transition-all flex items-center justify-between">
            <div>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280] uppercase">Monthly Spend</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[32px] leading-[36px] tracking-[-0.02em] font-extrabold text-[#1c1b1b]">₹ 1,968</span>
                <span className="text-[14px] font-medium text-[#6B7280]">/mo</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-[#FFFFFF] rounded-[16px] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#8B5CF6] text-[28px]">sync</span>
            </div>
          </section>

          {/* Upcoming Renewals (Horizontal Scroll) */}
          <section className="space-y-3 mt-2">
             <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Upcoming</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#EF4444]">NEXT 7 DAYS</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 sleek-scrollbar">
              {upcoming.map(sub => (
                <div key={`up-${sub.id}`} className="min-w-[140px] bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase">{sub.date}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1c1b1b] leading-tight truncate">{sub.name}</h3>
                    <p className="text-[18px] font-extrabold text-[#1c1b1b] mt-1">₹{sub.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Subscriptions List */}
          <section className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Active Subscriptions</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">{subscriptions.length} TOTAL</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {subscriptions.map(sub => (
                 <div key={sub.id} className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform cursor-pointer hover:border-[#E9D5FF]">
                 <div className="flex items-center gap-3.5">
                   <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: sub.bg, color: sub.color }}
                   >
                     <span className="material-symbols-outlined text-[24px]">{sub.icon}</span>
                   </div>
                   <div>
                     <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">{sub.name}</h3>
                     <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Renews on {sub.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="text-[16px] leading-[24px] font-bold text-[#1c1b1b]">₹ {sub.price}</span>
                 </div>
               </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
