require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Added CORS middleware
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboard'); // Import dashboard routes
const { protect, admin } = require('./middlewares/authMiddleware');

const app = express();
const server = http.createServer(app);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json());
app.use(bodyParser.json());

// Root Route
app.get('/', (req, res) => {
  res.send('API Server is Live!');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', protect, admin, userRoutes);
app.use('/api/products', protect, productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes); // Dashboard routes

// WebSocket Logic
io.on('connection', (socket) => {
  console.log('New WebSocket Connection:', socket.id);

  // Handle order status updates
  socket.on('orderPlaced', async (orderData) => {
    const { customer, products, totalPrice } = orderData;
    const newOrder = await Order.create({ customer, products, totalPrice });
    io.emit('dashboardUpdate', newOrder); // Notify all connected clients
});

socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
});
});

app.set("io", io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));