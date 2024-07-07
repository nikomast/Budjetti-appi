import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const IncomeDistributionChart = ({ budget, incomes }) => {
  const preparePieChartData = (budget, incomes) => {
    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

    const expenseData = Object.keys(budget).map(category => {
      return budget[category].reduce((sum, expense) => sum + expense.cost, 0);
    });

    const totalExpenses = expenseData.reduce((acc, value) => acc + value, 0);
    const remainingIncome = totalIncome - totalExpenses;

    const data = [...expenseData, remainingIncome];
    const labels = [...Object.keys(budget).map(formatCategoryName), 'Remaining Income'];
    const total = data.reduce((acc, value) => acc + value, 0);

    return {
      labels: labels.map((label, index) => `${label} (${((data[index] / total) * 100).toFixed(2)}%)`),
      datasets: [
        {
          label: 'Income Distribution',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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
        data={preparePieChartData(budget, incomes)}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Expenditure share of income'
            },
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        }}
        height={400}
      />
    </div>
  );
};

export default IncomeDistributionChart;
