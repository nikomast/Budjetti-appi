import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const LoanRepaymentChart = ({ loanData }) => {
  const chartData = {
    labels: loanData[0].forecast.map((_, i) => i + 1),
    datasets: loanData.map((loan) => ({
      label: loan.name,
      data: loan.forecast,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1
    }))
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
        text: 'Loan Repayment Over Time'
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

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default LoanRepaymentChart;
