const { pool, query } = require('../config/db');
const hashUtil = require('../utils/hash');

async function seed() {
    console.log('🌱 Seeding demo data...');

    try {
        // 1. Get Roles
        const roleResult = await query('SELECT id, name FROM roles');
        const roles = {};
        roleResult.rows.forEach(r => roles[r.name] = r.id);

        // 2. Get Gym
        let gymResult = await query('SELECT id FROM gyms LIMIT 1');
        if (gymResult.rows.length === 0) {
            gymResult = await query(
                "INSERT INTO gyms (name, address, email) VALUES ('GymForge Pro HQ', '123 Fitness Street, Cairo', 'hq@gymforge.pro') RETURNING id"
            );
        }
        const gymId = gymResult.rows[0].id;

        const passwordHash = await hashUtil.hash('Demo123!');

        // 3. Create Demo Accounts
        const users = [
            { email: 'superadmin@demo.com', name: 'Zaid Al-Habibi', role: 'super_admin' },
            { email: 'owner@demo.com', name: 'Omar Mansour', role: 'admin' },
            { email: 'trainer@demo.com', name: 'Sarah Connor', role: 'trainer' },
            { email: 'member@demo.com', name: 'Ahmed Fawzy', role: 'member' }
        ];

        const userIds = {};

        for (const u of users) {
            const existing = await query('SELECT id FROM users WHERE email = $1', [u.email]);
            if (existing.rows.length === 0) {
                const res = await query(
                    `INSERT INTO users (email, password_hash, name, role_id, gym_id, is_active, is_email_verified, is_approved, language, level, goal)
                     VALUES ($1, $2, $3, $4, $5, true, true, true, $6, $7, $8) RETURNING id`,
                    [u.email, passwordHash, u.name, roles[u.role], gymId, u.role === 'member' ? 'en' : 'en', 'intermediate', 'muscle_gain']
                );
                userIds[u.role] = res.rows[0].id;
                console.log(`✅ Created ${u.role}: ${u.email}`);
            } else {
                userIds[u.role] = existing.rows[0].id;
            }
        }

        const memberId = userIds['member'];

        // 4. Populate Realistic Data for Member

        // Attendance (Last 30 days)
        console.log('📅 Seeding attendance...');
        for (let i = 0; i < 20; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const checkIn = new Date(date.setHours(17, 30, 0));
            const checkOut = new Date(date.setHours(19, 0, 0));
            await query(
                'INSERT INTO attendance (user_id, gym_id, check_in, check_out, method) VALUES ($1, $2, $3, $4, $5)',
                [memberId, gymId, checkIn, checkOut, 'qr']
            );
        }

        // Payments
        console.log('💰 Seeding payments...');
        const membershipRes = await query(
            "INSERT INTO memberships (user_id, plan_name, plan_type, price, status, starts_at, expires_at) VALUES ($1, 'Platinum Plus', 'monthly', 99.99, 'active', NOW() - INTERVAL '3 months', NOW() + INTERVAL '1 month') RETURNING id",
            [memberId]
        );
        const membershipId = membershipRes.rows[0].id;

        for (let i = 0; i < 3; i++) {
            await query(
                'INSERT INTO payments (user_id, membership_id, amount, currency, payment_method, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL $7)',
                [memberId, membershipId, 99.99, 'USD', 'Credit Card', 'completed', `${i} months`]
            );
        }

        // Workout Logs (AI Generated)
        console.log('🏋️ Seeding workout plans...');
        const planData = {
            title: "Advanced Hypertrophy Phase 1",
            days: [
                { name: "Day 1: Chest & Triceps", exercises: [{ name: "Bench Press", sets: 4, reps: 10 }, { name: "Skull Crushers", sets: 3, reps: 12 }] },
                { name: "Day 2: Back & Biceps", exercises: [{ name: "Pull Ups", sets: 4, reps: "Fail" }, { name: "Hammer Curls", sets: 3, reps: 15 }] }
            ]
        };
        await query(
            'INSERT INTO workout_plans (user_id, plan_data, generated_by, is_active) VALUES ($1, $2, $3, $4)',
            [memberId, JSON.stringify(planData), 'ai', true]
        );

        // Nutrition Logs
        console.log('🥘 Seeding nutrition...');
        const meals = [
            { name: "Oatmeal & Protein Shake", cal: 550, p: 45, c: 60, f: 12, type: 'breakfast' },
            { name: "Grilled Chicken & Rice", cal: 700, p: 55, c: 80, f: 15, type: 'lunch' },
            { name: "Salmon & Quinoa", cal: 650, p: 40, c: 50, f: 25, type: 'dinner' }
        ];
        for (let i = 0; i < 7; i++) {
            for (const meal of meals) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                await query(
                    'INSERT INTO nutrition_logs (user_id, meal_name, calories, protein, carbs, fats, meal_type, logged_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [memberId, meal.name, meal.cal, meal.p, meal.c, meal.f, meal.type, date]
                );
            }
        }

        // AI Chat History (Arabic & English)
        console.log('💬 Seeding chat history...');
        const chats = [
            { role: 'user', content: 'What should I eat before my workout?', lang: 'en' },
            { role: 'assistant', content: 'For pre-workout fuel, focus on easily digestible carbs and some protein. A banana with a tablespoon of almond butter or a small bowl of oats is perfect about 45-60 minutes before training.', lang: 'en' },
            { role: 'user', content: 'كيف يمكنني تقليل نسبة الدهون مع الحفاظ على العضلات؟', lang: 'ar' },
            { role: 'assistant', content: 'لتحقيق ذلك، يجب الحفاظ على عجز طفيف في السعرات الحرارية، مع زيادة تناول البروتين إلى 1.8-2.2 جرام لكل كجم من وزن الجسم، والتركيز على تدريبات المقاومة الثقيلة.', lang: 'ar' }
        ];
        for (const chat of chats) {
            await query(
                'INSERT INTO chat_history (user_id, role, content, language) VALUES ($1, $2, $3, $4)',
                [memberId, chat.role, chat.content, chat.lang]
            );
        }

        // 5. Leaderboard Data (More members)
        console.log('🏆 Seeding leaderboard data...');
        const otherMembers = [
            { name: 'John Doe', xp: 5400, streak: 12 },
            { name: 'Jane Smith', xp: 4200, streak: 8 },
            { name: 'Youssef Ali', xp: 3900, streak: 15 },
            { name: 'Fatima Zahra', xp: 3100, streak: 5 }
        ];
        for (const m of otherMembers) {
            const email = `${m.name.toLowerCase().replace(' ', '.')}@example.com`;
            const check = await query('SELECT id FROM users WHERE email = $1', [email]);
            if (check.rows.length === 0) {
                await query(
                    `INSERT INTO users (email, password_hash, name, role_id, gym_id, is_active, is_approved, xp, streak)
                     VALUES ($1, $2, $3, $4, $5, true, true, $6, $7)`,
                    [email, passwordHash, m.name, roles['member'], gymId, m.xp, m.streak]
                );
            }
        }

        console.log('\n🌟 Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    } finally {
        await pool.end();
    }
}

seed();
