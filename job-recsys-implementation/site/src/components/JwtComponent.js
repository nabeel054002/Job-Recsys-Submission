import React, { useState, useEffect } from 'react';
import Panel from './Panel';
import { getUserFromToken } from '../api';  // Import the API function

function JwtComponent() {
  const [user, setUser] = useState('');

  // Fetch user from token
  const fetchUser = async (token) => {
    try {
      const username = await getUserFromToken(token);  // Use the extracted API function
      setUser(username);
    } catch (error) {
      console.log('Error getting user:', error.message);
    }
  };

  // Decode token and fetch user on component mount
  useEffect(() => {
    const token = window.location.href.substring(22);
    fetchUser(token);  // Call the fetchUser function with the token
  }, []);  // Empty dependency array to run only once on mount

  return (
    <div>
      {user ? <Panel username={user} /> : 'Login Again'}
    </div>
  );
}

export default JwtComponent;
