"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import { useBillStore } from "@/store/billStore";
import CountUp from "react-countup";
import Loading from "@/components/loading/Loading";
import AddBillModal from "@/components/addBillModal/addBillModal";
import ConfirmBillModal from "@/components/confirmBillModal/confirmBillModal";
import BillCard from "@/components/billCard/billCard";
import toast from "react-hot-toast";
import { BillType, BillTabOption, BillDueBadge } from "@/types";
import { ReceiptIcon } from "@/components/icons";

export default function Bills() {
    const { format, currencyInfo, convert } = useCurrencyStore();
    const { 
        bills, 
        fetchBills, 
        isInitialized, 
        isLoading, 
        addBill, 
        updateBill,
        toggleBillStatus, 
        deleteBill 
    } = useBillStore();

    const [activeTab, setActiveTab] = useState<BillTabOption>("upcoming");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBill, setEditingBill] = useState<BillType | null>(null);
    const [confirmingBill, setConfirmingBill] = useState<BillType | null>(null);
    const [deletingBill, setDeletingBill] = useState<BillType | null>(null);

    useEffect(() => {
        if (!isInitialized) {
            fetchBills();
        }
    }, [isInitialized, fetchBills]);

    // Unpaid bills for counter badges and summaries
    const unpaidBills = useMemo(() => bills.filter(b => b.status === "unpaid"), [bills]);
    const totalUnpaid = useMemo(() => unpaidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0), [unpaidBills]);

    // Filtered bills based on active tab
    const filteredBills = useMemo(() => {
        return bills
            .filter(b => {
                if (activeTab === "upcoming") return b.status === "unpaid";
                if (activeTab === "paid") return b.status === "paid";
                return true; // "all"
            })
            .sort((a, b) => {
                // Unpaid first, then sorted by due date ascending
                if (a.status !== b.status) return a.status === "unpaid" ? -1 : 1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
    }, [bills, activeTab]);

    const handleOpenAdd = () => {
        setEditingBill(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (bill: BillType) => {
        setEditingBill(bill);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingBill(null);
    };

    const handleToggleStatus = async (id: string, currentStatus: "paid" | "unpaid", title: string) => {
        await toggleBillStatus(id);
        if (currentStatus === "unpaid") {
            toast.success(`"${title}" marked as Paid!`, { id: "bill-paid" });
        } else {
            toast(`"${title}" marked as Unpaid`, { id: "bill-unpaid" });
        }
    };

    const handleConfirmStatus = async () => {
        if (!confirmingBill) return;
        await handleToggleStatus(confirmingBill.id, confirmingBill.status, confirmingBill.title);
        setConfirmingBill(null);
    };

    const handleDelete = async (id: string, title: string) => {
        await deleteBill(id);
        toast.success(`Deleted "${title}"`, { id: "bill-deleted" });
    };

    const handleConfirmDelete = async () => {
        if (!deletingBill) return;
        await handleDelete(deletingBill.id, deletingBill.title);
        setDeletingBill(null);
    };

    const getDueBadge = (dueDateStr: string, status: "paid" | "unpaid"): BillDueBadge | null => {
        if (status === "paid") return null;

        const due = new Date(dueDateStr);
        due.setHours(23, 59, 59, 999);
        const now = new Date();
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: "Overdue",
                className: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/50"
            };
        }
        if (diffDays === 0) {
            return {
                text: "Due Today",
                className: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50"
            };
        }
        if (diffDays <= 3) {
            return {
                text: `Due in ${diffDays}d`,
                className: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50"
            };
        }
        return null;
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />

            {/* Scrollable content area */}
            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Bills & Utilities" 
                    badge={
                        <span>
                            Unpaid: {currencyInfo.symbol}
                            <CountUp 
                                end={convert(totalUnpaid)} 
                                duration={0.6} 
                                preserveValue 
                                separator="," 
                                decimals={0} 
                            />
                            {/*
                            SHOWS THE NUMBER OF BILLS
                            {" · "}
                            <CountUp 
                                end={unpaidBills.length} 
                                duration={0.6} 
                                preserveValue 
                            /> {unpaidBills.length === 1 ? 'bill' : 'bills'} */}
                        </span>
                    } 
                />

                {/* Tabs (Centered) */}
                <div className="w-[90%] max-w-md mx-auto mt-2 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div 
                        role="tablist"
                        aria-label="Bill filter tabs"
                        className="inline-flex items-center justify-center w-full max-w-xs p-1 rounded-2xl bg-gray-200/50 dark:bg-slate-800"
                    >
                        {(["upcoming", "paid", "all"] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`px-4 py-2.5 mx-0.5 text-center capitalize text-sm font-bold w-full rounded-xl cursor-pointer transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                                    activeTab === tab 
                                        ? 'text-white bg-black dark:text-black dark:bg-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subheader with + Add Bill button */}
                <div className="flex items-center justify-between px-2 mt-5 mb-4 w-[90%] max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 capitalize">
                            {activeTab} Bills
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold">
                            {filteredBills.length}
                        </span>
                    </div>

                    <button 
                        type="button"
                        onClick={handleOpenAdd}
                        className="flex items-center justify-center py-2 px-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 font-semibold text-xs rounded-2xl hover:bg-blue-100/80 active:scale-95 transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                    >
                        + Add Bill
                    </button>
                </div>

                {/* Content Section */}
                { isLoading || !isInitialized ? (
                    <div className="w-[90%] max-w-md mx-auto flex flex-col gap-3 pb-8 animate-fade-in">
                        <Loading fullPage={false} count={3} />
                    </div>
                ) : (
                    <section 
                        key={activeTab}
                        className="w-[90%] max-w-md mx-auto flex flex-col gap-3 pb-8 animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        {filteredBills.length > 0 ? (
                            filteredBills.map((bill, index) => (
                                <BillCard
                                    key={bill.id}
                                    bill={bill}
                                    index={index}
                                    format={format}
                                    getDueBadge={getDueBadge}
                                    onEdit={handleEdit}
                                    onDelete={setDeletingBill}
                                    onToggleStatus={setConfirmingBill}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center mb-3.5 shadow-xs">
                                    <ReceiptIcon className="w-7 h-7" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                    {activeTab === "upcoming" 
                                        ? "No upcoming bills" 
                                        : activeTab === "paid" 
                                        ? "No paid bills yet" 
                                        : "No bills added yet"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 max-w-xs">
                                    {activeTab === "upcoming"
                                        ? "All your bills are settled! Tap below to add a new bill."
                                        : "Keep track of electricity, water, internet, rent and more."}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenAdd}
                                    className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-2xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                                >
                                    + Add New Bill
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* Add / Edit Bill Modal */}
            <AddBillModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onAdd={addBill}
                onUpdate={updateBill}
                initialBill={editingBill}
                currencySymbol={currencyInfo.symbol}
            />

            {/* Confirm Pay / Unpay Status Modal */}
            <ConfirmBillModal
                isOpen={Boolean(confirmingBill)}
                bill={confirmingBill}
                onClose={() => setConfirmingBill(null)}
                onConfirm={handleConfirmStatus}
                currencySymbol={currencyInfo.symbol}
            />

            {/* Confirm Delete Bill Modal */}
            <ConfirmBillModal
                isOpen={Boolean(deletingBill)}
                bill={deletingBill}
                mode="delete"
                onClose={() => setDeletingBill(null)}
                onConfirm={handleConfirmDelete}
                currencySymbol={currencyInfo.symbol}
            />
        </div>
    );
}
