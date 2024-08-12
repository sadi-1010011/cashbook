'use client'
import Link from "next/link";
import './styles/styles.css';
import Image from "next/image";
import BrandLogo from "@/assets/logo.png";
import { useRouter } from "next/navigation";
import Localbase from "localbase";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {

    
    function initDefaultDB(collectionName: string) {
      console.log('creating new db!');
      let db = new Localbase('kaayidb'); // create db
      db.collection(collectionName).get().then((data: any) => {
        if (data.length === 0) {
          console.log(`db created successfuly! with ${collectionName}`);
        } else {
          console.log('unable to create db!')
        }
      });
    }

    // init db
    initDefaultDB('alltransactions');
  
  setTimeout(function() {
    router.push('/dashboard');
  }, 2500)

},[]);
  
  return (
      <main className="mainpage">
          <div className="fullscreenimg">
            <Link href="/dashboard">
                <Image priority={true} id="brandlogo" src={BrandLogo} width={120} height={120} alt="brand logo" />
            </Link>
          </div>
      </main>
  )
}