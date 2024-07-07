import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const MonthlyBalancesChart = ({ monthlyAmount }) => {
  const chartData = {
    labels: monthlyAmount.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Total Monthly Loan Balances',
        data: monthlyAmount,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Months'
        }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Balance'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Total Monthly Loan Balances'
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} height={400} />
    </div>
  );
};

export default MonthlyBalancesChart;
