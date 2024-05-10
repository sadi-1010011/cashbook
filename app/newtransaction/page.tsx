"use client"
import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import Link from "next/link";
import { useState } from "react";

export default function NewTransaction() {

  const [newtransaction, setNewtransaction] = useState({
    amount: 0, // got
    catogory: "", // got 
    description: "", // got
    transactiontype: "expense" // trying.., by default new transactoin is expense
  });

  const [activetab, setActivetab] = useState(true);

  const transaction_catogories = ["food", "travel", "Entertains", "haircut", "medicine", "others"];
  const transaction_types = ["income", "expense"]; // debt type coming soon in version 2

  return (
    <div className={styles.newtrans_container}>
      <Header />


      <div className={styles.newamount_card}>

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
            const { value } = e.target;
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
          <h3 className="capitalize text-lg font-bold">expenses made for</h3>
          <div className={styles.selectcatogory}>
            {
              transaction_catogories.map((item, index) => 
                <div key={index}
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
                </div>
              )
            }
          </div>
        </div>

        {/* DATA- DESCRIPTION */}

        <div>
          <h3 className="capitalize text-lg font-bold px-4">Description</h3>
          <textarea
            className={styles.newdescription}
            placeholder="descripion.."
            onChange={ (e) => {
              const { value } = e.target;
              setNewtransaction(previousdata => {
                return {
                  ...previousdata,
                  description: value
                }
              })
            }}
          ></textarea>
        </div>
      </div>

      <Link href="/dashboard">
        <button onClick={(newtransaction) => savenewtransaction(newtransaction) } className="text-green-600 py-5 font-bold">Save</button>
      </Link>
    </div>
  );
}


function savenewtransaction(transaction) {
  // needs to declare type , so learn Typescript well
  console.log(transaction);
}