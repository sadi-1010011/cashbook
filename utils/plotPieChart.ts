import Chart from 'chart.js/auto';

export default function PlotPieChart(ctx: any, chartfor: string, chartname: string, chartlabels: Array<string>, data: Array<number>) {

    let chartStatus1 = Chart.getChart(chartfor);
          if (chartStatus1 != undefined) {
            chartStatus1.destroy();
        }
    
        const incomechart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: chartlabels,
            datasets: [
              {
                label: chartname,
                data: data,
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
                text: chartname,
              },
            },
          },
        });
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