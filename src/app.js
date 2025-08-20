const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { requestLogger } = require('./middleware/requestLogger');

dotenv.config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger());
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const allowlist = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!origin || allowlist.length === 0 || allowlist.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 200),
});
app.use(limiter);

app.get('/health', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));
// Alias para coleção Postman que usa baseUrl com /api
app.get('/api/health', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Routes
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;


