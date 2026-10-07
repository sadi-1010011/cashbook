"use client";

import React from 'react';
import Link from 'next/link';

export default function BillsPage() {
  const bills = [
    { id: 1, name: 'Electricity', amount: 1450, dueDate: 'May 20', status: 'Unpaid', icon: 'bolt', color: '#EAB308', bg: '#FEF08A' },
    { id: 2, name: 'Internet (JioFiber)', amount: 999, dueDate: 'May 22', status: 'Unpaid', icon: 'wifi', color: '#3B82F6', bg: '#DBEAFE' },
    { id: 3, name: 'Water', amount: 350, dueDate: 'May 15', status: 'Paid', icon: 'water_drop', color: '#0EA5E9', bg: '#E0F2FE' },
    { id: 4, name: 'Credit Card (HDFC)', amount: 12400, dueDate: 'May 28', status: 'Unpaid', icon: 'credit_card', color: '#10B981', bg: '#D1FAE5' },
    { id: 5, name: 'Rent', amount: 18000, dueDate: 'May 01', status: 'Paid', icon: 'home', color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  const dueSoon = bills.filter(b => b.status === 'Unpaid');
  const totalDue = dueSoon.reduce((acc, curr) => acc + curr.amount, 0);

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
            <h1 className="text-[20px] leading-[28px] tracking-tight font-extrabold text-[#191919]">Bills</h1>
          </div>
          <button aria-label="Add Bill" className="w-10 h-10 rounded-full flex items-center justify-center text-[#1c1b1b] hover:text-[#191919] active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
        </header>

        <main className="flex-1 px-5 flex flex-col gap-5 mt-2">
          
          {/* Hero Summary Card */}
          <section className="w-full bg-[#93C5FD]/30 border border-[#93C5FD] text-[#191919] rounded-[24px] p-6 shadow-sm transition-all flex items-center justify-between">
            <div>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280] uppercase">Total Due</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[32px] leading-[36px] tracking-[-0.02em] font-extrabold text-[#1c1b1b]">₹ {totalDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-[#FFFFFF] rounded-[16px] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#3B82F6] text-[28px]">receipt_long</span>
            </div>
          </section>

          {/* Due Soon (Horizontal Scroll) */}
          <section className="space-y-3 mt-2">
             <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Due Soon</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#EF4444]">{dueSoon.length} UNPAID</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 sleek-scrollbar">
              {dueSoon.map(bill => (
                <div key={`due-${bill.id}`} className="min-w-[150px] bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase">Due {bill.dueDate}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1c1b1b] leading-tight truncate">{bill.name}</h3>
                    <p className="text-[18px] font-extrabold text-[#1c1b1b] mt-1">₹{bill.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <button className="mt-3 w-full py-1.5 rounded-lg bg-[#f1edec] text-[#1c1b1b] text-[12px] font-bold hover:bg-[#e5e2e1] transition-colors">
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* All Bills List */}
          <section className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">All Bills</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">THIS MONTH</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {bills.map(bill => (
                 <div key={bill.id} className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform cursor-pointer hover:border-[#93C5FD]">
                 <div className="flex items-center gap-3.5">
                   <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: bill.bg, color: bill.color }}
                   >
                     <span className="material-symbols-outlined text-[24px]">{bill.icon}</span>
                   </div>
                   <div>
                     <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">{bill.name}</h3>
                     <div className="flex items-center gap-1.5 mt-0.5">
                       {bill.status === 'Paid' ? (
                         <span className="material-symbols-outlined text-[#22C55E] text-[14px]">check_circle</span>
                       ) : (
                         <span className="material-symbols-outlined text-[#EAB308] text-[14px]">schedule</span>
                       )}
                       <p className="text-[12px] leading-[16px] text-[#6B7280]">
                         {bill.status === 'Paid' ? 'Paid' : `Due ${bill.dueDate}`}
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="text-[16px] leading-[24px] font-bold text-[#1c1b1b]">₹ {bill.amount.toLocaleString('en-IN')}</span>
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
