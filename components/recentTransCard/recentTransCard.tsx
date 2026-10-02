import Image from "next/image";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "@/constants";

export default function RecentTransCard({ amount, catogory, type, description }: { amount: Number, catogory: String, type: String, description?: String }) {

    return (
        <div className="flex items-center justify-between w-[85%] mx-auto my-5 px-7 py-7 cursor-pointer rounded-lg border border-gray-200 dark:border-slate-800 bg-[#f1f1f1] dark:bg-slate-900 text-black dark:text-white shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)] transition-colors duration-200">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                { catogory !== 'no transactions yet' && <Image src={CATEGORY_ICONS[catogory as string] || DEFAULT_CATEGORY_ICON} width={26} height={26} alt={`${catogory} icon`} className="dark:invert shrink-0" />}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className={`${ catogory === 'no transactions yet' ? 'text-sm font-light text-gray-500' : 'font-semibold capitalize' } truncate`}>{ catogory || 'Transaction' }</span>
                    {description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{description}</span>
                    )}
                </div>
            </div>
            <span className={`${ type === 'income' ? 'text-green-500' : 'text-red-500' } font-bold`}>{ `₹ ${ amount }` }</span>
        </div>
    )
}