"use client"

import Header from "@/components/header/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON, EXPENSE_CATEGORIES, INCOME_CATEGORIES, DEBT_CATEGORIES, TRANSACTION_TYPES } from "@/constants";
import { useTransactionStore } from "@/store/transactionStore";
import { TransactionType } from "@/types";
import toast from "react-hot-toast";

export default function NewTransaction() {

  const router = useRouter();

  const [newtransaction, setNewtransaction] = useState<TransactionType>({
    id: uuidv4(),
    amount: "",
    catogory: "", 
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    transactiontype: "expense" // by default new transactoin is expense
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');
    if (editId) {
      const existing = useTransactionStore.getState().transactions.find(t => t.id === editId);
      if (existing) {
        setNewtransaction(existing);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in pb-24 overflow-y-auto">
      <Header />

      <form className="w-[90%] max-w-md pt-4 mx-auto my-3 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

        {/* DATA- TRANSACTION TYPE */}

        <div className="w-full flex">
          <div className="inline-flex items-center justify-center w-full max-w-xs mx-auto my-2.5 mb-3 p-1 rounded-2xl bg-gray-200/50 dark:bg-slate-800">
            {
              TRANSACTION_TYPES.map((item, index) => 
                <div key={index} className={`px-4 py-3 mx-1 text-center capitalize text-sm font-bold w-full rounded-xl cursor-pointer transition-all duration-200 active:scale-95 ${
                  newtransaction.transactiontype === item 
                    ? 'text-white bg-black dark:text-black dark:bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`} onClick={
                  e => {
                    const value = e.currentTarget.textContent;
                    setNewtransaction((previousdata: any) => {
                      return {
                        ...previousdata,
                        transactiontype: value
                      }
                    })
                  }
                }>{ item }</div>
              )
            }
          </div>
        </div>

        {/* DATA- AMOUNT */}

        <input
          className="block border-none outline-none w-[90%] mx-auto my-2 px-3 py-4 text-3xl font-extrabold text-center bg-transparent border-b-2 border-gray-200 focus:border-black dark:border-gray-700 dark:focus:border-white text-black dark:text-white transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
          type="number"
          name="amount"
          value={newtransaction.amount}
          placeholder="₹ 0"
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

        {/* DATA- CATOGORY */}

        <div className="px-1 py-8">
          <h3 className="capitalize text-[15px] font-bold text-center text-gray-800 dark:text-gray-200">
            { newtransaction.transactiontype === 'expense' ? 'expense made for' : newtransaction.transactiontype === 'income' ? 'income from' : 'debt/lent details' }
          </h3>
          <div className="grid grid-cols-3 grid-rows-2 gap-3 mt-6">
            {
              (newtransaction.transactiontype === 'expense' ? EXPENSE_CATEGORIES : newtransaction.transactiontype === 'income' ? INCOME_CATEGORIES : DEBT_CATEGORIES).map((item, index) => 
                <div key={index}
                     className={`capitalize py-4 rounded-3xl text-center transition-all duration-200 cursor-pointer active:scale-95 ${
                       newtransaction.catogory == item 
                         ? 'text-black bg-white dark:text-white dark:bg-slate-900 shadow-md border border-black dark:border-white ring-1 ring-black dark:ring-white' 
                         : 'text-gray-700 bg-white dark:text-gray-300 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md'
                     }`}
                     onClick={ (e) => {
                      let value = e.currentTarget.textContent;
                      setNewtransaction((previousdata: any) => {
                        return {
                          ...previousdata,
                          catogory: value
                        }
                      })  
                    } }>
                  <Image src={ CATEGORY_ICONS[item] || DEFAULT_CATEGORY_ICON } width={24} height={24} className={`m-auto dark:invert transition-all duration-200 ${newtransaction.catogory == item ? 'opacity-100 scale-110' : 'opacity-60'}`} alt="catogory" />
                  <span className={`mt-2 block text-[13px] ${newtransaction.catogory == item ? 'font-bold' : 'font-medium'}`}>{ item }</span>
                </div>) 
            }
          </div>
        </div>

        {/* DATA- DESCRIPTION */}

        <div>
          <input
            type="text"
            className="block border-none outline-none w-[90%] mx-auto my-2 px-3 py-4 text-[16px] font-medium text-center bg-transparent border-b-2 border-gray-200 focus:border-black dark:border-gray-700 dark:focus:border-white text-black dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={newtransaction.description}
            placeholder="Add description..."
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
            onClick={ async (event) => {
              event.preventDefault();
              
              // Validations
              if (!newtransaction.amount || Number(newtransaction.amount) <= 0) {
                  toast.error("Please enter a valid amount.", { id: "amount-error" });
                  return;
              }

              if (!newtransaction.catogory) {
                  toast.error("Please select a category.", { id: "category-error" });
                  return;
              }

              event.currentTarget.disabled = true;
              
              try {
                  const urlParams = new URLSearchParams(window.location.search);
                  const editId = urlParams.get('editId');
                  if (editId) {
                    await useTransactionStore.getState().updateTransaction(editId, {
                      ...newtransaction,
                      updatedAt: new Date()
                    } as any);
                  } else {
                    await useTransactionStore.getState().addTransaction(newtransaction as any);
                  }

                  // Budget warning check
                  if (newtransaction.transactiontype === "expense") {
                      const { useBudgetStore } = await import("@/store/budgetStore");
                      const budgetLimit = useBudgetStore.getState().budgetLimit;
                      if (budgetLimit !== null) {
                          const { thisMonthExpenseSum } = useTransactionStore.getState().getStats();
                          if (thisMonthExpenseSum > budgetLimit) {
                              toast.error(`⚠️ You've exceeded your monthly budget of ₹${budgetLimit.toLocaleString('en-IN')}!`, { duration: 4000 });
                          } else if (thisMonthExpenseSum >= budgetLimit * 0.8) {
                              toast(`⚡ You've used ${((thisMonthExpenseSum / budgetLimit) * 100).toFixed(0)}% of your monthly budget.`, { icon: '⚠️', duration: 3000 });
                          }
                      }
                  }
                  
                  toast.success("Transaction saved successfully!");
                  router.push("/dashboard"); 
              } catch (error) {
                  toast.error("Failed to save transaction.");
                  event.currentTarget.disabled = false;
              }
            }} className="w-[80%] mx-auto text-white dark:text-black mt-8 py-3.5 px-6 font-bold bg-black dark:bg-white rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-lg active:scale-[0.98] transition-all duration-200 shadow-md">Save Transaction</button>

      </form>

    </div>
  );
}