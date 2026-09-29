const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const { register, metricsMiddleware } = require('./metrics');

const authRoutes   = require('./routes/authRoutes');
const enrollRoutes = require('./routes/enrollRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes  = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Track every request from here on
app.use(metricsMiddleware);

app.use('/api/auth',    authRoutes);
app.use('/api/enroll',  enrollRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Prometheus scrape endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;