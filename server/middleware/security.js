const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Helmet — security headers
const helmetMiddleware = helmet({
    contentSecurityPolicy: false, // We serve static HTML or separate frontend
    crossOriginEmbedderPolicy: false,
});

// CORS — supports multiple origins from env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8088')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin) return callback(null, true);

        // In production, check against allowedOrigins or common hosting providers (Vercel)
        if (process.env.NODE_ENV === 'production') {
            const isVercel = origin.endsWith('.vercel.app');
            if (isVercel || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS: origin ${origin} not allowed`));
        }

        // Default: allow all in dev
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

// General rate limiter
const generalLimiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: { error: 'Too many auth attempts. Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP rate limiter
const otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: { error: 'Please wait before requesting another OTP.' },
});

module.exports = { helmetMiddleware, corsMiddleware, generalLimiter, authLimiter, otpLimiter };
