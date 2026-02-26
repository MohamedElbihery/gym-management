const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { roleUpdateValidator, userIdValidator } = require('../middleware/validator');

// All admin routes require super_admin role
router.use(requireAuth, requireRole('super_admin', 'admin'));

router.get('/users', admin.listUsers);
router.get('/stats', admin.getStats);

// Super Admin only
router.post('/users', requireRole('super_admin'), admin.createUser);
router.put('/users/:id/role', requireRole('super_admin'), roleUpdateValidator, admin.updateRole);
router.delete('/users/:id', requireRole('super_admin'), userIdValidator, admin.deleteUser);

module.exports = router;
