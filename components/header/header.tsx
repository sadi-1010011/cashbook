import Link from "next/link";
import SettingsIcon from "@/assets/settings.png";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full px-8 py-4 mx-auto bg-white dark:bg-slate-950 text-black dark:text-white transition-colors duration-200">
            <Link href="/" className="font-extrabold uppercase text-[1.2rem] tracking-wider py-1">kaayi</Link>
            <Link href="/settings"><Image src={SettingsIcon} alt="settings" width="24" height="24" className="dark:invert" /></Link>
        </header>
    )
}