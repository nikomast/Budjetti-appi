import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import "../../css/Budget/Incomes.css";

const Incomes = () => {
  const { currentUser } = useAuth();
  const [incomes, setIncomes] = useState([]);

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

  const handleDeleteIncome = async (incomeId) => {
    try {
      if (currentUser) {
        const uid = currentUser.uid;
        const incomeRef = doc(db, 'users', uid, 'incomes', incomeId);
        await deleteDoc(incomeRef);
        fetchIncomes();
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [currentUser]);

  return (
    <div>
      <ul className="income-list">
        {incomes.map((income) => (
          <li key={income.id}>
            {income.name}: ${income.amount}
            <button className='delete-button' onClick={() => handleDeleteIncome(income.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Incomes;
