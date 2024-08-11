"use client"

import Image from "next/image";
import styles from "./settings.module.css";
import SettingsIcon from "@/assets/settings.png";
import { useState } from "react";

export default function Settings() {

    const [darkmode, setDarkmode] = useState<boolean>(false);

    return (
        <div className="flex items-center justify-center flex-col w-full h-full">
            <h1 className="font-bold text-xl capitalize">Settings Page</h1>
            <br />
            <span>coming soon..</span>
            <Image src={SettingsIcon} width={30} height={30} alt="settings icon" className={styles.animatedSettingsIcon} />
            
            {/* <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" onClick={ () => { setDarkmode(!darkmode); console.log(darkmode) }} />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">Dark Mode</span>
            </label> */}
        </div>
    )
}