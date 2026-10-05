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

      <form className="w-4/5 pt-4 mx-auto my-3 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

        {/* DATA- TRANSACTION TYPE */}

        <div className="w-full flex">
          <div className="inline-flex items-center justify-center w-[70%] mx-auto my-2.5 mb-3 p-0.5 rounded-md">
            {
              TRANSACTION_TYPES.map((item, index) => 
                <div key={index} className={`px-4 py-3.5 mx-px text-center capitalize text-sm font-bold w-full rounded-md cursor-pointer transition-colors duration-200 ${
                  newtransaction.transactiontype === item 
                    ? 'text-white bg-black dark:text-black dark:bg-white' 
                    : 'text-black bg-white dark:text-white dark:bg-slate-900'
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
          className="block border-none outline-none w-[90%] mx-auto my-1 px-3 py-4 text-2xl font-extrabold text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-black dark:text-white"
          style={{ borderBottom: '2px solid lightgrey' }}
          type="number"
          name="amount"
          value={newtransaction.amount}
          placeholder="₹ Amount.."
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

        <div className="px-3 py-10">
          <h3 className="capitalize text-lg font-bold text-center text-black dark:text-white">
            { newtransaction.transactiontype === 'expense' ? 'expense made for' : newtransaction.transactiontype === 'income' ? 'income from' : 'debt/lent details' }
          </h3>
          <div className="grid grid-cols-3 grid-rows-2 gap-2.5 mt-8">
            {
              (newtransaction.transactiontype === 'expense' ? EXPENSE_CATEGORIES : newtransaction.transactiontype === 'income' ? INCOME_CATEGORIES : DEBT_CATEGORIES).map((item, index) => 
                <div key={index}
                     className={`capitalize py-4 rounded-lg text-center transition-colors duration-200 cursor-pointer ${
                       newtransaction.catogory == item 
                         ? 'text-black bg-gray-300 dark:text-white dark:bg-slate-700' 
                         : 'text-black bg-[#edecec] dark:text-white dark:bg-slate-800'
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
                  <Image src={ CATEGORY_ICONS[item] || DEFAULT_CATEGORY_ICON } width={25} height={25} className="m-auto dark:invert" alt="catogory" />
                  <span className="mt-1 text-sm">{ item }</span>
                </div>) 
            }
          </div>
        </div>

        {/* DATA- DESCRIPTION */}

        <div>
          <input
            type="text"
            className="block border-none outline-none w-[90%] h-auto mx-auto my-1 px-3 py-4 pb-3 text-lg text-center bg-transparent text-black dark:text-white"
            style={{ borderBottom: '2px solid lightgrey' }}
            value={newtransaction.description}
            placeholder="Add descripion.."
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
            }} className="text-green-600 mt-8 mx-auto py-3 px-6 font-bold bg-green-200 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-400 hover:text-green-50 transition-colors duration-200">Save</button>

      </form>

    </div>
  );
}