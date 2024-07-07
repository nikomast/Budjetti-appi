import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const MonthlyExpensesChart = ({ monthlyExpenses }) => {
  const chartData = {
    labels: monthlyExpenses.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Total Monthly Expenses',
        data: monthlyExpenses,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
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
          text: 'Expenses'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Total Monthly Expenses'
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

export default MonthlyExpensesChart;
