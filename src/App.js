// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoansPage from './components/Loans/LoansPage';
import LoginPage from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Main from './components/Landing'
import Budget from './components/Budget/Budget';
import Header from './components/Header';
import Footer from './components/Footer';

const AppContent = () => {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return <div className="private-route-container"><div className="loading-message">Loading...</div></div>;  }

  return (
    <>
      {currentUser && <Header />} {/* Only show Header when user is authenticated */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
        <Route path="/loans" element={<PrivateRoute><LoansPage /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
