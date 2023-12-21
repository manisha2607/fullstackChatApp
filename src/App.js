import React, { useState } from 'react';
import Chat from './component/Chat';
import LoginForm from './component/Login';
import './App.css';

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div className="App">
      {username ? (
        <Chat username={username} />
      ) : (
        <LoginForm setUsername={setUsername} />
      )}
    </div>
  );
}

export default App;
