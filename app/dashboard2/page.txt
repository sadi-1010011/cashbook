"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Dashboard2() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="bg-[#F6F5F5] min-h-screen text-[#1c1b1b] flex flex-col justify-between selection:bg-[#ebe7e7] selection:text-[#191919] font-sans">
      {/* Include Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Application Container Clamped to Mobile Form Factor */}
      <div className="w-full max-w-lg mx-auto min-h-screen flex flex-col bg-[#fdf8f8] pb-32 relative shadow-md">
        
        {/* TopAppBar Component */}
        <header className="flex justify-between items-center w-full px-5 py-3 max-w-lg mx-auto bg-[#fdf8f8] sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] leading-[32px] tracking-tight font-extrabold text-[#191919] uppercase">KAAYI</h1>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Notifications" className="w-10 h-10 rounded-full flex items-center justify-center text-[#444748] hover:text-[#191919] active:scale-95 transition-all" type="button">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button aria-label="Settings" className="w-10 h-10 rounded-full flex items-center justify-center text-[#1c1b1b] hover:text-[#191919] active:scale-95 transition-all" type="button">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-5 flex flex-col gap-5">
          
          {/* Hero Monolith Card */}
          <section className="w-full bg-[#2e2e2e] text-[#FFFFFF] rounded-3xl p-5 shadow-[0_10px_24px_rgba(46,46,46,0.18)] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#979595] uppercase">Total Balance</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2f2e2c] text-[#ffffff] text-[11px] leading-[14px] tracking-[0.06em] font-bold">INR</span>
                <button 
                  onClick={() => setIsHidden(!isHidden)}
                  aria-label="Toggle Balance Visibility" 
                  className="text-[#979595] hover:text-[#FFFFFF] transition-colors flex items-center" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isHidden ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            {/* Big Amount Display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] leading-[40px] tracking-[-0.03em] font-extrabold text-[#FFFFFF]">
                {isHidden ? '₹ ••••••' : '₹ 56,145'}
              </span>
            </div>
            {/* Metric subtitle badge */}
            <div className="mt-2 flex items-center gap-1.5 text-[12px] leading-[16px] text-[#979595]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block"></span>
              <span>+12.4% net cashflow this month</span>
            </div>
            {/* Divider line */}
            <div className="w-full h-px bg-[#2f2e2c] my-4"></div>
            {/* Quick Actions Row inside Monolith */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2f2e2c] hover:bg-[#1a1918] text-[#FFFFFF] text-[12px] leading-[16px] font-semibold active:scale-95 transition-all" type="button">
                <span className="material-symbols-outlined text-[16px]">north_east</span>
                <span>Send</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2f2e2c] hover:bg-[#1a1918] text-[#FFFFFF] text-[12px] leading-[16px] font-semibold active:scale-95 transition-all" type="button">
                <span className="material-symbols-outlined text-[16px]">south_west</span>
                <span>Request</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFFFFF] text-[#191919] text-[12px] leading-[16px] font-semibold shadow-sm active:scale-95 transition-all" type="button">
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add</span>
              </button>
            </div>
          </section>

          {/* Insights / Quick Stats Row */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Insights</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">DAILY METRICS</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Today's Total Card */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between border border-[#E5E7EB]/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#f1edec] flex items-center justify-center text-[#444748]">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </div>
                  <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">TODAY</span>
                </div>
                <div>
                  <p className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Today's Total</p>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Today's Expense</p>
                  <p className="text-[18px] leading-[24px] font-bold text-[#EF4444] mt-2">₹ 0</p>
                </div>
              </div>
              
              {/* Total Monthly Inflow Tile */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between border border-[#E5E7EB]/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-[#22C55E]">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </div>
                  <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#22C55E]">OCTOBER</span>
                </div>
                <div>
                  <p className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Monthly Income</p>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Direct Deposits</p>
                  <p className="text-[18px] leading-[24px] font-bold text-[#22C55E] mt-2">₹ 40,000</p>
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Budget Section */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Monthly Budget</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">OCTOBER</span>
            </div>
            <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-[#22C55E]">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <p className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Monthly Budget</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#22C55E] text-[11px] leading-[14px] tracking-[0.06em] font-bold">21% used</span>
              </div>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full bg-[#f1edec] overflow-hidden">
                  <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '21%' }}></div>
                </div>
                <div className="flex items-center justify-between text-[12px] leading-[16px]">
                  <span className="font-semibold text-[15px] leading-[20px] tracking-[-0.01em] text-[#1c1b1b]">₹855 spent</span>
                  <span className="text-[#6B7280]">Cap: ₹4,000</span>
                </div>
              </div>
              {/* Info Row / Sub-Row */}
              <div className="pt-2 border-t border-[#E5E7EB]/40 flex items-center justify-between text-[12px] leading-[16px]">
                <div className="flex items-center gap-1.5 text-[#22C55E] font-medium">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Safe to spend: ₹157/day</span>
                </div>
                <span className="text-[#6B7280] text-[11px] leading-[14px] tracking-[0.06em] font-bold">20 days left</span>
              </div>
            </div>
          </section>

          {/* Bills & Subscriptions Section */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Bills &amp; Subscriptions</h2>
              <span className="text-[11px] leading-[14px] tracking-[0.06em] font-bold text-[#6B7280]">UPCOMING</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Bills */}
              <Link href="/bills" className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 flex flex-col justify-between active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#93C5FD]/30 flex items-center justify-center text-[#191919]">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FDE047]/60 text-[#191919] text-[11px] leading-[14px] tracking-[0.06em] font-bold">1 DUE</span>
                </div>
                <div>
                  <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Bills</h3>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Electricity · Due May 20</p>
                </div>
              </Link>
              
              {/* Card 2: Subscriptions */}
              <Link href="/subscriptions" className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 flex flex-col justify-between active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E9D5FF]/40 flex items-center justify-center text-[#1c1b1b]">
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#f1edec] text-[#6B7280] text-[11px] leading-[14px] tracking-[0.06em] font-bold">4 ACTIVE</span>
                </div>
                <div>
                  <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Subscriptions</h3>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Next: Spotify (₹119)</p>
                </div>
              </Link>
            </div>
          </section>

          {/* Recent Transactions Section */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] leading-[24px] tracking-[-0.01em] font-bold text-[#1c1b1b]">Recent Transactions</h2>
              <button className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#191919] hover:text-[#6B7280] active:scale-95 transition-all flex items-center gap-1" type="button">
                <span>View all</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Transaction 1: Travel */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#f1edec] flex items-center justify-center text-[#191919]">
                    <span className="material-symbols-outlined text-[22px]">moped</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Travel</h3>
                    <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">pants</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[18px] leading-[24px] font-bold text-[#EF4444]">₹ 499</span>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] text-right">08:42 PM</p>
                </div>
              </div>

              {/* Transaction 2: Salary */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-[#22C55E]">
                    <span className="material-symbols-outlined text-[22px]">payments</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Salary</h3>
                    <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">salary</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[18px] leading-[24px] font-bold text-[#22C55E]">₹ 40000</span>
                  <p className="text-[12px] leading-[16px] text-[#22C55E] text-right">Credit</p>
                </div>
              </div>

              {/* Transaction 3: Food */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#f1edec] flex items-center justify-center text-[#191919]">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Food</h3>
                    <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">hjk</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[18px] leading-[24px] font-bold text-[#EF4444]">₹ 56</span>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] text-right">Yesterday</p>
                </div>
              </div>

              {/* Transaction 4: Subscriptions */}
              <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between border border-[#E5E7EB]/40 active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#E9D5FF]/40 flex items-center justify-center text-[#1c1b1b]">
                    <span className="material-symbols-outlined text-[22px]">play_circle</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] leading-[20px] tracking-[-0.01em] font-semibold text-[#1c1b1b]">Entertainment</h3>
                    <p className="text-[12px] leading-[16px] text-[#6B7280] mt-0.5">Cloud Storage &amp; Streaming</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[18px] leading-[24px] font-bold text-[#EF4444]">₹ 699</span>
                  <p className="text-[12px] leading-[16px] text-[#6B7280] text-right">24 Oct</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-5 py-2 pb-5 max-w-lg mx-auto bg-[#FFFFFF] rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {/* Slot 1: Active Dashboard / Home */}
          <button aria-label="Dashboard" className="flex items-center justify-center p-2 bg-[#ebe7e7] rounded-xl text-[#191919] active:scale-95 transition-transform duration-150" type="button">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          </button>
          {/* Slot 2: Quick-Add Primary Button */}
          <button aria-label="Add transaction" className="flex items-center justify-center p-2 text-[#6B7280] hover:text-[#191919] active:scale-95 transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-[32px] text-[#191919]">add_circle</span>
          </button>
          {/* Slot 3: Reports / Analytics */}
          <button aria-label="Statistics" className="flex items-center justify-center p-2 text-[#6B7280] hover:text-[#191919] active:scale-95 transition-all duration-150" type="button">
            <span className="material-symbols-outlined text-[24px]">query_stats</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
