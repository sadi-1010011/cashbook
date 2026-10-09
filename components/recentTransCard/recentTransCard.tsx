import Image from "next/image";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "@/constants";

export default function RecentTransCard({ amount, catogory, type, description }: { amount: Number, catogory: String, type: String, description?: String }) {

    return (
        <div className="flex items-center justify-between w-full mx-auto p-4 cursor-pointer rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-black dark:text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                { catogory !== 'no transactions yet' && (
                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                        <Image src={CATEGORY_ICONS[catogory as string] || DEFAULT_CATEGORY_ICON} width={22} height={22} alt={`${catogory} icon`} className="dark:invert opacity-80" />
                    </div>
                )}
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <span className={`${ catogory === 'no transactions yet' ? 'text-[13px] font-medium text-gray-400' : 'text-[15px] font-semibold text-gray-800 dark:text-gray-100 capitalize' } truncate`}>{ catogory || 'Transaction' }</span>
                    {description && (
                        <span className="text-[12px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{description}</span>
                    )}
                </div>
            </div>
            <span className={`${ type === 'income' ? 'text-emerald-500' : 'text-rose-500' } font-bold text-[16px]`}>
                { type === 'expense' ? '- ' : '' }₹{ Number(amount).toLocaleString('en-IN') }
            </span>
        </div>
    )
}