require('dotenv').config();
const express = require('express');
const path = require('path');
const { helmetMiddleware, corsMiddleware, generalLimiter } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// ==================== TRUST PROXY (Render / cloud) ====================
if (isProduction) {
    app.set('trust proxy', 1);
}

// ==================== SECURITY MIDDLEWARE ====================
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(generalLimiter);

// ==================== BODY PARSING ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== STATIC FILES (only in dev) ====================
if (!isProduction) {
    app.use(express.static(path.join(__dirname, '..')));
}

// ==================== API ROUTES ====================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/users', require('./routes/user.routes'));

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0', env: isProduction ? 'production' : 'development' });
});

// ==================== CATCH-ALL FOR SPA (dev only) ====================
// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

if (!isProduction) {
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '..', 'index.html'));
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
    });
} else {
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'API endpoint not found' });
    });
}

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================
async function start() {
    try {
        // Run migrations on startup
        await require('./models/migrate')();

        const server = app.listen(PORT, () => {
            console.log(`\n🏋️ GymForge Pro Server running on port ${PORT}`);
            console.log(`📡 API Base: /api`);
            console.log(`🔒 Environment: ${isProduction ? 'production' : 'development'}\n`);
        });

        // Graceful shutdown
        const shutdown = (signal) => {
            console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
            setTimeout(() => process.exit(1), 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

start();
