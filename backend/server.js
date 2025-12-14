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
// CORS
// =======================
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS blocked'));
    },
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
// DATABASE (MongoDB Atlas)
// =======================
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI missing');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/multilingual-certificates', multilingualCertificateRoutes);
app.use('/api/auto-certificates', autoCertificateRoutes);

// =======================
// 404
// =======================
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// SERVER (RENDER SAFE)
// =======================
const PORT = Number(process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
