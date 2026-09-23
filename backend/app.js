const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes   = require('./routes/authRoutes');
const enrollRoutes = require('./routes/enrollRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes  = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/enroll',  enrollRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
