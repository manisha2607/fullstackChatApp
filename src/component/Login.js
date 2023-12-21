import React, { useState } from 'react';
import io from 'socket.io-client';

const LoginForm = ({ setUsername }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const socket = io.connect('http://localhost:5000');

    // Authenticate the user with the server
    socket.emit('authenticate', usernameInput);

    socket.on('authenticated', (username) => {
      setUsername(username);
      setError('');
    });

    socket.on('auth_error', (errorMessage) => {
      setError(errorMessage);
    });

    // Clean up the socket connection when user leave the chat
    return () => socket.disconnect();
  };

  return (
    <div  className='txtcenter'>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
