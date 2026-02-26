const { query } = require('../config/db');
const logger = require('../utils/logger');

module.exports = {
    // GET /api/users/:id/history
    async getHistory(req, res) {
        try {
            const userId = req.params.id;

            // Only allow users to see their own history, or admin/super_admin
            if (req.user.id !== userId && !['admin', 'super_admin'].includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const { type, page = 1, limit = 50 } = req.query;
            const offset = (page - 1) * limit;
            let sql = `SELECT * FROM user_activity_logs WHERE user_id = $1`;
            const params = [userId];
            let pIdx = 2;

            if (type) {
                sql += ` AND category = $${pIdx++}`;
                params.push(type);
            }

            sql += ` ORDER BY created_at DESC LIMIT $${pIdx++} OFFSET $${pIdx}`;
            params.push(parseInt(limit), parseInt(offset));

            const result = await query(sql, params);
            const countResult = await query(
                'SELECT COUNT(*) FROM user_activity_logs WHERE user_id = $1' + (type ? ` AND category = '${type}'` : ''),
                [userId]
            );

            res.json({
                activities: result.rows,
                total: parseInt(countResult.rows[0].count),
                page: parseInt(page),
                limit: parseInt(limit),
            });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get history' });
        }
    },

    // GET /api/users/:id/profile
    async getProfile(req, res) {
        try {
            const result = await query(
                `SELECT u.id, u.email, u.name, u.phone, u.avatar_url, r.name as role,
                 u.age, u.gender, u.height, u.weight, u.goal, u.level, u.workout_days,
                 u.xp, u.streak, u.language, u.last_login, u.last_workout, u.created_at
                 FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
                [req.params.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get profile' });
        }
    },

    // PUT /api/users/:id/profile
    async updateProfile(req, res) {
        try {
            const { name, phone, age, gender, height, weight, goal, level, workout_days, language } = req.body;

            if (req.user.id !== req.params.id && !['admin', 'super_admin'].includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            await query(
                `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone),
                 age = COALESCE($3, age), gender = COALESCE($4, gender), height = COALESCE($5, height),
                 weight = COALESCE($6, weight), goal = COALESCE($7, goal), level = COALESCE($8, level),
                 workout_days = COALESCE($9, workout_days), language = COALESCE($10, language),
                 updated_at = NOW() WHERE id = $11`,
                [name, phone, age, gender, height, weight, goal, level, workout_days, language, req.params.id]
            );

            await logger.log(req.params.id, 'Profile updated', 'profile', {}, req);
            res.json({ message: 'Profile updated' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    },

    // GET /api/users/:id/attendance
    async getAttendance(req, res) {
        try {
            const { days = 30 } = req.query;
            const result = await query(
                `SELECT * FROM attendance WHERE user_id = $1 AND check_in > NOW() - INTERVAL '${parseInt(days)} days' ORDER BY check_in DESC`,
                [req.params.id]
            );
            res.json({ attendance: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get attendance' });
        }
    },

    // POST /api/users/:id/attendance
    async checkIn(req, res) {
        try {
            const result = await query(
                `INSERT INTO attendance (user_id, method) VALUES ($1, $2) RETURNING *`,
                [req.params.id, req.body.method || 'qr']
            );
            await query('UPDATE users SET streak = streak + 1 WHERE id = $1', [req.params.id]);
            await logger.log(req.params.id, 'Checked in', 'attendance', { method: req.body.method || 'qr' }, req);
            res.status(201).json({ attendance: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Check-in failed' });
        }
    },

    // GET /api/users/:id/workouts
    async getWorkouts(req, res) {
        try {
            const result = await query(
                `SELECT * FROM workout_plans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
                [req.params.id]
            );
            res.json({ workouts: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get workouts' });
        }
    },

    // POST /api/users/:id/workouts
    async saveWorkout(req, res) {
        try {
            const result = await query(
                `INSERT INTO workout_plans (user_id, plan_data, generated_by) VALUES ($1, $2, $3) RETURNING *`,
                [req.params.id, JSON.stringify(req.body.plan_data), req.body.generated_by || 'ai']
            );
            await logger.log(req.params.id, 'Workout plan saved', 'workout', {}, req);
            res.status(201).json({ workout: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Failed to save workout' });
        }
    },

    // GET /api/users/:id/nutrition
    async getNutrition(req, res) {
        try {
            const { days = 7 } = req.query;
            const result = await query(
                `SELECT * FROM nutrition_logs WHERE user_id = $1 AND logged_at > NOW() - INTERVAL '${parseInt(days)} days' ORDER BY logged_at DESC`,
                [req.params.id]
            );
            res.json({ logs: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get nutrition' });
        }
    },

    // POST /api/users/:id/nutrition
    async logNutrition(req, res) {
        try {
            const { meal_name, calories, protein, carbs, fats, meal_type } = req.body;
            const result = await query(
                `INSERT INTO nutrition_logs (user_id, meal_name, calories, protein, carbs, fats, meal_type)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [req.params.id, meal_name, calories, protein, carbs, fats, meal_type]
            );
            await logger.log(req.params.id, 'Nutrition logged', 'nutrition', { meal_name, calories }, req);
            res.status(201).json({ log: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Failed to log nutrition' });
        }
    },

    // GET /api/users/:id/payments
    async getPayments(req, res) {
        try {
            const result = await query(
                `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
                [req.params.id]
            );
            res.json({ payments: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get payments' });
        }
    },

    // GET /api/users/:id/chat
    async getChatHistory(req, res) {
        try {
            const { limit = 100 } = req.query;
            const result = await query(
                `SELECT * FROM chat_history WHERE user_id = $1 ORDER BY created_at ASC LIMIT $2`,
                [req.params.id, parseInt(limit)]
            );
            res.json({ messages: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get chat history' });
        }
    },

    // POST /api/users/:id/chat
    async saveChatMessage(req, res) {
        try {
            const { role, content, language, intent } = req.body;
            const result = await query(
                `INSERT INTO chat_history (user_id, role, content, language, intent) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [req.params.id, role, content, language || 'en', intent]
            );
            if (role === 'user') {
                await logger.log(req.params.id, 'AI chat message sent', 'chat', { intent }, req);
            }
            res.status(201).json({ message: result.rows[0] });
        } catch (err) {
            res.status(500).json({ error: 'Failed to save message' });
        }
    },

    // DELETE /api/users/:id/chat
    async clearChat(req, res) {
        try {
            await query('DELETE FROM chat_history WHERE user_id = $1', [req.params.id]);
            res.json({ message: 'Chat history cleared' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to clear chat' });
        }
    },

    // GET /api/users/:id/notifications
    async getNotifications(req, res) {
        try {
            const result = await query(
                `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
                [req.params.id]
            );
            res.json({ notifications: result.rows });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get notifications' });
        }
    },

    // PUT /api/users/:id/notifications/read
    async markNotificationsRead(req, res) {
        try {
            await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.params.id]);
            res.json({ message: 'Notifications marked as read' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to mark notifications' });
        }
    }
};
