import Image from "next/image";
import styles from "./recentTransCard.module.css";
// ICONS
import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import MoviesIcon from "@/assets/entertainmenticon.png";
import MedicineIcon from "@/assets/medicine.png";
import HaircutIcon from "@/assets/haircut.png";
import SalaryIcon from "@/assets/salary.png";

import OthersIcon from "@/assets/others.png";

export default function RecentTransCard({ amount, catogory, type}: { amount: Number, catogory: String, type: String}) {

    const iconsheat: any = {
        'travel': TravelIcon,
        'food': FoodIcon,
        'movies': MoviesIcon,
        'medicine': MedicineIcon,
        'haircut': HaircutIcon,
        'salary': SalaryIcon,
    }


    return (
        <div className={styles.recentexpense_card}>
            <div className="flex px-1 items-center justify-evenly">
                { catogory === 'no transactions yet' ? false : <Image src={(Object.hasOwn(iconsheat, `${catogory}`)) ? iconsheat[`${catogory}`] : OthersIcon} width={26} height={26} alt="travel icon" />}
                <span className={`px-3 ${ catogory === 'no transactions yet' ? 'text-sm font-light text-gray-500' : 'font-semibold capitalize' }`}>{ catogory || 'Transaction' }</span>
            </div>
            <span className={`${ type === 'income' ? 'text-green-500' : 'text-red-500' } font-bold`}>{ `₹ ${ amount }` }</span>
        </div>
    )
}