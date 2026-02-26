const tokenService = require('../services/token.service');
const { query } = require('../config/db');

// Verify JWT and attach user to request
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = tokenService.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
}

// Role-based access control
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions', required: roles });
        }
        next();
    };
}

// Optional auth - sets req.user if token exists but doesn't block
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            req.user = tokenService.verifyAccessToken(authHeader.split(' ')[1]);
        } catch (e) { /* ignore */ }
    }
    next();
}

module.exports = { requireAuth, requireRole, optionalAuth };
