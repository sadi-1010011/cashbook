"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import CountUp from "react-countup";
import Loading from "@/components/loading/Loading";
import AddSubscriptionModal from "@/components/addSubscriptionModal/addSubscriptionModal";
import ConfirmSubscriptionModal from "@/components/confirmSubscriptionModal/confirmSubscriptionModal";
import SubscriptionCard from "@/components/subscriptionCard/subscriptionCard";
import toast from "react-hot-toast";
import { SubscriptionType, SubscriptionDueBadge } from "@/types";
import { RenewIcon } from "@/components/icons";

const CATEGORIES = ["All", "Entertainment", "Productivity", "Utilities", "Software"];

export default function Subscriptions() {
    const { format, currencyInfo, convert } = useCurrencyStore();
    const {
        subscriptions,
        fetchSubscriptions,
        isInitialized,
        isLoading,
        addSubscription,
        updateSubscription,
        toggleSubscriptionStatus,
        deleteSubscription
    } = useSubscriptionStore();

    const [activeCategory, setActiveCategory] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<SubscriptionType | null>(null);
    const [confirmingSubscription, setConfirmingSubscription] = useState<SubscriptionType | null>(null);
    const [deletingSubscription, setDeletingSubscription] = useState<SubscriptionType | null>(null);

    useEffect(() => {
        if (!isInitialized) {
            fetchSubscriptions();
        }
    }, [isInitialized, fetchSubscriptions]);

    // Calculate approximate monthly cost (assuming yearly is divided by 12)
    const totalMonthly = useMemo(() => {
        return subscriptions.reduce((sum, sub) => {
            const cost = Number(sub.amount || 0);
            return sum + (sub.billingCycle === "monthly" ? cost : Math.round(cost / 12));
        }, 0);
    }, [subscriptions]);

    // Filter and sort subscriptions based on active category
    const filteredSubscriptions = useMemo(() => {
        return subscriptions
            .filter(sub => activeCategory === "All" || sub.category === activeCategory)
            .sort((a, b) => {
                // Unpaid first, then by next billing date ascending
                if (a.status !== b.status) return a.status === "unpaid" ? -1 : 1;
                return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
            });
    }, [subscriptions, activeCategory]);

    const handleOpenAdd = () => {
        setEditingSubscription(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (sub: SubscriptionType) => {
        setEditingSubscription(sub);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setEditingSubscription(null);
    };

    const handleToggleStatus = async (id: string, currentStatus: "paid" | "unpaid", name: string) => {
        await toggleSubscriptionStatus(id);
        if (currentStatus === "unpaid") {
            toast.success(`"${name}" marked as Paid!`, { id: "sub-paid" });
        } else {
            toast(`"${name}" marked as Unpaid`, { id: "sub-unpaid" });
        }
    };

    const handleConfirmStatus = async () => {
        if (!confirmingSubscription) return;
        await handleToggleStatus(confirmingSubscription.id, confirmingSubscription.status, confirmingSubscription.name);
        setConfirmingSubscription(null);
    };

    const handleDelete = async (id: string, name: string) => {
        await deleteSubscription(id);
        toast.success(`Deleted "${name}"`, { id: "sub-deleted" });
    };

    const handleConfirmDelete = async () => {
        if (!deletingSubscription) return;
        await handleDelete(deletingSubscription.id, deletingSubscription.name);
        setDeletingSubscription(null);
    };

    const getDueBadge = (dueDateStr: string, status: "paid" | "unpaid"): SubscriptionDueBadge | null => {
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

            <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
                <PageHeader 
                    title="Subscriptions" 
                    badge={
                        <span>
                            Monthly: {currencyInfo.symbol}
                            <CountUp 
                                end={convert(totalMonthly)} 
                                duration={0.6} 
                                preserveValue 
                                separator="," 
                                decimals={0} 
                            />
                        </span>
                    } 
                />

                {/* Category Pills (Scrollable) */}
                <div className="w-full mt-2 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                    <div 
                        role="tablist"
                        aria-label="Filter subscriptions by category"
                        className="flex overflow-x-auto sleek-scrollbar px-5 py-2 w-[90%] max-w-md mx-auto gap-2"
                    >
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                                    activeCategory === category 
                                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                                        : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subheader with + Add New button */}
                <div className="flex items-center justify-between px-2 mt-5 mb-4 w-[90%] max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-[17px] text-gray-800 dark:text-gray-100 capitalize">
                            {activeCategory === 'All' ? 'All' : activeCategory} Subscriptions
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200/70 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold">
                            {filteredSubscriptions.length}
                        </span>
                    </div>

                    <button 
                        type="button"
                        onClick={handleOpenAdd}
                        className="flex items-center justify-center py-2 px-3.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/50 font-semibold text-xs rounded-2xl hover:bg-purple-100/80 active:scale-95 transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                    >
                        + Add New
                    </button>
                </div>

                {/* Content Section */}
                {isLoading || !isInitialized ? (
                    <div className="w-[90%] max-w-md mx-auto flex flex-col gap-3 pb-8 animate-fade-in">
                        <Loading fullPage={false} count={3} />
                    </div>
                ) : (
                    <section 
                        key={activeCategory}
                        className="w-[90%] max-w-md mx-auto flex flex-col gap-3 pb-8 animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        {filteredSubscriptions.length > 0 ? (
                            filteredSubscriptions.map((sub, index) => (
                                <SubscriptionCard
                                    key={sub.id}
                                    subscription={sub}
                                    index={index}
                                    format={format}
                                    getDueBadge={getDueBadge}
                                    onEdit={handleEdit}
                                    onDelete={setDeletingSubscription}
                                    onToggleStatus={setConfirmingSubscription}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/50 flex items-center justify-center mb-3.5 shadow-xs">
                                    <RenewIcon className="w-7 h-7" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                    No subscriptions in {activeCategory === 'All' ? 'any category' : `"${activeCategory}"`}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 max-w-xs">
                                    Track Netflix, Spotify, cloud servers, or SaaS tools and never miss a renewal date.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleOpenAdd}
                                    className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-2xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                                >
                                    + Add New Subscription
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* Add / Edit Subscription Modal */}
            <AddSubscriptionModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onAdd={addSubscription}
                onUpdate={updateSubscription}
                initialSubscription={editingSubscription}
                currencySymbol={currencyInfo.symbol}
            />

            {/* Confirm Pay / Unpay Status Modal */}
            <ConfirmSubscriptionModal
                isOpen={Boolean(confirmingSubscription)}
                subscription={confirmingSubscription}
                onClose={() => setConfirmingSubscription(null)}
                onConfirm={handleConfirmStatus}
                currencySymbol={currencyInfo.symbol}
            />

            {/* Confirm Delete Subscription Modal */}
            <ConfirmSubscriptionModal
                isOpen={Boolean(deletingSubscription)}
                subscription={deletingSubscription}
                mode="delete"
                onClose={() => setDeletingSubscription(null)}
                onConfirm={handleConfirmDelete}
                currencySymbol={currencyInfo.symbol}
            />
        </div>
    );
}
