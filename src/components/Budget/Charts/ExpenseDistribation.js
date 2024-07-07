import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const ExpenseDistributionChart = ({ budget }) => {
  const preparePieChartData = (budget) => {
    const labels = Object.keys(budget);
    const data = labels.map(category => budget[category].reduce((acc, expense) => acc + expense.cost, 0));
    const totalExpenses = data.reduce((acc, value) => acc + value, 0);

    return {
      labels: labels.map((label, index) => `${formatCategoryName(label)} (${((data[index] / totalExpenses) * 100).toFixed(2)}%)`),
      datasets: [
        {
          label: 'Expenses',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const formatCategoryName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="chart-container">
      <Pie
        data={preparePieChartData(budget)}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Expenses consist of'
            },
            legend: {
                display: false,
              },
          },
          maintainAspectRatio: false
        }}
        height={400}
      />
    </div>
  );

};

export default ExpenseDistributionChart;
