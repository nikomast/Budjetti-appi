import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Registration process
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registered:', userCredential);

        // Send email verification
        await sendEmailVerification(userCredential.user);
        setMessage('Verification email sent. Please check your inbox.');

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          createdAt: new Date(),
          // Add more fields as needed
        });
      } catch (error) {
        console.error('Error registering:', error);
        setMessage('Error registering. Please try again.');
      }
    } else {
      // Login process
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user.emailVerified) {
          console.log('Logged in:', userCredential);
          setMessage('Logged in successfully.');
          navigate('/main');
        } else {
          setMessage('Please verify your email before logging in.');
          await auth.signOut();
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setMessage('Error logging in. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'New user? Register'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
