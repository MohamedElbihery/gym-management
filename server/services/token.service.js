const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

module.exports = {
    generateAccessToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    },

    generateRefreshToken(payload) {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    },

    verifyAccessToken(token) {
        return jwt.verify(token, JWT_SECRET);
    },

    verifyRefreshToken(token) {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    },

    generateTokenPair(user) {
        const payload = { id: user.id, email: user.email, role: user.role_name || user.role };
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken({ id: user.id }),
            expiresIn: JWT_EXPIRES_IN,
        };
    }
};
