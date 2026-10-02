'use client'
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/assets/logo.png";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Head from "next/head";
import { dbService } from "@/services/db";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // init db
    dbService.initDefaultDB();
  
  setTimeout(function() {
    router.push('/dashboard');
  }, 2500)

},[]);
  
  return (
    <>
      <Head>
        <title>CashBook</title>
        <meta name="description" content="personal finance management app" />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
        <Link rel="icon" href='/favicon.ico' />
        <Link rel="manifest" href='/manifest.json' />
      </Head>
      <main className="mainpage">
          <div className="fullscreenimg">
            <Link href="/dashboard">
                <Image priority={true} id="brandlogo" src={BrandLogo} width={120} height={120} alt="brand logo" className="dark:invert" />
            </Link>
          </div>
      </main>
      </>
  )
}