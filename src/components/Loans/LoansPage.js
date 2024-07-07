import React, { useRef, useState } from 'react';
import AddLoan from './AddLoans';
import Loans from './Loans';
import LoanCalculator from './LoanCalculator';
import '../../css/Loans/MainPage.css';

const MainPage = () => {
  const loansRef = useRef(null);
  const [loanCalculatorKey, setLoanCalculatorKey] = useState(0);

  const handleLoanAdded = () => {
    if (loansRef.current) {
      loansRef.current.fetchLoans();
    }
    setLoanCalculatorKey(loanCalculatorKey + 1); // Force re-render of LoanCalculator
  };

  return (
    <div className="main-container">
      <main className="main-content">
        <section className="loan-list-section">
          <h2>Your Loans</h2>
          <Loans ref={loansRef} onLoanUpdated={handleLoanAdded} />
          <h2>Add a New Loan</h2>
          <AddLoan onLoanAdded={handleLoanAdded} />
        </section>
        <section className="calculator">
        <LoanCalculator key={loanCalculatorKey} />
      </section>
      </main>
    </div>
  );
};

export default MainPage;


/**
return (
    <div className="main-container">
      <header className="main-header">
        <h1>Loan Management System</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <main className="main-content">
        <section className="loan-list-section">
          <h2>Your Loans</h2>
          <Loans ref={loansRef} />
        </section>
        <section className="add-loan-section">
          <h2>Add a New Loan</h2>
          <AddLoan onLoanAdded={handleLoanAdded} />
        </section>
        <section className="calculator-section">
          <LoanCalculator />
        </section>
      </main>
      <footer className="main-footer">
        <p>&copy; 2024 Loan Management System</p>
      </footer>
    </div>
  );*/