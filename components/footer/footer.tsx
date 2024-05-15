import Link from "next/link";
import Logo from "@/assets/logo.png";
import SettingsLogo from "@/assets/settings.png";
import NewLogo from "@/assets/new.png";
import StatsIcon from "@/assets/statsicon.png";
import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.common_footer}>
            <Link href="/settings"><Image src={SettingsLogo} alt="logo" width="25" height="25" /></Link>
            <Link href="/newtransaction"><Image src={NewLogo} alt="logo" width="40" height="40" /></Link>
            <Link href="/stats"><Image src={StatsIcon} alt="logo" width="25" height="25" /></Link>
        </footer>
    );
}