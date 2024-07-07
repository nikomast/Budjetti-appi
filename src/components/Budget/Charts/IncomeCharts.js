import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const IncomeExpenseChart = ({ budget, incomes }) => {
  const prepareBarChartData = (budget, incomes) => {
    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpenses = Object.keys(budget).reduce((acc, category) => {
      return acc + budget[category].reduce((acc, expense) => acc + expense.cost, 0);
    }, 0);
    const remainingIncome = totalIncome - totalExpenses;

    return {
      labels: ['Income', 'Expenses', 'Remaining Income'],
      datasets: [
        {
          label: 'Amount',
          data: [totalIncome, totalExpenses, remainingIncome],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="chart-container">
      <Bar
        data={prepareBarChartData(budget, incomes)}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Income vs Expenses'
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: $${tooltipItem.raw}`;
                }
              }
            }
          },
          maintainAspectRatio: false
        }}
        height={400}
      />
    </div>
  );
};

export default IncomeExpenseChart;
