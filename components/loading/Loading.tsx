export interface LoadingProps {
    count?: number;
    showHeader?: boolean;
    fullPage?: boolean;
    type?: 'cards' | 'stats';
    className?: string;
}

export default function Loading({
    count = 4,
    showHeader = true,
    fullPage = true,
    type = 'cards',
    className = "",
}: LoadingProps) {
    const statsSkeleton = (
        <div className={`w-full flex flex-col gap-4 ${className}`}>
            {/* Expense Breakdown Skeleton Card */}
            <div className="w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 animate-pulse flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-slate-800" />
                    <div className="h-7 w-24 rounded-2xl bg-gray-200/70 dark:bg-slate-800/70" />
                </div>
                <div className="h-60 w-full flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full border-[16px] border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50" />
                </div>
            </div>

            {/* Income Breakdown Skeleton Card */}
            <div className="w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 animate-pulse flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded-md bg-gray-200 dark:bg-slate-800" />
                    <div className="h-7 w-24 rounded-2xl bg-gray-200/70 dark:bg-slate-800/70" />
                </div>
                <div className="h-60 w-full flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full border-[16px] border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50" />
                </div>
            </div>

            {/* Summary Pills Skeleton */}
            <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="h-24 rounded-3xl bg-gray-200/50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 animate-pulse" />
                <div className="h-24 rounded-3xl bg-gray-200/50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 animate-pulse" />
            </div>
        </div>
    );

    const cardsSkeleton = (
        <div className={`w-full flex flex-col gap-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm animate-pulse flex flex-col gap-3"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Icon skeleton */}
                            <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-slate-800 shrink-0" />
                            {/* Title / Category & date skeleton */}
                            <div className="flex flex-col gap-1.5">
                                <div className="h-4 w-28 rounded-md bg-gray-200 dark:bg-slate-800" />
                                <div className="h-3 w-16 rounded-md bg-gray-200/70 dark:bg-slate-800/70" />
                            </div>
                        </div>
                        {/* Amount badge skeleton */}
                        <div className="h-5 w-20 rounded-lg bg-gray-200 dark:bg-slate-800" />
                    </div>

                    {/* Bottom divider & tools skeleton */}
                    <div className="pt-2 border-t border-gray-50 dark:border-slate-800/60 flex items-center justify-between">
                        <div className="w-4 h-4 rounded-md bg-gray-200/60 dark:bg-slate-800/60" />
                        <div className="h-2.5 w-24 rounded bg-gray-200/60 dark:bg-slate-800/60" />
                        <div className="w-4 h-4 rounded-md bg-gray-200/60 dark:bg-slate-800/60" />
                    </div>
                </div>
            ))}
        </div>
    );

    if (!fullPage) {
        return type === 'stats' ? statsSkeleton : cardsSkeleton;
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#f6f5f5] dark:bg-slate-950 transition-colors duration-200">
            {showHeader && (
                <div className="w-[90%] max-w-md mx-auto pt-6 pb-2">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-slate-800" />
                            <div className="h-6 w-32 rounded-xl bg-gray-200 dark:bg-slate-800" />
                        </div>
                        <div className="w-16 h-7 rounded-xl bg-gray-200 dark:bg-slate-800" />
                    </div>

                    {/* Filter / Toggle pill skeleton */}
                    <div className="mt-5 h-11 w-full rounded-2xl bg-gray-200/80 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 animate-pulse" />
                </div>
            )}

            <main className="w-[90%] max-w-md mx-auto flex flex-col gap-3 mt-3 pb-24">
                {type === 'stats' ? statsSkeleton : cardsSkeleton}
            </main>
        </div>
    );
}