"use client"

// ICONS
import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import MoviesIcon from "@/assets/entertainmenticon.png";
import MedicineIcon from "@/assets/medicine.png";
import HaircutIcon from "@/assets/haircut.png";
import SalaryIcon from "@/assets/salary.png";
import MoneyIcon from "@/assets/money.png";
import OthersIcon from "@/assets/others.png";
// components and functions
import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import addNewTransaction from "./addNewTransaction";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

export default function NewTransaction() {

  const router = useRouter();

  const [newtransaction, setNewtransaction] = useState({
    id: uuidv4(),
    amount: "", // got
    catogory: "", // got 
    description: "", // got
    createdAt: new Date(),
    updatedAt: new Date(),
    transactiontype: "expense" // by default new transactoin is expense
  });

  const transaction_expense_catogories = ["food", "travel", "movies", "haircut", "medicine", "others"];
  const transaction_income_catogories = ["salary", "tip", "others"];
  const transaction_types = ["income", "expense"]; // debt type coming soon in version 2

  const iconsheat: any = {
    'travel': TravelIcon,
    'food': FoodIcon,
    'movies': MoviesIcon,
    'medicine': MedicineIcon,
    'haircut': HaircutIcon,
    'others': OthersIcon,
    'salary': SalaryIcon,
    'tip': MoneyIcon,
}

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
          className={styles.newinputamt}
          type="number"
          name="amount"
          placeholder="₹ Amount.."
          onChange={ e => {
            const { value } = e.currentTarget;
            if (Number(value) < 0) { e.currentTarget.value = '0'; return alert('use expense for negative values..');}
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
                      setNewtransaction((previousdata: any) => {
                        return {
                          ...previousdata,
                          catogory: value
                        }
                      })  
                    } }>
                  <Image src={ (Object.hasOwn(iconsheat, `${item}`)) ? iconsheat[`${item}`] : OthersIcon } width={25} height={25} className="m-auto" alt="catogory" />
                  <span className="mt-1 text-sm">{ item }</span>
                </div>) 
              )
              :
              (transaction_income_catogories.map((item, index) => 
                <div key={index}
                     className={ newtransaction.catogory == item ? styles.activeCatogory_tab : styles.normalCatogory_tab }
                     onClick={ (e) => {
                      let value = e.currentTarget.textContent;
                      setNewtransaction((previousdata: any) => {
                        return {
                          ...previousdata,
                          catogory: value
                        }
                      })  
                    } }>
                    <Image src={ (Object.hasOwn(iconsheat, `${item}`)) ? iconsheat[`${item}`] : OthersIcon } width={25} height={25} className="m-auto" alt="catogory" />
                    <span className="mt-1 text-sm">{ item }</span>
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
      
        <button
            type="submit"
            onClick={ (event) => {
              event.preventDefault();
              event.currentTarget.disabled = true;
              // offline data saving !
              addNewTransaction(newtransaction as any)
              router.push("/dashboard"); 
            }} className="text-green-600 mt-8 mx-auto py-3 px-6 font-bold bg-green-200 rounded-md hover:bg-green-400 hover:text-green-50">Save</button>

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