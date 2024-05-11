"use client"
import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import Link from "next/link";
import { useState } from "react";
import saveNewTransaction from "@/utils/saveTransaction";

export default function NewTransaction() {

  const [newtransaction, setNewtransaction] = useState({
    amount: 0, // got
    catogory: "", // got 
    description: "", // got
    transactiontype: "expense" // trying.., by default new transactoin is expense
  });

  const transaction_catogories = ["food", "travel", "Entertains", "haircut", "medicine", "others"];
  const transaction_types = ["income", "expense"]; // debt type coming soon in version 2

  return (
    <div className={styles.newtrans_container}>
      <Header />


      <form action={saveNewTransaction} className={styles.newamount_card}>

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
      
      <Link href="">
        <button onClick={() => {
            // create new formData from our input data
            let formData = new FormData();
            formData.append("amount", newtransaction.amount);
            formData.append("catogory", newtransaction.catogory);
            formData.append("description", newtransaction.description);
            formData.append("transactointype", newtransaction.transactiontype);
            // console.log(formData) // form data cannot be logged in console.
        } } className="text-green-600 py-6 font-bold w-full">Save</button>
      </Link>

      </form>

    </div>
  );
}

function transactionDataHandler(data = {}) {
  // console.log('saving input data to server !', data.amount)

  // const { amount, catogory, descripion, transactiontype } = data;

  // check if inputs are filled
  // if (!(amount && catogory && descripion && transactiontype)) return

}