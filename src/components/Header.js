import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import "../css/Header.css";

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <nav>
        <Link to="/loans">Loans</Link>
        <Link to="/budget">Budget</Link>
        {/*<Link to="/history">Archive</Link>*/}
        <Link to="/main">Home</Link>
        {currentUser && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Header;
