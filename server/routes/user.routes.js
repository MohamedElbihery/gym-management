const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Profile
router.get('/:id/profile', user.getProfile);
router.put('/:id/profile', user.updateProfile);

// History
router.get('/:id/history', user.getHistory);

// Attendance
router.get('/:id/attendance', user.getAttendance);
router.post('/:id/attendance', user.checkIn);

// Workouts
router.get('/:id/workouts', user.getWorkouts);
router.post('/:id/workouts', user.saveWorkout);

// Nutrition
router.get('/:id/nutrition', user.getNutrition);
router.post('/:id/nutrition', user.logNutrition);

// Payments
router.get('/:id/payments', user.getPayments);

// Chat history
router.get('/:id/chat', user.getChatHistory);
router.post('/:id/chat', user.saveChatMessage);
router.delete('/:id/chat', user.clearChat);

// Notifications
router.get('/:id/notifications', user.getNotifications);
router.put('/:id/notifications/read', user.markNotificationsRead);

module.exports = router;
