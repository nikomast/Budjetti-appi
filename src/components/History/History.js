import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const History = () => {
  const { currentUser } = useAuth();

  return(
    <div>
        <h2>Historypage</h2>
    </div>
  );
}
export default History