const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    next();
};

// Auth validators
const loginValidator = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
];

const registerValidator = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('role').optional().isIn(['member', 'trainer']).withMessage('Invalid role'),
    body('age').optional().isInt({ min: 10, max: 100 }),
    body('gender').optional().isIn(['male', 'female']),
    body('height').optional().isFloat({ min: 100, max: 250 }),
    body('weight').optional().isFloat({ min: 30, max: 300 }),
    body('goal').optional().isIn(['lose_weight', 'build_muscle', 'endurance', 'general']),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('workout_days').optional().isInt({ min: 1, max: 7 }),
    validate,
];

const otpValidator = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('code').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
    validate,
];

const userIdValidator = [
    param('id').isUUID().withMessage('Valid user ID required'),
    validate,
];

const roleUpdateValidator = [
    param('id').isUUID().withMessage('Valid user ID required'),
    body('role').isIn(['super_admin', 'admin', 'trainer', 'member']).withMessage('Invalid role'),
    validate,
];

module.exports = {
    validate, loginValidator, registerValidator, otpValidator,
    userIdValidator, roleUpdateValidator,
};
