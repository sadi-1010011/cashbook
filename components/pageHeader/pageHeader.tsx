import Link from "next/link";
import React from "react";
import { ChevronLeftIcon } from "@/components/icons";

interface PageHeaderProps {
    title: string;
    backHref?: string;
    badge?: React.ReactNode;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

export default function PageHeader({
    title,
    backHref = "/dashboard",
    badge,
    action,
    children,
}: PageHeaderProps) {
    return (
        <div className="sticky top-0 z-10 flex flex-col items-center pt-4 pb-2 bg-[#f6f5f5]/90 dark:bg-slate-950/90 backdrop-blur-md">
            <div className="flex items-center justify-between w-[90%] max-w-md px-1">
                <div className="flex items-center gap-3 min-w-0">
                    {backHref && (
                        <Link 
                            href={backHref}
                            className="w-9 h-9 shrink-0 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                            aria-label="Back"
                        >
                            <ChevronLeftIcon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        </Link>
                    )}
                    <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100 tracking-tight truncate">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {badge && (
                        <span className="px-2.5 py-1 rounded-xl bg-gray-200/60 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
                            {badge}
                        </span>
                    )}
                    {action}
                </div>
            </div>
            {children && (
                <div className="w-[90%] max-w-md px-1 mt-2">
                    {children}
                </div>
            )}
        </div>
    );
}
