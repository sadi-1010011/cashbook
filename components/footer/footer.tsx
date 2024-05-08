import Link from "next/link";
import Logo from "@/assets/logo.png";
import OptionsLogo from "@/assets/options.png";
import NewLogo from "@/assets/new.png";
import SettingsLogo from "@/assets/settings.png";
import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.common_footer}>
            <Link href="/"><Image src={OptionsLogo} alt="logo" width="30" height="30" /></Link>
            <Link href="/newtransaction"><Image src={NewLogo} alt="logo" width="30" height="30" /></Link>
            <Link href="/"><Image src={SettingsLogo} alt="logo" width="30" height="30" /></Link>
        </footer>
    )
}