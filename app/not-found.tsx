import Link from "next/link";
import { QuestionMarkCircleIcon, HomeIcon } from "@/components/icons";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5f5] dark:bg-slate-950 text-black dark:text-white px-4 py-12 transition-colors duration-200">
            <div className="w-full max-w-md flex flex-col items-center text-center p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-lg animate-fade-in-up">
                {/* 404 Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center mb-5 shadow-xs">
                    <QuestionMarkCircleIcon className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    404 Error
                </span>
                
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                    Page Not Found
                </h1>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8 leading-relaxed">
                    The page you are looking for does not exist or may have been moved. Your local financial records remain completely safe.
                </p>

                {/* Navigation Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link
                        href="/dashboard"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                    </Link>
                    <Link
                        href="/history"
                        className="inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                        View History
                    </Link>
                </div>
            </div>
        </div>
    );
}
