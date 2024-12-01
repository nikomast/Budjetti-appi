import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebaseConfig";
import '../css/PrivateRoute.css';

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div className="private-route-container"><div className="loading-message">Loading...</div></div>;
  }

  if (error) {
    console.error('Auth state error:', error);
    return <div className="private-route-container"><div className="error-message">Error checking authentication status.</div></div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
