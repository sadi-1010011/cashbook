import Image from "next/image";
import styles from "./recentTransCard.module.css";
// ICONS
import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import MoviesIcon from "@/assets/entertainmenticon.png";

export default function RecentTransCard({ amount, catogory, type}: { amount: Number, catogory: String, type: String}) {

    const iconsheat = {
        'travel': TravelIcon,
        'food': FoodIcon,
        'movies': MoviesIcon,
    }


    return (
        <div className={styles.recentexpense_card}>
            <div className="flex px-1 items-center justify-evenly">
                <Image src={(Object.hasOwn(iconsheat, `${catogory}`)) ? iconsheat[`${catogory}`] : TravelIcon} width={30} height={30} alt="travel icon" />
                <span className="font-semibold px-3 capitalize">{ catogory || 'Transaction' }</span>
            </div>
            <span className={`${ type === 'income' ? 'text-green-500' : 'text-red-500' } font-bold`}>{ `$ ${ amount }` }</span>
        </div>
    )
}