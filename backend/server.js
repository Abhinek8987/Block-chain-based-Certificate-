const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const adminRoutes = require('./routes/admin');
const verifierRoutes = require('./routes/verifier');
const ipfsRoutes = require('./routes/ipfs');
const multilingualCertificateRoutes = require('./routes/multilingualCertificates');
const autoCertificateRoutes = require('./routes/autoCertificates');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* =======================
   SECURITY
======================= */
app.use(helmet());

/* =======================
   RATE LIMITING
======================= */
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =======================
   CORS
======================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log('🚫 CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* =======================
   BODY PARSING
======================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =======================
   COMPRESSION
======================= */
app.use(compression());

/* =======================
   LOGGING
======================= */
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

/* =======================
   DATABASE
======================= */
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

/* =======================
   HEALTH CHECK
======================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

/* =======================
   ROUTES
======================= */
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/multilingual-certificates', multilingualCertificateRoutes);
app.use('/api/auto-certificates', autoCertificateRoutes);

/* =======================
   404
======================= */
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

/* =======================
   ERROR HANDLER
======================= */
app.use(errorHandler);

/* =======================
   SERVER (RENDER FIX)
======================= */
const PORT = Number(process.env.PORT); // ⚠️ DO NOT use fallback

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
});

/* =======================
   GRACEFUL SHUTDOWN
======================= */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => console.log('✅ Server closed'));
});

module.exports = app;
