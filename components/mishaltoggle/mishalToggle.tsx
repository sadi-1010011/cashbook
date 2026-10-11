"use client"

import { useState } from "react";

export default function MishalToggle({ active = "daily" }: { active?: string }) {
    const [activetab, setActivetab] = useState(active ? active : "daily");
    const availableMishalToggles = ["daily", "weekly", "monthly"];

    return (
        <div className="flex w-full justify-center">
            <div className="inline-flex items-center justify-center w-full max-w-xs mx-auto p-1 rounded-2xl bg-gray-200/50 dark:bg-slate-800">
                {availableMishalToggles.map(mishaltoggle => (
                    <button
                        key={mishaltoggle}
                        type="button"
                        className={`px-4 py-2.5 mx-0.5 text-center capitalize text-sm font-bold w-full rounded-xl cursor-pointer transition-all duration-200 active:scale-95 ${
                            mishaltoggle === activetab 
                                ? 'text-white bg-black dark:text-black dark:bg-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                        }`}
                        onClick={() => setActivetab(mishaltoggle)}
                    >
                        {mishaltoggle}
                    </button>
                ))}
            </div>
        </div>
    );
}