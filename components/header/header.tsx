import Link from "next/link";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
    return (
        <header className={styles.common_header}>
            <Link href="/" className={`${styles.applogo} font-extrabold uppercase`}>kaayi</Link>
            <Link href="/"><Image src={Logo} alt="logo" width="30" height="30" /></Link>
        </header>
    )
}