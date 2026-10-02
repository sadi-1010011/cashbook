"use client"

import Link from "next/link";
import NewLogo from "@/assets/new.png";
import StatsIcon from "@/assets/statsicon.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === '/') return null;

    return (
        <footer className="flex items-center justify-evenly fixed bottom-0 w-full py-5 z-[99] rounded-t-[1.8em] bg-[#f6f5f5]/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 text-black dark:text-white shadow-[0_-4px_10px_-5px_rgba(115,115,115,0.75)] transition-colors duration-200">
            <Link href="/dashboard" className={`p-3 rounded-2xl transition-all duration-300 ${pathname === '/dashboard' ? 'bg-black/10 dark:bg-white/10 shadow-inner backdrop-blur-md scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1"/>
                    <rect width="7" height="5" x="14" y="3" rx="1"/>
                    <rect width="7" height="9" x="14" y="12" rx="1"/>
                    <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
            </Link>
            
            <Link href="/newtransaction" className={`p-1 rounded-full transition-all duration-300 ${pathname === '/newtransaction' ? 'dark:bg-white/10 shadow-inner backdrop-blur-md scale-110 p-1' : 'opacity-80 hover:opacity-100'} shadow-lg transform -translate-y-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800`}>
                <Image src={NewLogo} alt="new transaction" width="40" height="40" className="dark:invert" />
            </Link>
            
            <Link href="/stats" className={`p-3 rounded-2xl transition-all duration-300 ${pathname === '/stats' ? 'bg-black/10 dark:bg-white/10 shadow-inner backdrop-blur-md scale-110' : 'opacity-70 hover:opacity-100'}`}>
                <Image src={StatsIcon} alt="stats" width="25" height="25" className="dark:invert" />
            </Link>
        </footer>
    );
}