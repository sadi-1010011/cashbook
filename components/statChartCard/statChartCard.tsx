"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useTheme } from "next-themes";
import { useCurrencyStore } from "@/store/currencyStore";
import PlotPieChart, { ChartTypeOption } from "@/utils/plotPieChart";
import { DonutChartIcon, BarChartIcon, LineChartIcon } from "@/components/icons";

export interface StatChartCardProps {
    title: string;
    chartId: string;
    categories: Record<string, number>;
    total: number;
    emptyIcon?: string;
    emptyMessage: string;
    initialChartType?: ChartTypeOption;
    className?: string;
}

export function ChartTypeSwitcher({
    currentType,
    onChange,
}: {
    currentType: ChartTypeOption;
    onChange: (type: ChartTypeOption) => void;
}) {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl border border-gray-200/50 dark:border-slate-700/50">
            <button
                type="button"
                onClick={() => onChange("doughnut")}
                aria-label="Donut Chart"
                title="Donut Chart"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === "doughnut"
                        ? "bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
                <DonutChartIcon className="w-[15px] h-[15px]" strokeWidth={2.2} />
            </button>
            <button
                type="button"
                onClick={() => onChange("bar")}
                aria-label="Bar Graph"
                title="Bar Graph"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === "bar"
                        ? "bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
                <BarChartIcon className="w-[15px] h-[15px]" strokeWidth={2.2} />
            </button>
            <button
                type="button"
                onClick={() => onChange("line")}
                aria-label="Line Chart"
                title="Line Chart"
                className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer ${
                    currentType === "line"
                        ? "bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs"
                        : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
                <LineChartIcon className="w-[15px] h-[15px]" strokeWidth={2.2} />
            </button>
        </div>
    );
}

export default function StatChartCard({
    title,
    chartId,
    categories,
    total,
    emptyIcon = "📊",
    emptyMessage,
    initialChartType = "doughnut",
    className = "",
}: StatChartCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chartType, setChartType] = useState<ChartTypeOption>(initialChartType);
    const { resolvedTheme } = useTheme();
    const { currencyInfo, convert, currentCurrency } = useCurrencyStore();

    useEffect(() => {
        if (!canvasRef.current || total <= 0) return;

        const isDark = resolvedTheme === "dark";
        let chartInstance: Chart | undefined;

        chartInstance = PlotPieChart(
            canvasRef.current,
            chartId,
            title,
            Object.keys(categories),
            Object.values(categories).map((v) => convert(v)),
            isDark,
            currencyInfo.symbol,
            currencyInfo.locale,
            chartType
        );

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [total, categories, resolvedTheme, currencyInfo, convert, currentCurrency, chartType, chartId, title]);

    if (total <= 0) {
        return (
            <div className={`flex flex-col items-center justify-center w-full h-44 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200 ${className}`}>
                <span className="text-gray-400 dark:text-slate-500 mb-2 text-2xl">{emptyIcon}</span>
                <p className="text-[14px] text-gray-500 dark:text-slate-400 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col w-full p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all duration-200 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-100">{title}</h3>
                <ChartTypeSwitcher currentType={chartType} onChange={setChartType} />
            </div>
            <div className="h-60 w-full flex items-center justify-center">
                <canvas id={chartId} className="m-auto" ref={canvasRef} />
            </div>
        </div>
    );
}
