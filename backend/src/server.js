require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();
const server = http.createServer(app);

// 🔥 Socket.io
const io = new Server(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}
});

// Connect DB
connectDB();

// 🔥 CORS Configuration for Render.com
const corsOptions = {
  origin: [
    'https://updated-version-of-math-point-1.onrender.com',
    'https://updated-version-of-math-point.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(fileUpload({
createParentPath: true,
limits: { fileSize: 50 * 1024 * 1024 }
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.io events
io.on('connection', (socket) => {
socket.on('join', (userId) => socket.join(userId));
socket.on('joinRoom', (room) => socket.join(room));
});

app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/doubts', require('./routes/doubts'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
res.json({ status: 'ok', message: 'Math Point API is running 🚀' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
