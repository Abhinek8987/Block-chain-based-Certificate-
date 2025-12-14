const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// =======================
// IMPORT ROUTES
// =======================
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const adminRoutes = require('./routes/admin');
const verifierRoutes = require('./routes/verifier');
const ipfsRoutes = require('./routes/ipfs');
const multilingualCertificateRoutes = require('./routes/multilingualCertificates');
const autoCertificateRoutes = require('./routes/autoCertificates');

// =======================
// IMPORT MIDDLEWARE
// =======================
const errorHandler = require('./middleware/errorHandler');

const app = express();

// =======================
// SECURITY
// =======================
app.use(helmet());

// =======================
// RATE LIMITING
// =======================
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// =======================
// CORS CONFIGURATION
// =======================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// =======================
// BODY PARSING
// =======================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =======================
// COMPRESSION
// =======================
app.use(compression());

// =======================
// LOGGING
// =======================
app.use(morgan('combined'));

// =======================
// DATABASE CONNECTION
// =======================
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// =======================
// ROOT ROUTE (RENDER PORT SCAN FIX)
// =======================
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// =======================
// API ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/multilingual-certificates', multilingualCertificateRoutes);
app.use('/api/auto-certificates', autoCertificateRoutes);

// =======================
// 404 HANDLER
// =======================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// SERVER START (RENDER SAFE)
// =======================
const PORT = Number(process.env.PORT);

if (!PORT) {
  console.error('❌ Invalid PORT:', process.env.PORT);
  process.exit(1);
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// =======================
// GRACEFUL SHUTDOWN
// =======================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => process.exit(0));
});

module.exports = app;
