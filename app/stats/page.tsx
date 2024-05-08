import Header from "@/components/header/header";
import GraphIcon from "@/assets/statsicon.png";
import Image from "next/image";

export default function Stats() {
    return (
        <div className="container w-full">
            <Header />
            <div className="flex w-10/12 bg-white my-4 mx-auto rounded-xl">
                <Image src={GraphIcon} alt="graph image"/>
            </div>
        </div>
    )
}