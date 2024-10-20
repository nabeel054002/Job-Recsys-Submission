import React, { useState } from 'react';
import '../styles/Signup.css'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('username', username, 'password', password)
    // Send a POST request to the server with the username and password
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    console.log('response', response)
    if (response.ok) {
      // If authentication is successful, receive a JWT token from the server and save it (e.g., in local storage)
      const { token } = await response.json();
      localStorage.setItem('token', token);
      // Redirect the user to another route (e.g., dashboard)
      window.location.href = '/'+token;
    } else {
      // Handle authentication failure (e.g., show an error message)
      console.error('Authentication failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Log In using your credentiails</h2>
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
          LogIn
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
