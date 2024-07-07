// AddLoans.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import '../../css/Loans/AddLoan.css';

const AddLoan = ({ onLoanAdded }) => {
  const { currentUser } = useAuth();
  const [loanName, setLoanName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanPayment, setLoanPayment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddLoan = async () => {
    if (currentUser) {
      const uid = currentUser.uid;
      const loanData = {
        name: loanName,
        originalAmount: parseFloat(loanAmount),
        currentBalance: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        payment: parseFloat(loanPayment),
        createdAt: new Date(),
      };

      try {
        await addDoc(collection(db, 'users', uid, 'loan'), loanData);
        console.log('Loan added successfully!');

        setLoanName("")
        setLoanAmount("")
        setInterestRate("")
        setLoanPayment("")

        onLoanAdded();
        setShowForm(false);
      } catch (error) {
        console.error('Error adding loan:', error);
      }
    }
  };

  return (
    <div className='add-loan'>
      {showForm ? (
        <div className="add-loan-form">
          <input
            type="string"
            value={loanName}
            onChange={(e) => setLoanName(e.target.value)}
            placeholder="Loan Name"
            required
          />
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Loan Amount"
            required
          />
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Interest Rate"
            required
          />
          <input
            type="number"
            value={loanPayment}
            onChange={(e) => setLoanPayment(e.target.value)}
            placeholder="Minimum Payment"
            required
          />
          <button onClick={handleAddLoan}>Add Loan</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}>Add Loan</button>
      )}
    </div>
  );
};

export default AddLoan;
