import Chart from 'chart.js/auto';

export type ChartTypeOption = 'doughnut' | 'pie' | 'bar' | 'line';

export default function PlotPieChart(
    ctx: any, 
    chartfor: string, 
    chartname: string, 
    chartlabels: Array<string>, 
    data: Array<number>, 
    isDark: boolean = false,
    currencySymbol: string = '₹',
    currencyLocale: string = 'en-IN',
    chartType: ChartTypeOption = 'doughnut'
) {
    const existingChart = Chart.getChart(ctx);
    if (existingChart !== undefined) {
        existingChart.destroy();
    }

    const bgColors = [
        'rgba(99, 102, 241, 0.8)',  // Indigo
        'rgba(16, 185, 129, 0.8)',  // Emerald
        'rgba(244, 63, 94, 0.8)',   // Rose
        'rgba(245, 158, 11, 0.8)',  // Amber
        'rgba(14, 165, 233, 0.8)',  // Sky
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(20, 184, 166, 0.8)',  // Teal
        'rgba(249, 115, 22, 0.8)',  // Orange
        'rgba(100, 116, 139, 0.8)', // Slate
    ];

    const borderColors = bgColors.map(c => c.replace('0.8', '1'));
    const textColor = isDark ? '#e2e8f0' : '#1e293b';

    const isCartesian = chartType === 'bar' || chartType === 'line';

    const mainColor = chartfor.toLowerCase().includes('income') 
        ? '#10b981' 
        : chartfor.toLowerCase().includes('expense') 
        ? '#f43f5e' 
        : '#6366f1';
    
    const mainBgColor = chartfor.toLowerCase().includes('income') 
        ? 'rgba(16, 185, 129, 0.18)' 
        : chartfor.toLowerCase().includes('expense') 
        ? 'rgba(244, 63, 94, 0.18)' 
        : 'rgba(99, 102, 241, 0.18)';

    let dataset: any;

    if (chartType === 'line') {
        dataset = {
            label: `Amount (${currencySymbol.trim()})`,
            data: data,
            borderColor: mainColor,
            backgroundColor: mainBgColor,
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: mainColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            pointRadius: 4.5,
            pointHoverRadius: 6.5,
        };
    } else if (chartType === 'bar') {
        dataset = {
            label: `Amount (${currencySymbol.trim()})`,
            data: data,
            backgroundColor: bgColors.slice(0, data.length),
            borderColor: borderColors.slice(0, data.length),
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
        };
    } else {
        // Doughnut / Pie
        dataset = {
            label: `Amount (${currencySymbol.trim()})`,
            data: data,
            backgroundColor: bgColors.slice(0, data.length),
            borderColor: borderColors.slice(0, data.length),
            borderWidth: 1,
            hoverOffset: 6,
        };
    }

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 400,
        },
        plugins: {
            legend: {
                display: !isCartesian,
                position: 'bottom',
                labels: {
                    color: textColor,
                    padding: 12,
                    boxWidth: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: { family: 'inherit', size: 11, weight: 500 }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#f8fafc' : '#0f172a',
                bodyColor: isDark ? '#cbd5e1' : '#334155',
                borderColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
                cornerRadius: 12,
                callbacks: {
                    label: function(context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null && context.parsed !== undefined) {
                            const val = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            label += currencySymbol.trim() + ' ' + Number(val).toLocaleString(currencyLocale);
                        }
                        return label;
                    }
                }
            }
        },
    };

    if (isCartesian) {
        options.scales = {
            x: {
                grid: { display: false },
                ticks: {
                    color: textColor,
                    font: { family: 'inherit', size: 11, weight: 500 }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                },
                ticks: {
                    color: textColor,
                    font: { family: 'inherit', size: 10 },
                    callback: function(val: any) {
                        return currencySymbol.trim() + ' ' + Number(val).toLocaleString(currencyLocale);
                    }
                }
            }
        };
    }

    if (chartType === 'doughnut') {
        options.cutout = '65%';
    }

    const chartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartlabels,
            datasets: [dataset],
        },
        options: options,
    });

    return chartInstance;
}