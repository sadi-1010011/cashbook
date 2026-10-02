import Chart from 'chart.js/auto';

export default function PlotPieChart(ctx: any, chartfor: string, chartname: string, chartlabels: Array<string>, data: Array<number>, isDark: boolean = false) {

    let chartStatus1 = Chart.getChart(ctx);
          if (chartStatus1 != undefined) {
            chartStatus1.destroy();
        }
    
        const bgColors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 102, 255, 0.7)',
            'rgba(255, 99, 255, 0.7)',
            'rgba(54, 255, 235, 0.7)',
        ];

        const borderColors = bgColors.map(c => c.replace('0.7', '1'));
        const textColor = isDark ? '#e2e8f0' : '#1e293b'; // slate-200 or slate-800

        const incomechart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: chartlabels,
            datasets: [
              {
                label: 'Amount (₹)',
                data: data,
                backgroundColor: bgColors.slice(0, data.length),
                borderColor: borderColors.slice(0, data.length),
                borderWidth: 1,
                hoverOffset: 4
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                    color: textColor,
                    padding: 15,
                    font: { family: 'inherit', size: 12 }
                }
              },
              title: {
                display: true,
                text: chartname,
                color: textColor,
                font: { family: 'inherit', size: 16, weight: 'bold' },
                padding: { bottom: 15 }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        label += '₹ ' + context.parsed.toLocaleString();
                    }
                    return label;
                  }
                }
              }
            },
          },
        });

        return incomechart;
}










 /* 

    // OLD MODEL CHART
    
        let chartStatus1 = Chart.getChart('incomechart');
          if (chartStatus1 != undefined) {
            chartStatus1.destroy();
        }
    
        const incomechart = new Chart(ctx1, {
          type: 'pie',
          data: {
            labels: ['sallary', 'tip', 'others'],
            datasets: [
              {
                label: 'Income',
                data: [salaryIncomePercent/3, tipIncomePercent/3, othersIncomePercent/3,],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Income',
              },
            },
          },
        });
        */