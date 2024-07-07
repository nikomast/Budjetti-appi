import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import "../../css/Budget/AddExpense.css";

const AddExpense = ({ onExpenseAdded }) => {
  const { currentUser } = useAuth();
  const [categories] = useState(["livingCosts", "travelCosts", "fixedCosts", "otherCosts"]);
  const [newExpense, setNewExpense] = useState({ category: "livingCosts", name: "", cost: 0 });
  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = async () => {
    if (currentUser) {
      const uid = currentUser.uid;
      const categoryRef = collection(db, 'users', uid, 'expenditure', newExpense.category, 'expenses');
      await addDoc(categoryRef, {
        name: newExpense.name,
        cost: parseFloat(newExpense.cost),
      });
      setNewExpense({ category: "livingCosts", name: "", cost: 0 });
      onExpenseAdded();
      setShowForm(false);
    }
  };

  return (
    <div className='add-expense'>
      {showForm ? (
        <div className="add-expense-form">
          <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
          <input
            type="text"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            placeholder="Expense Name"
          />
          <input
            type="number"
            value={newExpense.cost}
            onChange={(e) => setNewExpense({ ...newExpense, cost: e.target.value })}
            placeholder="Cost"
          />
          <button onClick={handleAddExpense}>Add Expense</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}>Add Expense</button>
      )}
    </div>
  );
};

export default AddExpense;
