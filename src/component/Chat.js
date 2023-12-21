//  import React, { useState, useEffect } from 'react';
//  import io from 'socket.io-client';

//  const Chat = ({ username }) => {
//     const [messageInput, setMessageInput] = useState('');
//     const [chatMessages, setChatMessages] = useState([]);
//     const [activeUsers, setActiveUsers] = useState([]);
//     const [socket, setSocket] = useState(null);  // Initialize socket state

//     useEffect(() => {
//       // Establish the connection and set the socket state
//       const newSocket = io.connect('http://localhost:5000');
//       setSocket(newSocket);
  
//       newSocket.on('chat_message', (message) => {
//         setChatMessages((prevMessages) => [...prevMessages, message]);
//       });
  
//       newSocket.on('active_users', (users) => {
//         setActiveUsers(users);
//       });
       
//       // Clean up the socket connection when component unmount
//       return () => newSocket.disconnect();
//     }, []);  // The empty dependency array ensures that this effect runs only once
  
//     const handleSendMessage = () => {
//       // Check if the socket object is available before emitting
//       if (socket) {
//         if (messageInput.trim() !== '') {
//           const message = {
//             username,
//             text: messageInput,
//           };
//           socket.emit('send_message', message);
//           setMessageInput('');
//         }
//       } else {
//         console.error('Socket not initialized');  
//       }
//     }; 
//    return (
//     <div>
//       <h2 className='txtcenter'>Welcome, {username}!</h2>
//       <div>
//         <h3 className='txtcenter'>Chat Room</h3>
//         <div className='chatbox'>
//           {chatMessages.map((msg, index) => (
//             <div key={index}>
//               <strong>{msg.username}:</strong> {msg.message}
//             </div>
//           ))}
//         </div>
//         <div className='txtcenter'>
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//           />
//           <button onClick={handleSendMessage}>Send</button>
//         </div>
//       </div>
//       <div className='txtcolor'>
//         <h3>Active Users</h3>
//         <ul>
//           {activeUsers.map((user) => (
//             <li key={user}>{user}</li>
//           ))}
//         </ul>
//       </div>
//     </div>  
//   );
// };

// export default Chat;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ username }) => {
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('chat_message', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('active_users', (users) => {
      setActiveUsers(users);
    });

    // Fetch messages when the component mounts
    fetchMessages();

    return () => newSocket.disconnect();
  }, []); 

  const handleSendMessage = () => {
    if (socket) {
      if (messageInput.trim() !== '') {
        const message = {
          username,
          text: messageInput,
        };
        socket.emit('send_message', message);
        setMessageInput('');
      }
    } else {
      console.error('Socket not initialized');
    }
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/msg/getmessages');
      const data = await response.json();
      setChatMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div>
      <h2 className='txtcenter'>Welcome, {username}!</h2>
      <div>
        <h3 className='txtcenter'>Chat Room</h3>
        <div className='chatbox'>
          {chatMessages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className='txtcenter'>
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <div className='txtcolor'>
        <h3>Active Users</h3>
        <ul>
          {activeUsers.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
