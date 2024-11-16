import React, { useState } from 'react';
import '../styles/Signup.css';
import { loginUser } from '../api'; // Import the API function

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      console.log('username', username, 'password', password);
      const token = await loginUser(username, password);
      localStorage.setItem('token', token);
      // Redirect to the dashboard with the token in the URL
      window.location.href = `/${token}`;
    } catch (error) {
      // If login fails, show an error message
      setErrorMessage('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Log In using your credentials</h2>
      <form className="signup-form">
        <div>
          <label className="signup-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
          />
        </div>
        <div>
          <label className="signup-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
        </div>
        <button type="button" onClick={handleLogin} className="signup-button">
          Log In
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}
    </div>
  );
};

export default LoginPage;
