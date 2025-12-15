const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// =======================
// ROUTES
// =======================
const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const adminRoutes = require('./routes/admin');
const verifierRoutes = require('./routes/verifier');
const ipfsRoutes = require('./routes/ipfs');
const multilingualCertificateRoutes = require('./routes/multilingualCertificates');
const autoCertificateRoutes = require('./routes/autoCertificates');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// =======================
// SECURITY
// =======================
app.use(helmet());

// =======================
// RATE LIMIT
// =======================
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// =======================
// CORS
// =======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// =======================
// BODY
// =======================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());
app.use(morgan('combined'));

// =======================
// MONGODB (ATLAS)
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
// HEALTH
// =======================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
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
// 404
// =======================
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

// =======================
// START SERVER (RENDER SAFE)
// =======================
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('🚀 Server started');
});

module.exports = app;
