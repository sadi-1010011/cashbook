'use client'
import Link from "next/link";
import './styles/styles.css';
import Image from "next/image";
import BrandLogo from "@/assets/logo.png";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter();
  setTimeout(function() {
    router.push('/dashboard');
  }, 2500)

  return (
    <main className="mainpage">
        <div className="fullscreenimg">
          <Link href="/dashboard">
              <Image id="brandlogo" src={BrandLogo} width={120} height={120} alt="brand logo" />
          </Link>
        </div>
    </main>
  )
}