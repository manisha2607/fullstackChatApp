// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const db = require('./db');
// const bodyParser = require('body-parser');
// const msgRouter = require('./routes/messageRoute');
// const app = express();

// app.use(bodyParser.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// app.use(cors());


// db.on('error', console.error.bind(console, "MongoDB Connection error:"))
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// const server = http.createServer(app);

// // Attach the Socket.io server to the HTTP server
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3000', 
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });


// const PORT =  5000;

// const activeUsers = {};

// io.on('connection', (socket) => {
//   console.log('User connected');


//   // Handle user authentication
//   socket.on('authenticate', (username) => {
//     if (activeUsers[username]) {
//       socket.emit('auth_error', 'Username is already taken');
//       return;
//     }

//     activeUsers[username] = socket.id;
//     socket.emit('authenticated', username);

//     // Broadcast to all clients when a new user joins
//     io.emit('chat_message', {
//       username: 'System',
//       message: `${username} has joined the chat`,
//     });

//     // Notify all clients about the updated user list
//     io.emit('active_users', Object.keys(activeUsers));
//   });
    
//   // Handle chat messages
//   socket.on('send_message', (message) => {
//     const { username, text } = message;
//     io.emit('chat_message', { username, message: text });
//   });

//   // Handle user disconnection 
//   socket.on('disconnect', () => {
//     const disconnectedUser = Object.keys(activeUsers).find(
//       (user) => activeUsers[user] === socket.id
//     );

//     if (disconnectedUser) {
//       delete activeUsers[disconnectedUser];
//       io.emit('active_users', Object.keys(activeUsers));

//       io.emit('chat_message', {
//         username: 'System',
//         message: `${disconnectedUser} has left the chat`,
//       });
//     }

//     console.log('User disconnected');
//   });
// });

// //routes
// app.use('/api/msg', msgRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');
const msgRouter = require('./routes/messageRoute');
const Message = require('./model/userMessage');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors());

db.on('error', console.error.bind(console, "MongoDB Connection error:"))
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const server = http.createServer(app);

// Attach the Socket.io server to the HTTP server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = 5000;
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected');

  // Emit all messages to the newly connected user
  Message.find()
    .then((messages) => {
      socket.emit('all_messages', messages);
    })
    .catch((error) => {
      console.error('Error fetching messages:', error);
    });

  // Handle user authentication
  socket.on('authenticate', (username) => {
    if (activeUsers[username]) {
      socket.emit('auth_error', 'Username is already taken');
      return;
    }

    activeUsers[username] = socket.id;
    socket.emit('authenticated', username);

    // Broadcast to all clients when a new user joins
    io.emit('chat_message', {
      username: 'System',
      message: `${username} has joined the chat`,
    });

    // Notify all clients about the updated user list
    io.emit('active_users', Object.keys(activeUsers));

    // Emit all messages to the newly authenticated user
    Message.find()
      .then((messages) => {
        socket.emit('all_messages', messages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  });

  // Handle chat messages
  socket.on('send_message', async (message) => {
    const { username, text } = message;

    // Save the message to the database
    const newMessage = new Message({ sender: username, content: text });
    await newMessage.save();

    // Emit the new message to all connected clients
    io.emit('chat_message', { username, message: text });

    // Emit the updated list of messages to all connected clients (including the sender)
    Message.find()
      .then((messages) => {
        io.emit('all_messages', messages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  });

  // Handle user disconnection 
  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(activeUsers).find(
      (user) => activeUsers[user] === socket.id
    );

    if (disconnectedUser) {
      delete activeUsers[disconnectedUser];
      io.emit('active_users', Object.keys(activeUsers));

      io.emit('chat_message', {
        username: 'System',
        message: `${disconnectedUser} has left the chat`,
      });
    }

    console.log('User disconnected');
  });
});

//routes
app.use('/api/msg', msgRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
