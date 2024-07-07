import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import { Chart, registerables } from 'chart.js';
import "../../css/Loans/LoanCalculator.css";
import LoanRepaymentChart from './Charts/LoanRepayment';
import FinalLoanCostsChart from './Charts/FinalLoanCosts';
import MonthlyExpensesChart from './Charts/MonthlyExpenses';
import MonthlyBalancesChart from './Charts/MonthlyBalance';
import { calculateLoanRepayment, calculateAvalancheRepayment } from '../../utils/Calculator';

// Register Chart.js components
Chart.register(...registerables);

const LoanCalculator = () => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loanData, setLoanData] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyAmount, setMonthlyAmount] = useState([]);
  const [notification, setNotification] = useState('');
  const [isOptimized, setIsOptimized] = useState(false);
  const [userBudget, setUserBudget] = useState(''); // State for user-defined budget

  const fetchLoans = async () => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const loansRef = collection(db, 'users', uid, 'loan');
        const q = query(loansRef);
        const querySnapshot = await getDocs(q);

        const loansData = [];
        querySnapshot.forEach((doc) => {
          loansData.push({ id: doc.id, ...doc.data() });
        });

        setLoans(loansData);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const calculateRepayment = () => {
    const result = calculateLoanRepayment(loans);
    setLoanData(result.loans);
    setMonthlyExpenses(result.MonthlyExpenses);
    setMonthlyAmount(result.MonthlyAmount);
    setNotification('');
    setIsOptimized(false);
  };
  const optimizeRepayment = () => {
    if (loanData == null) {
      setNotification('Please calculate the normal repayment rate before optimization.');
    } else {
      // Calculate the sum of all minimum payments
      const totalMinimumPayments = loans.reduce((sum, loan) => sum + loan.payment, 0);
  
      // Initialize budget as the sum of all minimum payments
      let budget = totalMinimumPayments;
  
      // Add user-defined budget if provided
      if (userBudget) {
        budget += Number(userBudget);
      }
  
      const optimizedResult = calculateAvalancheRepayment(loans, budget);
  
      const optimizedMonthlyExpenses = [];
      const optimizedMonthlyAmount = [];
  
      for (let month = 0; month < optimizedResult[0].forecast.length; month++) {
        let monthlyExpense = 0;
        let monthlyAmount = 0;
  
        for (let i = 0; i < optimizedResult.length; i++) {
          if (month < optimizedResult[i].forecast.length) {
            monthlyExpense += optimizedResult[i].minimum;
          }
          if (optimizedResult[i].forecast.length > month) {
            monthlyAmount += optimizedResult[i].forecast[month];
          }
        }
  
        optimizedMonthlyExpenses.push(monthlyExpense);
        optimizedMonthlyAmount.push(monthlyAmount);
      }
  
      // Update each element of optimizedMonthlyExpenses to be equal to budget
      optimizedMonthlyExpenses.forEach((_, i) => {
        optimizedMonthlyExpenses[i] = budget;
      });
  
      setLoanData(optimizedResult);
      setMonthlyExpenses(optimizedMonthlyExpenses);
      setMonthlyAmount(optimizedMonthlyAmount);
      setIsOptimized(true); // Set optimization flag
    }
  };
  

  useEffect(() => {
    fetchLoans();
  }, [currentUser]);

  useEffect(() => {
    if (loans.length > 0) {
      calculateRepayment();
    }
  }, [loans]);

  return (
    <div className="loan-calculator">
      <h2>Loan Calculator</h2>
      <div className="budget-input">
        <label htmlFor="budget">Set your budget for optimized repayment: </label>
        <input
          type="number"
          id="budget"
          value={userBudget}
          onChange={(e) => setUserBudget(e.target.value)}
          placeholder="Enter budget"
        />
        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>
              By optimizing the amount of money used to pay the loans, the total amount remains consistent even if one or more of the loans are paid off.
            </li>
            <li>
              While the normal payment rate means that the amount paid is always as small as possible.
            </li>
            <li>
              The budget used for optimization is the sum of the minimum payments for every loan and any additional amount you input.
            </li>
            <li>
              You can check your remaining income on the Budget page to set an appropriate budget for repayment.
            </li>
          </ul>
        </div>
      </div>
      <button onClick={calculateRepayment}>Calculate Repayment</button>
      <button onClick={optimizeRepayment}>Optimize Repayment</button>
      {notification && <p className="notification">{notification}</p>}
      {loanData && (
        <div className="loan-visuals">
          <h3>{isOptimized ? "Optimized Loan Repayment Visualization" : "Loan Repayment Visualization"}</h3>
          <LoanRepaymentChart loanData={loanData} />
          <h3>Final Loan Costs</h3>
          <FinalLoanCostsChart loanData={loanData} />
          <h3>Total Monthly Expenses</h3>
          <MonthlyExpensesChart monthlyExpenses={monthlyExpenses} />
          <h3>Total Monthly Loan Balances</h3>
          <MonthlyBalancesChart monthlyAmount={monthlyAmount} />
        </div>
      )}
    </div>
  );
  
};

export default LoanCalculator;
