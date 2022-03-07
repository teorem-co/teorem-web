import xAxisLabels from './xAxisLabels';

const earningsGraphOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'circle',
            },
        },
        title: {
            display: false,
        },
    },
    elements: {
        line: {
            tension: 0.3,
        },
        point: {
            radius: 0,
            hoverRadius: 4,
            hitRadius: 8,
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgb(240,240,240)',
                borderColor: 'rgb(240,240,240)',
                drawTicks: true,
                tickColor: 'transparent',
                tickLength: 16,
            },
            ticks: {
                callback: (item: string | number, index: number) => {
                    if (!(index % 2)) {
                        return xAxisLabels[index];
                    }
                },
                autoSkip: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgb(240,240,240)',
                borderColor: 'rgb(240,240,240)',
                drawTicks: true,
                tickColor: 'transparent',
                tickLength: 16,
            },
            ticks: {
                maxTicksLimit: 5,
            },
        },
    },
};

export default earningsGraphOptions;
