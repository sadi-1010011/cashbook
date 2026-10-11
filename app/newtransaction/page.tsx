"use client"

import Header from "@/components/header/header";
import PageHeader from "@/components/pageHeader/pageHeader";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON, EXPENSE_CATEGORIES, INCOME_CATEGORIES, DEBT_CATEGORIES, TRANSACTION_TYPES } from "@/constants";
import { useTransactionStore } from "@/store/transactionStore";
import { useTransactionFormStore } from "@/store/transactionFormStore";
import { TransactionType } from "@/types";
import toast from "react-hot-toast";
import { useCurrencyStore } from "@/store/currencyStore";

export default function NewTransaction() {

  const router = useRouter();
  const { currencyInfo, convertToBase, convert, format } = useCurrencyStore();
  const { setFormState, setSubmitHandler, resetFormState, isSubmitting, setIsSubmitting } = useTransactionFormStore();

  const [newtransaction, setNewtransaction] = useState<TransactionType>({
    id: uuidv4(),
    amount: "",
    catogory: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    transactiontype: "expense" // by default new transactoin is expense
  });

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState<TransactionType | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    if (editId) {
      setIsEditing(true);
      const existing = useTransactionStore.getState().transactions.find(t => t.id === editId);
      if (existing) {
        const convertedData = {
          ...existing,
          amount: convert(Number(existing.amount))
        };
        setNewtransaction(convertedData);
        setInitialData(convertedData);
      }
    }
  }, [convert]);

  const isValid = Boolean(newtransaction.amount && Number(newtransaction.amount) > 0 && newtransaction.catogory);

  const isDirty = useMemo(() => {
    if (isEditing && initialData) {
      return (
        String(newtransaction.amount) !== String(initialData.amount) ||
        newtransaction.catogory !== initialData.catogory ||
        newtransaction.description !== initialData.description ||
        newtransaction.transactiontype !== initialData.transactiontype
      );
    }
    return Boolean(
      (newtransaction.amount && String(newtransaction.amount).trim() !== "" && Number(newtransaction.amount) > 0) ||
      newtransaction.catogory !== "" ||
      (newtransaction.description && newtransaction.description.trim() !== "")
    );
  }, [newtransaction, isEditing, initialData]);

  const handleSave = useCallback(async () => {
    if (!newtransaction.amount || Number(newtransaction.amount) <= 0) {
      toast.error("Please enter a valid amount.", { id: "amount-error" });
      return;
    }

    if (!newtransaction.catogory) {
      toast.error("Please select a category.", { id: "category-error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('editId');
      const baseAmount = convertToBase(Number(newtransaction.amount));
      const transactionToSave = {
        ...newtransaction,
        amount: baseAmount
      };

      if (editId) {
        await useTransactionStore.getState().updateTransaction(editId, {
          ...transactionToSave,
          updatedAt: new Date()
        } as any);
      } else {
        await useTransactionStore.getState().addTransaction(transactionToSave as any);
      }

      // Budget warning check
      if (newtransaction.transactiontype === "expense") {
        const { useBudgetStore } = await import("@/store/budgetStore");
        const budgetLimit = useBudgetStore.getState().budgetLimit;
        if (budgetLimit !== null) {
          const { thisMonthExpenseSum } = useTransactionStore.getState().getStats();
          if (thisMonthExpenseSum > budgetLimit) {
            toast.error(`⚠️ You've exceeded your monthly budget of ${format(budgetLimit)}!`, { duration: 4000 });
          } else if (thisMonthExpenseSum >= budgetLimit * 0.8) {
            toast(`⚡ You've used ${((thisMonthExpenseSum / budgetLimit) * 100).toFixed(0)}% of your monthly budget.`, { icon: '⚠️', duration: 3000 });
          }
        }
      }

      toast.success(isEditing ? "Transaction updated successfully!" : "Transaction saved successfully!");
      router.push("/dashboard"); 
    } catch (error) {
      toast.error("Failed to save transaction.");
    } finally {
      setIsSubmitting(false);
    }
  }, [newtransaction, convertToBase, isEditing, format, router, setIsSubmitting]);

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  useEffect(() => {
    setFormState({ isValid, isDirty, isEditing });
  }, [isValid, isDirty, isEditing, setFormState]);

  useEffect(() => {
    setSubmitHandler(async () => {
      await handleSaveRef.current();
    });
    return () => {
      resetFormState();
    };
  }, [setSubmitHandler, resetFormState]);

  return (
    <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
      <Header />

      <main className="flex-1 overflow-y-auto pb-28 sleek-scrollbar">
        <PageHeader 
          title={isEditing ? "Edit Transaction" : "New Transaction"} 
          badge={currencyInfo.code} 
        />

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!isSubmitting) {
              handleSave();
            }
          }}
          className="w-[90%] max-w-md mx-auto flex flex-col gap-4 mt-4 pb-12 animate-fade-in-up" 
          style={{ animationDelay: '0.1s' }}
        >

          {/* DATA- TRANSACTION TYPE */}
          <div className="w-full flex">
            <div 
              role="radiogroup"
              aria-label="Transaction Type"
              className="inline-flex items-center justify-center w-full max-w-xs mx-auto p-1 rounded-2xl bg-gray-200/50 dark:bg-slate-800"
            >
              {
                TRANSACTION_TYPES.map((item, index) => 
                  <button 
                    type="button" 
                    key={index}
                    role="radio"
                    aria-checked={newtransaction.transactiontype === item}
                    className={`px-4 py-2.5 mx-0.5 text-center capitalize text-sm font-bold w-full rounded-xl cursor-pointer transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                      newtransaction.transactiontype === item 
                        ? 'text-white bg-black dark:text-black dark:bg-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                    }`} 
                    onClick={() => {
                      setNewtransaction((prev) => ({
                        ...prev,
                        transactiontype: item
                      }));
                    }}
                  >
                    { item }
                  </button>
                )
              }
            </div>
          </div>

          {/* DATA- AMOUNT */}
          <div className="w-full">
            <label htmlFor="transaction-amount" className="sr-only">
              Transaction Amount
            </label>
            <input
              id="transaction-amount"
              className="block border-none outline-none w-[90%] mx-auto my-2 px-3 py-4 text-3xl font-extrabold text-center bg-transparent border-b-2 border-gray-200 focus:border-black dark:border-gray-700 dark:focus:border-white text-black dark:text-white transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded-2xl"
              type="number"
              name="amount"
              aria-label="Transaction Amount"
              value={newtransaction.amount}
              placeholder={`${currencyInfo.symbol.trim()} 0`}
              onChange={ e => {
                const { value } = e.currentTarget;
                if (Number(value) < 0) { 
                    e.currentTarget.value = ''; 
                    toast.error('Amount must be a positive number.');
                    return; 
                }
                setNewtransaction(previousdata => {
                  return {
                    ...previousdata,
                    amount: value
                  }
                })
              }}
            />
          </div>

          {/* DATA- CATOGORY */}
          <div className="px-1 py-8">
            <h3 id="category-section-label" className="capitalize text-[15px] font-bold text-center text-gray-800 dark:text-gray-200">
              { newtransaction.transactiontype === 'expense' ? 'expense made for' : newtransaction.transactiontype === 'income' ? 'income from' : 'debt/lent details' }
            </h3>
            <div 
              role="radiogroup" 
              aria-labelledby="category-section-label"
              className="grid grid-cols-3 grid-rows-2 gap-3 mt-6"
            >
              {
                (newtransaction.transactiontype === 'expense' ? EXPENSE_CATEGORIES : newtransaction.transactiontype === 'income' ? INCOME_CATEGORIES : DEBT_CATEGORIES).map((item, index, arr) => 
                  <button 
                    key={index}
                    id={`category-item-${index}`}
                    type="button"
                    role="radio"
                    aria-checked={newtransaction.catogory == item}
                    aria-label={`Category ${item}`}
                    tabIndex={0}
                    className={`capitalize py-4 rounded-3xl text-center transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                      newtransaction.catogory == item 
                        ? 'text-black bg-white dark:text-white dark:bg-slate-900 shadow-md border border-black dark:border-white ring-1 ring-black dark:ring-white' 
                        : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md'
                    }`}
                    onKeyDown={(e) => {
                      let nextIndex = -1;
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        setNewtransaction((prev) => ({ ...prev, catogory: item }));
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextIndex = (index + 1) % arr.length;
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        nextIndex = (index - 1 + arr.length) % arr.length;
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (index + 3 < arr.length) nextIndex = index + 3;
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (index - 3 >= 0) nextIndex = index - 3;
                      }
                      if (nextIndex !== -1) {
                        const nextCat = arr[nextIndex];
                        setNewtransaction((prev) => ({ ...prev, catogory: nextCat }));
                        const nextEl = document.getElementById(`category-item-${nextIndex}`);
                        nextEl?.focus();
                      }
                    }}
                    onClick={() => {
                      setNewtransaction((prev) => ({
                        ...prev,
                        catogory: item
                      }));
                    }}
                  >
                    <Image src={ CATEGORY_ICONS[item] || DEFAULT_CATEGORY_ICON } width={24} height={24} className={`m-auto dark:invert transition-all duration-200 ${newtransaction.catogory == item ? 'opacity-100 scale-110' : 'opacity-60'}`} alt={item} />
                    <span className={`mt-2 block text-[13px] ${newtransaction.catogory == item ? 'font-bold' : 'font-medium'}`}>{ item }</span>
                  </button>
                ) 
              }
            </div>
          </div>

          {/* DATA- DESCRIPTION */}
          <div className="w-full">
            <label htmlFor="transaction-description" className="sr-only">
              Transaction Description
            </label>
            <input
              id="transaction-description"
              type="text"
              aria-label="Transaction description (optional)"
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 shadow-sm transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-center"
              value={newtransaction.description}
              placeholder="Add description (optional)..."
              onChange={ (e) => {
                const { value } = e.target;
                setNewtransaction(previousdata => {
                  return {
                    ...previousdata,
                    description: value
                  }
                })
              }}
            />
          </div>
      
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 font-semibold text-sm bg-black text-white dark:bg-white dark:text-black rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer mt-3 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Transaction" : "Save Transaction"}
          </button>

      </form>
    </main>

  </div>
);
}