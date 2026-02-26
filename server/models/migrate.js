const fs = require('fs');
const path = require('path');
const hashUtil = require('../utils/hash');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
    console.log('🔄 Running database migration...');

    const isHostedDB = !!process.env.DATABASE_URL;

    // Only attempt to create DB locally — hosted DBs (Supabase) already exist
    if (!isHostedDB) {
        const { Pool } = require('pg');
        const adminPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            database: 'postgres',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        });

        try {
            const dbName = process.env.DB_NAME || 'gymforge_pro';
            const dbCheck = await adminPool.query(
                `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
            );
            if (dbCheck.rows.length === 0) {
                await adminPool.query(`CREATE DATABASE ${dbName}`);
                console.log(`✅ Database "${dbName}" created`);
            } else {
                console.log(`✅ Database "${dbName}" exists`);
            }
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.error('⚠️ DB creation note:', err.message);
            }
        } finally {
            await adminPool.end();
        }
    } else {
        console.log('☁️  Using hosted database (DATABASE_URL detected)');
    }

    // Now connect to our database and run schema
    const { pool, query } = require('../config/db');

    try {
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schemaSQL);
        console.log('✅ Schema applied');

        // Seed Super Admin
        const superEmail = process.env.SUPER_ADMIN_EMAIL;
        const superPass = process.env.SUPER_ADMIN_PASSWORD;

        if (!superEmail || !superPass) {
            console.log('⚠️  SUPER_ADMIN_EMAIL/PASSWORD not set — skipping admin seed');
        } else {
            const existing = await query('SELECT id FROM users WHERE email = $1', [superEmail]);
            if (existing.rows.length === 0) {
                const passwordHash = await hashUtil.hash(superPass);
                const roleResult = await query("SELECT id FROM roles WHERE name = 'super_admin'");
                const roleId = roleResult.rows[0]?.id || 1;

                await query(
                    `INSERT INTO users (email, password_hash, name, role_id, is_active, is_email_verified)
                     VALUES ($1, $2, $3, $4, true, true)`,
                    [superEmail, passwordHash, 'Super Admin', roleId]
                );
                console.log(`✅ Super Admin seeded: ${superEmail}`);
            } else {
                console.log(`✅ Super Admin exists: ${superEmail}`);
            }
        }

        // Seed a default gym
        const gymCheck = await query('SELECT id FROM gyms LIMIT 1');
        if (gymCheck.rows.length === 0) {
            await query(
                `INSERT INTO gyms (name, address, email) VALUES ($1, $2, $3)`,
                ['GymForge Pro HQ', '123 Fitness Street', 'info@gymforge.pro']
            );
            console.log('✅ Default gym seeded');
        }

        console.log('✅ Migration complete\n');
    } catch (err) {
        console.error('❌ Migration error:', err.message);
        throw err;
    }
}

module.exports = migrate;

// Run directly: node models/migrate.js
if (require.main === module) {
    migrate().then(() => process.exit(0)).catch(() => process.exit(1));
}
