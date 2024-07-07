import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BudgetChart = ({ budget }) => {
  const expenseCategories = Object.keys(budget);
  const expenseData = expenseCategories.map(category => 
    budget[category].reduce((total, expense) => total + expense.cost, 0)
  );

  const incomeTotal = 1000; // Replace with dynamic income total
  const expenseTotal = expenseData.reduce((total, amount) => total + amount, 0);

  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [incomeTotal, expenseTotal],
      backgroundColor: ['#36A2EB', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384']
    }]
  };

  const barData = {
    labels: expenseCategories.map(category => category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
    datasets: [{
      label: 'Expenses',
      data: expenseData,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div>
      <h3>Budget Overview</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h4>Income vs Expenses</h4>
          <Pie data={pieData} />
        </div>
        <div style={{ width: '45%', marginBottom: '20px' }}>
          <h4>Expenses by Category</h4>
          <Bar data={barData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
