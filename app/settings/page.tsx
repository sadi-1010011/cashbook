"use client"

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import Header from "@/components/header/header";

export default function Settings() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { transactions, deleteAllTransactions, setAllTransactions } = useTransactionStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleWipeData = async () => {
        if (confirm("Are you sure you want to wipe all your data? This action cannot be undone.")) {
            await deleteAllTransactions();
            alert("Data wiped successfully.");
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'cashbook-backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    if (confirm("This will overwrite your existing data. Proceed?")) {
                        await setAllTransactions(parsed);
                        alert("Data imported successfully.");
                    }
                } else {
                    alert("Invalid backup file format.");
                }
            } catch (error) {
                console.error("Failed to parse JSON", error);
                alert("Failed to read the backup file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col h-screen bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200 animate-fade-in">
            <Header />
            <div className="flex flex-col items-center overflow-y-auto flex-1 w-full pt-4 pb-28">
                <div className="w-[85%] mx-auto flex flex-col gap-6 mt-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between w-full mx-auto py-8 px-8 bg-[#121212e2] text-white rounded-[22px] backdrop-blur-sm shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
                        <h1 className="font-bold text-2xl flex items-center">
                            Settings
                        </h1>
                    </div>

                    <div className="flex flex-col gap-4 w-full mt-2">
                        {/* Dark Mode */}
                        <div className="flex items-center justify-between w-full bg-[#f1f1f1] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)] transition-colors duration-200">
                            <div>
                                <h3 className="font-semibold text-lg text-black dark:text-white">Dark Mode</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode theme</p>
                            </div>
                            {mounted && (
                                <label className="inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={resolvedTheme === 'dark'}
                                        onChange={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>

                        {/* Data Backup */}
                        <div className="flex flex-col gap-3 w-full bg-[#f1f1f1] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)] transition-colors duration-200">
                            <div>
                                <h3 className="font-semibold text-lg text-black dark:text-white">Data Backup</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Export or import your transactions data.</p>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button onClick={handleExport} className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg font-medium hover:opacity-80 transition-opacity shadow-sm">
                                    Export Data
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg font-medium hover:opacity-80 transition-opacity shadow-sm">
                                    Import Data
                                </button>
                                <input 
                                    type="file" 
                                    accept=".json"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImport}
                                />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="flex flex-col gap-3 w-full bg-[#f1f1f1] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)] transition-colors duration-200">
                            <div>
                                <h3 className="font-semibold text-lg text-red-600 dark:text-red-500">Danger Zone</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete all your transactions.</p>
                            </div>
                            <button onClick={handleWipeData} className="w-fit px-4 py-2 mt-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg font-medium hover:opacity-80 transition-opacity shadow-sm">
                                Reset App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}