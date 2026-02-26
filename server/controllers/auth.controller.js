const { query } = require('../config/db');
const hashUtil = require('../utils/hash');
const tokenService = require('../services/token.service');
const otpService = require('../services/otp.service');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

module.exports = {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const { email, password, name, role, age, gender, height, weight, goal, level, workout_days } = req.body;

            // Check duplicate email
            const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            const passwordHash = await hashUtil.hash(password);

            // Get role ID (default: member)
            const roleName = role || 'member';
            const roleResult = await query('SELECT id FROM roles WHERE name = $1', [roleName]);
            const roleId = roleResult.rows[0]?.id || 4;

            // Create user (inactive until OTP verified)
            const result = await query(
                `INSERT INTO users (email, password_hash, name, role_id, age, gender, height, weight, goal, level, workout_days, is_active, is_email_verified)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, false)
                 RETURNING id, email, name`,
                [email, passwordHash, name, roleId, age || null, gender || null, height || null, weight || null, goal || null, level || 'beginner', workout_days || 3]
            );

            const user = result.rows[0];

            // Generate and send OTP
            const otp = await otpService.create(email);
            await emailService.sendOTP(email, otp);

            await logger.log(user.id, 'User registered', 'auth', { email }, req);

            res.status(201).json({
                message: 'Registration successful. Please verify your email with the OTP sent.',
                userId: user.id,
                email: user.email,
            });
        } catch (err) {
            console.error('Register error:', err.message);
            if (err.message.includes('Too many OTP')) {
                return res.status(429).json({ error: err.message });
            }
            res.status(500).json({ error: 'Registration failed' });
        }
    },

    // POST /api/auth/verify-otp
    async verifyOTP(req, res) {
        try {
            const { email, code } = req.body;

            const valid = await otpService.verify(email, code);
            if (!valid) {
                return res.status(400).json({ error: 'Invalid or expired OTP code' });
            }

            // Activate user
            await query(
                `UPDATE users SET is_active = true, is_email_verified = true, updated_at = NOW() WHERE email = $1`,
                [email]
            );

            // Get user for token generation
            const userResult = await query(
                `SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1`,
                [email]
            );
            const user = userResult.rows[0];

            const tokens = tokenService.generateTokenPair(user);

            await logger.log(user.id, 'Email verified via OTP', 'auth', { email }, req);
            await emailService.sendWelcome(email, user.name);

            res.json({
                message: 'Email verified successfully!',
                user: { id: user.id, email: user.email, name: user.name, role: user.role_name },
                ...tokens,
            });
        } catch (err) {
            console.error('OTP verify error:', err.message);
            res.status(500).json({ error: 'Verification failed' });
        }
    },

    // POST /api/auth/resend-otp
    async resendOTP(req, res) {
        try {
            const { email } = req.body;

            const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
            if (existing.rows.length === 0) {
                return res.status(404).json({ error: 'Email not found' });
            }

            const otp = await otpService.create(email);
            await emailService.sendOTP(email, otp);

            res.json({ message: 'OTP resent to your email' });
        } catch (err) {
            console.error('Resend OTP error:', err.message);
            if (err.message.includes('Too many OTP')) {
                return res.status(429).json({ error: err.message });
            }
            res.status(500).json({ error: 'Failed to resend OTP' });
        }
    },

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await query(
                `SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1`,
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = result.rows[0];

            // Check password
            const valid = await hashUtil.compare(password, user.password_hash);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Check if account is active
            if (!user.is_active) {
                return res.status(403).json({ error: 'Account not verified. Please verify your email.', code: 'NOT_VERIFIED' });
            }

            // Update last login
            await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

            const tokens = tokenService.generateTokenPair(user);

            await logger.log(user.id, 'User logged in', 'auth', { email }, req);

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id, email: user.email, name: user.name, role: user.role_name,
                    age: user.age, gender: user.gender, height: user.height, weight: user.weight,
                    goal: user.goal, level: user.level, workout_days: user.workout_days,
                    xp: user.xp, streak: user.streak, language: user.language,
                },
                ...tokens,
            });
        } catch (err) {
            console.error('Login error:', err.message);
            res.status(500).json({ error: 'Login failed' });
        }
    },

    // POST /api/auth/refresh
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token required' });
            }

            const decoded = tokenService.verifyRefreshToken(refreshToken);
            const result = await query(
                `SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = result.rows[0];
            const tokens = tokenService.generateTokenPair(user);

            res.json(tokens);
        } catch (err) {
            res.status(403).json({ error: 'Invalid refresh token' });
        }
    },

    // GET /api/auth/me
    async getMe(req, res) {
        try {
            const result = await query(
                `SELECT u.id, u.email, u.name, u.phone, u.avatar_url, r.name as role, 
                 u.age, u.gender, u.height, u.weight, u.goal, u.level, u.workout_days,
                 u.xp, u.streak, u.language, u.last_login, u.created_at
                 FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
                [req.user.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get profile' });
        }
    }
};
