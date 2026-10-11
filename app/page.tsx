'use client'
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/assets/logo.png";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dbService } from "@/services/db";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // init db
    dbService.initDefaultDB();
  
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <main className="mainpage">
      <div className="fullscreenimg">
        <Link href="/dashboard">
          <Image priority={true} id="brandlogo" src={BrandLogo} width={120} height={120} alt="brand logo" className="dark:invert" />
        </Link>
      </div>
    </main>
  );
}