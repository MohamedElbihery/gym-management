const { query } = require('../config/db');

module.exports = {
    async log(userId, action, category, details = {}, req = null) {
        try {
            await query(
                `INSERT INTO user_activity_logs (user_id, action, category, details, ip_address, user_agent)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    userId,
                    action,
                    category,
                    JSON.stringify(details),
                    req?.ip || null,
                    req?.get('user-agent') || null,
                ]
            );
        } catch (err) {
            console.error('Activity log error:', err.message);
        }
    }
};
