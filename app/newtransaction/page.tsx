import Header from "@/components/header/header";
import styles from "./newtransaction.module.css";
import Link from "next/link";

export default function NewTransaction() {
  return (
    <div className={styles.newtrans_container}>
      <Header />

      <div className={styles.newamount_card}>
        <div className="w-full flex">
          <div className={styles.currenttab_viewerwrapper}>
            <div className={styles.active_tab}>Expense</div>
            <div>Income</div>
          </div>
        </div>

        <input
          className={styles.newinputamt}
          type="number"
          placeholder="$ Amount.."
        />

        <div className={styles.trans_catogorywrapper}>
          <h3 className="capitalize text-lg font-bold">expenses made for</h3>
          <div className={styles.selectcatogory}>
            <div>Food</div>
            <div>Travel</div>
            <div>Entertains</div>
            <div>Haircut</div>
            <div>Medicine</div>
            <div>other</div>
          </div>
        </div>

        <div>
          <h3 className="capitalize text-lg font-bold px-4">Description</h3>
          <textarea
            className={styles.newdescription}
            placeholder="descripion.."
          ></textarea>
        </div>
      </div>

      <Link href="/dashboard">
        <button className="text-green-600 py-5 font-bold">Save</button>
      </Link>
    </div>
  );
}
