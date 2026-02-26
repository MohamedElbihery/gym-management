const crypto = require('crypto');
const { query } = require('../config/db');

module.exports = {
    generate() {
        return crypto.randomInt(100000, 999999).toString();
    },

    async create(email, purpose = 'registration') {
        // Rate limit: max 3 OTPs per email per hour
        const recentResult = await query(
            `SELECT COUNT(*) as cnt FROM otp_verifications 
             WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
            [email]
        );
        if (parseInt(recentResult.rows[0].cnt) >= 3) {
            throw new Error('Too many OTP requests. Please wait before trying again.');
        }

        // Invalidate previous OTPs
        await query(
            `UPDATE otp_verifications SET is_used = true WHERE email = $1 AND is_used = false`,
            [email]
        );

        const code = this.generate();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await query(
            `INSERT INTO otp_verifications (email, otp_code, purpose, expires_at)
             VALUES ($1, $2, $3, $4)`,
            [email, code, purpose, expiresAt]
        );

        return code;
    },

    async verify(email, code) {
        const result = await query(
            `SELECT * FROM otp_verifications 
             WHERE email = $1 AND otp_code = $2 AND is_used = false AND expires_at > NOW()
             ORDER BY created_at DESC LIMIT 1`,
            [email, code]
        );

        if (result.rows.length === 0) {
            // Increment attempt counter
            await query(
                `UPDATE otp_verifications SET attempts = attempts + 1 
                 WHERE email = $1 AND is_used = false`,
                [email]
            );
            return false;
        }

        // Mark as used
        await query(
            `UPDATE otp_verifications SET is_used = true WHERE id = $1`,
            [result.rows[0].id]
        );

        return true;
    },

    async cleanup() {
        await query(`DELETE FROM otp_verifications WHERE expires_at < NOW() - INTERVAL '1 hour'`);
    }
};
