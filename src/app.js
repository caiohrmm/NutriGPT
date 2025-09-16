const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { requestLogger } = require('./middleware/requestLogger');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger());
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const allowlist = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    
    // Em desenvolvimento, permite qualquer origem se CORS_ORIGINS estiver vazio
    // ou adiciona IPs da rede local automaticamente
    if (process.env.NODE_ENV === 'development' && allowlist.length === 0) {
      return cb(null, true);
    }
    
    // Lista de IPs permitidos para desenvolvimento local
    const developmentOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://26.192.192.120:5173',
      'http://26.38.198.144:5173'
    ];
    
    const allAllowed = [...allowlist, ...developmentOrigins];
    
    if (!origin || allAllowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  credentials: true,
  exposedHeaders: ['x-access-token'],
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


