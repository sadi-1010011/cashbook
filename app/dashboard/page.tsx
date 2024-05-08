import Header from "@/components/header/header"
import Footer from "@/components/footer/footer"
import styles from './dashboard.module.css';
import Image from "next/image";
import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import EntertainmentIcon from "@/assets/entertainmenticon.png";

export default function Dashboard() {
    return (
        <>
        <Header />
        <div className={styles.page_container}>
            <div className={`${styles.balance_card}`}>
                <h1 className="text-white"> $ 16,800</h1>
                <span className={`${styles.balance_inr} text-white`}>INR</span>
            </div>

            <div className={`${styles.recentexpenses_container} text-black capitalize`}>
                <h2 className="capitalize text-black px-2 py-2 font-bold text-xl text-center">Recent expenses</h2>
                
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={TravelIcon} width={30} height={30} alt="travel icon" />
                        <span className="font-semibold px-3">Travel</span>
                    </div>
                    <span className="font-bold text-red-500">$160</span>
                </div>
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={FoodIcon} width={30} height={30} alt="food icon" />
                        <span className="font-semibold px-3">Food</span>
                    </div>
                    <span className="font-bold text-red-500">$30</span>
                </div>
                <div className={styles.recentexpense_card}>
                    <div className="flex px-1 items-center justify-evenly">
                        <Image src={EntertainmentIcon} width={30} height={30} alt="Entertainment icon" />
                        <span className="font-semibold px-3">Entertainment</span>
                    </div>
                    <span className="font-bold">$0</span>
                </div>
            </div>

        </div>
        <Footer />
        </>
    )
}