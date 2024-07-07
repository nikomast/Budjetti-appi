import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import "../../css/Loans/Loans.css";

const Loans = React.forwardRef((props, ref) => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

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

  const fetchPayments = async (loanId) => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const paymentsRef = collection(db, 'users', uid, 'loan', loanId, 'payments');
        const q = query(paymentsRef);
        const querySnapshot = await getDocs(q);

        const paymentsData = [];
        querySnapshot.forEach((doc) => {
          paymentsData.push({ id: doc.id, ...doc.data() });
        });

        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleLoanClick = (loan) => {
    if (loan !== selectedLoan) {
      setSelectedLoan(loan);
      fetchPayments(loan.id);
    } else {
      setSelectedLoan(null);
      setPayments([]);
    }
  };

  const handleAddPayment = async () => {
    try {
      if (currentUser && selectedLoan && newPayment) {
        const uid = currentUser.uid;
        const paymentsRef = collection(db, 'users', uid, 'loan', selectedLoan.id, 'payments');
        await addDoc(paymentsRef, {
          amount: parseFloat(newPayment),
          date: new Date(),
        });

        const loanRef = doc(db, 'users', uid, 'loan', selectedLoan.id);
        const newBalance = selectedLoan.currentBalance - parseFloat(newPayment);
        await updateDoc(loanRef, { currentBalance: newBalance });

        setNewPayment('');
        setShowAddPaymentForm(false);
        fetchLoans();
        fetchPayments(selectedLoan.id);
        props.onLoanUpdated();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const loanRef = doc(db, 'users', uid, 'loan', loanId);
        await deleteDoc(loanRef);
        fetchLoans();
        if (selectedLoan && selectedLoan.id === loanId) {
          setSelectedLoan(null);
          setPayments([]);
        }
        props.onLoanUpdated();
      }
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [currentUser]);

  React.useImperativeHandle(ref, () => ({
    fetchLoans,
  }));

  return (
    <div>
      <ul className="loan-list">
        {loans.map((loan) => (
          <li key={loan.id} onClick={() => handleLoanClick(loan)}>
            {loan.name}
            <button className='delete-button' onClick={() => handleDeleteLoan(loan.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedLoan && (
        <div className="loan-details">
          <h3>Loan Details</h3>
          <p>Name: {selectedLoan.name}</p>
          <p>Original Amount: {selectedLoan.originalAmount}</p>
          <p>Current Balance: {selectedLoan.currentBalance}</p>
          <p>Interest Rate: {selectedLoan.interestRate}%</p>
          <p>Minimum Payment: {selectedLoan.payment}/Month</p>
          <button onClick={() => setShowAddPaymentForm(true)}>Add Payment</button>
          {showAddPaymentForm && (
            <div>
              <input
                type="number"
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                placeholder="Payment Amount"
              />
              <button onClick={handleAddPayment}>Submit Payment</button>
              <button onClick={() => setShowAddPaymentForm(false)}>Cancel</button>
            </div>
          )}
          <h4>Payment History</h4>
          <ul className="payment-list">
            {payments.map((payment) => (
              <li key={payment.id}>
                Amount: {payment.amount}, Date: {new Date(payment.date.seconds * 1000).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Loans;
