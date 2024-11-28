// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('sendMessage', (msg) => {
    io.emit('message', msg); // Broadcast message to all connected clients
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
