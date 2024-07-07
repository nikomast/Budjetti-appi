import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import '../../css/Budget/AddIncome.css';

const AddIncome = ({ onIncomeAdded }) => {
  const { currentUser } = useAuth();
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddIncome = async () => {
    if (currentUser) {
      const uid = currentUser.uid;
      const incomeData = {
        name: incomeSource,
        amount: parseFloat(incomeAmount),
        createdAt: new Date(),
      };

      try {
        await addDoc(collection(db, 'users', uid, 'incomes'), incomeData);
        console.log('Income added successfully!');

        setIncomeSource("");
        setIncomeAmount("");

        onIncomeAdded();
        setShowForm(false);
      } catch (error) {
        console.error('Error adding income:', error);
      }
    }
  };

  return (
    <div className='add-income'>
      {showForm ? (
        <div className="add-income-form">
          <input
            type="text"
            value={incomeSource}
            onChange={(e) => setIncomeSource(e.target.value)}
            placeholder="Income Source"
            required
          />
          <input
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            placeholder="Income Amount"
            required
          />
          <button onClick={handleAddIncome}>Add Income</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}>Add Income</button>
      )}
    </div>
  );
};

export default AddIncome;
