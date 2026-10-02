const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const port = Number(process.env.PORT || 5000);
const frontendOrigin = process.env.FRONTEND_ORIGIN;

if (!frontendOrigin) {
  throw new Error('FRONTEND_ORIGIN must be configured');
}

const maxMessageLength = Number(process.env.SOCKET_MESSAGE_MAX_LENGTH || 1000);
const rateWindowMs = Number(process.env.SOCKET_RATE_WINDOW_MS || 5000);
const rateMaxMessages = Number(process.env.SOCKET_RATE_MAX_MESSAGES || 10);

const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 100 * 1024,
});

app.disable('x-powered-by');

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.info('Socket connected', { socketId: socket.id });

  let windowStartedAt = Date.now();
  let messagesInWindow = 0;

  socket.on('sendMessage', (rawMessage) => {
    const now = Date.now();

    if (now - windowStartedAt >= rateWindowMs) {
      windowStartedAt = now;
      messagesInWindow = 0;
    }

    messagesInWindow += 1;

    if (messagesInWindow > rateMaxMessages) {
      socket.emit('messageError', 'Too many messages; please slow down.');
      return;
    }

    if (typeof rawMessage !== 'string') {
      socket.emit('messageError', 'Invalid message format.');
      return;
    }

    const message = rawMessage.trim();

    if (!message) {
      socket.emit('messageError', 'Message cannot be empty.');
      return;
    }

    if (message.length > maxMessageLength) {
      socket.emit('messageError', 'Message is too long.');
      return;
    }

    io.emit('message', message);
  });

  socket.on('disconnect', (reason) => {
    console.info('Socket disconnected', { socketId: socket.id, reason });
  });
});

server.listen(port, () => {
  console.info(`Realtime server listening on port ${port}`);
});
