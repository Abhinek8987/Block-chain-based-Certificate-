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

/* ===================== SECURITY ===================== */
app.use(helmet());

/* ===================== RATE LIMIT ===================== */
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ===================== CORS ===================== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

/* ===================== BODY ===================== */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ===================== COMPRESSION ===================== */
app.use(compression());

/* ===================== LOGGING ===================== */
app.use(morgan('combined'));

/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

/* ===================== ROUTES ===================== */
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/multilingual-certificates', multilingualCertificateRoutes);
app.use('/api/auto-certificates', autoCertificateRoutes);

/* ===================== ERROR ===================== */
app.use(errorHandler);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
