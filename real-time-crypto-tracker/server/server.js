const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock crypto data (in a real app, you'd fetch from an API)
let cryptoData = [
  {
    symbol: 'BTC',
    price: 45000 + Math.random() * 1000,
    change24h: (Math.random() - 0.5) * 10,
    volume24h: 25000000000 + Math.random() * 5000000000
  },
  {
    symbol: 'ETH',
    price: 2800 + Math.random() * 200,
    change24h: (Math.random() - 0.5) * 8,
    volume24h: 15000000000 + Math.random() * 3000000000
  },
  {
    symbol: 'ADA',
    price: 0.45 + Math.random() * 0.1,
    change24h: (Math.random() - 0.5) * 15,
    volume24h: 800000000 + Math.random() * 200000000
  },
  {
    symbol: 'SOL',
    price: 95 + Math.random() * 10,
    change24h: (Math.random() - 0.5) * 12,
    volume24h: 2000000000 + Math.random() * 500000000
  },
  {
    symbol: 'DOT',
    price: 7.50 + Math.random() * 1,
    change24h: (Math.random() - 0.5) * 18,
    volume24h: 500000000 + Math.random() * 100000000
  }
];

// Update prices periodically
setInterval(() => {
  cryptoData = cryptoData.map(crypto => ({
    ...crypto,
    price: crypto.price + (Math.random() - 0.5) * (crypto.price * 0.01), // ±1% change
    change24h: (Math.random() - 0.5) * 20, // Random change percentage
    volume24h: crypto.volume24h + (Math.random() - 0.5) * (crypto.volume24h * 0.1)
  }));

  // Emit updated data to all connected clients
  io.emit('crypto-update', cryptoData);
}, 2000); // Update every 2 seconds

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('crypto-update', cryptoData);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});