import Image from "next/image";
import styles from "./settings.module.css";
import SettingsIcon from "@/assets/settings.png";

export default function Settings() {
    return (
        <div className="flex items-center justify-center flex-col w-full h-full">
            <h1 className="font-bold text-xl capitalize">Settings Page</h1>
            <br />
            <span>coming soon..</span>
            <Image src={SettingsIcon} width={30} height={30} alt="settings icon" className={styles.animatedSettingsIcon} />
        </div>
    )
}