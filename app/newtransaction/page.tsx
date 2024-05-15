"use client"

import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import POST_Transactions from "@/actions/POSTtransactions";

export default function NewTransaction() {

  const router = useRouter();

  const [newtransaction, setNewtransaction] = useState({
    amount: "", // got
    catogory: "", // got 
    description: "", // got
    transactiontype: "expense" // by default new transactoin is expense
  });

  const transaction_expense_catogories = ["food", "travel", "movies", "haircut", "medicine", "others"];
  const transaction_income_catogories = ["salary", "tip", "others"];
  const transaction_types = ["income", "expense"]; // debt type coming soon in version 2

  return (
    <div className={styles.newtrans_container}>
      <Header />


      <form className={styles.newamount_card}>

        {/* DATA- TRANSACTION TYPE */}

        <div className="w-full flex">
          <div className={styles.currenttab_viewerwrapper}>
            {
              transaction_types.map((item, index) => 
                <div key={index} className={ newtransaction.transactiontype === item ? styles.active_tab : styles.normal_tab} onClick={
                  e => {
                    const value = e.currentTarget.textContent;
                    setNewtransaction(previousdata => {
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
          className={styles.newinputamt}
          type="number"
          name="amount"
          placeholder="$ Amount.."
          onChange={ e => {
            const { value } = e.currentTarget;
            setNewtransaction(previousdata => {
              return {
                ...previousdata,
                amount: value
              }
            })
          }}
        />

        {/* DATA- CATOGORY */}

        <div className={styles.trans_catogorywrapper}>
          <h3 className="capitalize text-lg font-bold text-center">
            { newtransaction.transactiontype === 'expense' ? 'expense made for' : 'income from' }
          </h3>
          <div className={styles.selectcatogory}>
            {
              newtransaction.transactiontype === 'expense' ?
              (transaction_expense_catogories.map((item, index) => 
                <div key={index}
                     className={ newtransaction.catogory == item ? styles.activeCatogory_tab : styles.normalCatogory_tab }
                     onClick={ (e) => {
                      let value = e.currentTarget.textContent;
                      setNewtransaction(previousdata => {
                        return {
                          ...previousdata,
                          catogory: value
                        }
                      })  
                    } }>
                  {item}
                </div>) 
              )
              :
              (transaction_income_catogories.map((item, index) => 
                <div key={index}
                     className={ newtransaction.catogory == item ? styles.activeCatogory_tab : styles.normalCatogory_tab }
                     onClick={ (e) => {
                      let value = e.currentTarget.textContent;
                      setNewtransaction(previousdata => {
                        return {
                          ...previousdata,
                          catogory: value
                        }
                      })  
                    } }>
                  {item}
                </div>) 
              )
            }
          </div>
        </div>

        {/* DATA- DESCRIPTION */}

        <div>
          <input
            type="text"
            className={styles.newdescription}
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
      
      {/* <Link href="/dashboard"> */}
        <button
            type="submit"
            onClick={ (event) => { event.preventDefault(); POST_Transactions(newtransaction).then( () => router.push("/dashboard")); } } className="text-green-600 py-6 font-bold w-full">Save</button>
      {/* </Link> */}

      </form>

    </div>
  );
}

// Handle data inputs before submiting to backend!

// function transactionDataHandler(data = {}) {
//   // console.log('saving input data to server !', data.amount)

//   // const { amount, catogory, descripion, transactiontype } = data;

//   // check if inputs are filled
//   // if (!(amount && catogory && descripion && transactiontype)) return

// }