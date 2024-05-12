"use client"
import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import Link from "next/link";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function NewTransaction() {

  const router = useRouter();

  const [newtransaction, setNewtransaction] = useState({
    amount: "", // got
    catogory: "", // got 
    description: "", // got
    transactiontype: "expense" // by default new transactoin is expense
  });

  const transaction_catogories = ["food", "travel", "Entertains", "haircut", "medicine", "others"];
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
          <h3 className="capitalize text-lg font-bold">expenses made for</h3>
          <div className={styles.selectcatogory}>
            {
              transaction_catogories.map((item, index) => 
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
      
      {/* <Link href="/dashboard"> */}
        <button
            type="submit"
            onClick={ (event) => {
              // prevent default actions
              event.preventDefault();

              const savetoDB = async function () {
                
                try {
                  console.log('saving new transaction data to backend !');

                  const res = await fetch("/api/newTransaction", {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      time: new Date().toISOString(),
                      amount: newtransaction.amount,
                      catogory: newtransaction.catogory,
                      description: newtransaction.description,
                      transactiontype: newtransaction.transactiontype,
                    }),
                  });

                  const result = await res.json()
                  console.log(result);

                  // if (!result.ok) return console.log("some error in saving data !"); // always logging issue!

                }

                catch (error) {
                  console.log('somethin wrong in saving data, server side !');
                  console.log(error);
                }


              }              
             
              savetoDB();
              router.push('/dashboard');
                
            }


        } className="text-green-600 py-6 font-bold w-full">Save</button>
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