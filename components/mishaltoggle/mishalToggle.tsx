"use client"

import { useState } from "react";

export default function MishalToggle({ active = "daily" }) {

    // default sort == daily
    const [activetab, setActivetab] = useState(active ? active : "daily");
    const availableMishalToggles = ["daily", "weekly", "monthly"];
    let mishtoggle: String;

    return (
        <div className="flex">
        <div className="inline-flex items-center justify-center w-[70%] mx-auto my-2.5 p-0.5 rounded-md">
            {
                availableMishalToggles.map( mishaltoggle => 
                    <div
                        key={mishaltoggle}
                        className={`px-4 py-3.5 mx-px text-center capitalize text-sm font-bold w-full rounded-md cursor-pointer transition-colors duration-200 ${
                            mishaltoggle === activetab 
                                ? 'text-white bg-[#201f1fd2] dark:bg-white dark:text-black' 
                                : 'text-black bg-white dark:text-white dark:bg-slate-900'
                        }`}
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