import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const FinalLoanCostsChart = ({ loanData }) => {
  const chartData = {
    labels: loanData.map((loan) => loan.name),
    datasets: [
      {
        label: 'Cost',
        data: loanData.map((loan) => loan.price),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Loans'
        }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Final Loan Costs'
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartOptions} height={400} />
    </div>
  );
};

export default FinalLoanCostsChart;
