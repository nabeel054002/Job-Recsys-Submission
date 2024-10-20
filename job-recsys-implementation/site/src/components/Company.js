import React, { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    // Here, you can implement code to send the username and password to your server for registration.
    // You may want to use the Fetch API or an HTTP library like Axios to make a POST request to your backend.
    // For the sake of this example, we'll just log the user input:
    console.log('Username:', username);
    console.log('Password:', password);
    const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',  // Specify the HTTP method as 'POST'
        headers: {
            'Content-Type': 'application/json',  // Set the content type to JSON
            // You may need to include additional headers like authentication tokens
        },
        body: JSON.stringify({
            username: username,
            password: password,
            user_type: "company"
        }), 
    })
    console.log('response', response)
    const token = await response.json()
    console.log('token', token)
    if(response.status!==200){
      console.log('problem')
      window.alert('Signup again, ' + token.message)
    } else {
      console.log('token', token)
      localStorage.setItem('token', token.token);
      // Redirect the user to another route (e.g., dashboard)
      window.location.href = '/'+token.token;
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up as a Company</h2>
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
          Sign Up as a company
        </button>
      </form>
    </div>
  );
}

export default Signup;