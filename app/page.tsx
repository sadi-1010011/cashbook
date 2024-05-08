import Link from "next/link";
import './styles/styles.css';

export default function Home() {
  return (
    <main className="mainpage">
        <div className="fullscreenimg"></div>
        <div className="maintitle-wrapper">
          <h1 className="main-title">Track your <br/>
              Expenses seamlessly..</h1>
          <Link href="/dashboard" className="start-btn text-green-500">start</Link>
        </div>
    </main>
  )
}