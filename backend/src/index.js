const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Enable CORS for frontend to connect
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Log HTTP requests
app.use(morgan('dev'));

// Rate limit (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100
});
app.use(limiter);

// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('SecureSphere backend is running 🚀');
});

// ----- Socket.io Setup -----
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Change this for production!
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // You can later add custom event handlers like:
  // socket.on('newFraudReport', (data) => { ... });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Listen on configured port using httpServer for socket support
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
