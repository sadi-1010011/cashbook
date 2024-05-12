"use client"

import { useState } from "react";
import styles from "./mishaltoggle.module.css";

export default function MishalToggle({ active = "daily" }) {

    // default sort == daily
    const [activetab, setActivetab] = useState(active ? active : "daily");
    const availableMishalToggles = ["daily", "weekly", "monthly"];
    let mishtoggle: String;

    return (
        <div className="flex">
        <div className={styles.custom_viewerwrapper}>
            {
                availableMishalToggles.map( mishaltoggle => 
                    <div
                        key={mishaltoggle}
                        className={ mishaltoggle === activetab ? styles.active_tab : styles.normal_tab }
                        onClick={ event => {
                            mishtoggle = String(event.currentTarget.textContent);
                            setActivetab(mishtoggle as any); // any type
                        } }>
                            { mishaltoggle }
                    </div>
                )
            }
        </div>
    </div>
    )
}