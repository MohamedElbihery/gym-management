const { query } = require('../config/db');
const hashUtil = require('../utils/hash');
const logger = require('../utils/logger');

module.exports = {
    // GET /api/admin/users — List all users with roles
    async listUsers(req, res) {
        try {
            const { role, search, page = 1, limit = 50 } = req.query;
            const offset = (page - 1) * limit;
            let sql = `SELECT u.id, u.email, u.name, u.phone, r.name as role, u.is_active, u.xp, u.streak,
                        u.last_login, u.created_at
                        FROM users u JOIN roles r ON u.role_id = r.id WHERE 1=1`;
            const params = [];
            let pIdx = 1;

            if (role) {
                sql += ` AND r.name = $${pIdx++}`;
                params.push(role);
            }
            if (search) {
                sql += ` AND (u.name ILIKE $${pIdx} OR u.email ILIKE $${pIdx})`;
                params.push(`%${search}%`);
                pIdx++;
            }

            sql += ` ORDER BY u.created_at DESC LIMIT $${pIdx++} OFFSET $${pIdx}`;
            params.push(parseInt(limit), parseInt(offset));

            const result = await query(sql, params);

            // Count total
            const countResult = await query('SELECT COUNT(*) FROM users');
            const total = parseInt(countResult.rows[0].count);

            res.json({ users: result.rows, total, page: parseInt(page), limit: parseInt(limit) });
        } catch (err) {
            console.error('List users error:', err.message);
            res.status(500).json({ error: 'Failed to list users' });
        }
    },

    // POST /api/admin/users — Create admin/trainer account
    async createUser(req, res) {
        try {
            const { email, password, name, role } = req.body;

            // Check duplicate
            const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: 'Email already exists' });
            }

            const passwordHash = await hashUtil.hash(password);
            const roleResult = await query('SELECT id FROM roles WHERE name = $1', [role || 'admin']);
            const roleId = roleResult.rows[0]?.id || 2;

            const result = await query(
                `INSERT INTO users (email, password_hash, name, role_id, is_active, is_email_verified)
                 VALUES ($1, $2, $3, $4, true, true) RETURNING id, email, name`,
                [email, passwordHash, name, roleId]
            );

            await logger.log(req.user.id, `Created ${role || 'admin'} account: ${email}`, 'admin', { targetEmail: email }, req);

            res.status(201).json({ message: 'User created', user: result.rows[0] });
        } catch (err) {
            console.error('Create user error:', err.message);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },

    // PUT /api/admin/users/:id/role — Change user role
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const roleResult = await query('SELECT id FROM roles WHERE name = $1', [role]);
            if (roleResult.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            await query('UPDATE users SET role_id = $1, updated_at = NOW() WHERE id = $2', [roleResult.rows[0].id, id]);

            await logger.log(req.user.id, `Changed role to ${role} for user ${id}`, 'admin', { targetId: id, newRole: role }, req);

            res.json({ message: 'Role updated' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update role' });
        }
    },

    // DELETE /api/admin/users/:id — Remove user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Prevent self-deletion
            if (id === req.user.id) {
                return res.status(400).json({ error: 'Cannot delete your own account' });
            }

            await query('DELETE FROM users WHERE id = $1', [id]);
            await logger.log(req.user.id, `Deleted user ${id}`, 'admin', { targetId: id }, req);

            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },

    // GET /api/admin/stats — Dashboard stats
    async getStats(req, res) {
        try {
            const [users, members, trainers, activeMembers, revenue, recentAttendance] = await Promise.all([
                query('SELECT COUNT(*) FROM users'),
                query("SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'member'"),
                query("SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'trainer'"),
                query("SELECT COUNT(*) FROM users WHERE is_active = true AND last_login > NOW() - INTERVAL '30 days'"),
                query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE created_at > DATE_TRUNC('month', NOW())"),
                query("SELECT COUNT(*) FROM attendance WHERE check_in > NOW() - INTERVAL '7 days'"),
            ]);

            res.json({
                totalUsers: parseInt(users.rows[0].count),
                totalMembers: parseInt(members.rows[0].count),
                totalTrainers: parseInt(trainers.rows[0].count),
                activeMembers: parseInt(activeMembers.rows[0].count),
                monthlyRevenue: parseFloat(revenue.rows[0].total),
                weeklyAttendance: parseInt(recentAttendance.rows[0].count),
            });
        } catch (err) {
            res.status(500).json({ error: 'Failed to get stats' });
        }
    }
};
