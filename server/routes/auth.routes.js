const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const { authLimiter, otpLimiter } = require('../middleware/security');
const { loginValidator, registerValidator, otpValidator } = require('../middleware/validator');
const { requireAuth } = require('../middleware/auth');

router.post('/register', authLimiter, registerValidator, auth.register);
router.post('/login', authLimiter, loginValidator, auth.login);
router.post('/verify-otp', authLimiter, otpValidator, auth.verifyOTP);
router.post('/resend-otp', otpLimiter, auth.resendOTP);
router.post('/refresh', auth.refreshToken);
router.get('/me', requireAuth, auth.getMe);

module.exports = router;
