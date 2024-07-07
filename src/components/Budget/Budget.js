import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import "../../css/Budget/Budget.css";
import AddExpense from './AddExpense';
import AddIncome from './AddIncome';
import Incomes from './Incomes';
import ExpenseDistributionChart from './Charts/ExpenseDistribation';
import IncomeExpenseChart from './Charts/IncomeCharts';
import IncomeDistributionChart from './Charts/IncomeDistribution';

const Budget = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState({});
  const [incomes, setIncomes] = useState([]);
  const [loans, setLoans] = useState([]);
  const [totalLoanPayments, setTotalLoanPayments] = useState(0);

  const fetchCategories = async () => {
    setCategories(["livingCosts", "travelCosts", "fixedCosts", "otherCosts"]);
  };

  const fetchBudget = async () => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const budgetData = {};

        for (const category of categories) {
          const budgetRef = collection(db, 'users', uid, 'expenditure', category, 'expenses');
          const querySnapshot = await getDocs(budgetRef);

          budgetData[category] = [];
          querySnapshot.forEach((doc) => {
            budgetData[category].push({ id: doc.id, ...doc.data() });
          });
        }

        setBudget(budgetData);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const incomesRef = collection(db, 'users', uid, 'incomes');
        const querySnapshot = await getDocs(incomesRef);

        const incomeData = [];
        querySnapshot.forEach((doc) => {
          incomeData.push({ id: doc.id, ...doc.data() });
        });

        setIncomes(incomeData);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const loansRef = collection(db, 'users', uid, 'loan');
        const querySnapshot = await getDocs(loansRef);

        const loansData = [];
        let totalPayments = 0;
        querySnapshot.forEach((doc) => {
          const loan = { id: doc.id, ...doc.data() };
          loansData.push(loan);
          totalPayments += loan.payment;
        });

        setLoans(loansData);
        setTotalLoanPayments(totalPayments);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleDeleteExpense = async (categoryId, expenseId) => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const expenseRef = doc(db, 'users', uid, 'expenditure', categoryId, 'expenses', expenseId);
        await deleteDoc(expenseRef);
        fetchBudget();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchIncomes();
    fetchLoans();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchBudget();
    }
  }, [currentUser, categories]);

  const formatCategoryName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const loanCategory = 'Loan Payments';

  return (
    <div className="main-container">
      <main className="main-content">
      <div className="IvsE">
        <h3>Overview of Income's and Expense's</h3>
        <IncomeExpenseChart budget={{...budget, loanPayments: [{ cost: totalLoanPayments }]}} incomes={incomes} />
      </div>
        <section className="income-section">
          <h2>Your Incomes</h2>
          <Incomes />
          <AddIncome onIncomeAdded={fetchBudget} />
        </section>
        <section className="budget-section">
          <h2>Your Expenses</h2>
          <div className="chart-section">
            <h3>Expense Overview</h3>
            <ExpenseDistributionChart budget={{...budget, loanPayments: [{ cost: totalLoanPayments }]}} />
        </div>
          <div className="budget-summary">
            {categories.map(category => (
              <div key={category} className="category-section">
                <h3>{formatCategoryName(category)}</h3>
                <ul>
                  {budget[category] && budget[category].map(expense => (
                    <li key={expense.id} className="expense-item">
                      {expense.name}: ${expense.cost}
                      <button className="delete-button" onClick={() => handleDeleteExpense(category, expense.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {loans.length > 0 && (
              <div className="category-section">
                <h3>{formatCategoryName(loanCategory)}</h3>
                <ul>
                  <li className="expense-item">
                    Total Loan Payments: ${totalLoanPayments}
                  </li>
                </ul>
              </div>
            )}
          </div>
          <AddExpense onExpenseAdded={fetchBudget} />
        <div className="chart-section">
            <h3>Income Distribution</h3>
            <IncomeDistributionChart budget={{...budget, loanPayments: [{ cost: totalLoanPayments }]}} incomes={incomes} />
        </div>
        </section>
      </main>
    </div>
  );
};

export default Budget;
