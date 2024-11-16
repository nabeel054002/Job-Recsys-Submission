import React, { useState } from 'react';
import '../styles/Signup.css'
import { signupApi } from '../api';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
        // Call the signup API function
        const tokenData = await signupApi(username, password, 'candidate');

        // If the response contains the token, save it to localStorage
        if (tokenData && tokenData.token) {
            localStorage.setItem('token', tokenData.token);
            window.location.href = `/${tokenData.token}`;
        }
    } catch (error) {
        // If an error occurs, display an error message
        console.error('Error during signup:', error.message);
        setErrorMessage(error.message);
        window.alert('Signup failed: ' + error.message);
    }
};

  return (
    <div className="signup-container">
      <h2>Sign Up as a candidate</h2>
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
        <button type="button" onClick={handleSignup} className="signup-button">
          Sign Up as a candidate
        </button>
      </form>
    </div>
  );
}

export default Signup;