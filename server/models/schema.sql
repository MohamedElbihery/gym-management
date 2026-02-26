-- ============================================
-- GymForge PRO — PostgreSQL Database Schema
-- Full production schema with indices
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== GYMS ====================
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================== ROLES ====================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    permissions JSONB DEFAULT '[]'
);

INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system access, can manage all admins'),
    ('admin', 'Gym administrator, manages members and trainers'),
    ('trainer', 'Personal trainer, manages assigned members'),
    ('member', 'Gym member')
ON CONFLICT (name) DO NOTHING;

-- ==================== USERS ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    role_id INTEGER REFERENCES roles(id) DEFAULT 4,
    gym_id UUID REFERENCES gyms(id),
    -- Profile fields
    age INTEGER,
    gender VARCHAR(10),
    height DECIMAL(5,1),
    weight DECIMAL(5,1),
    goal VARCHAR(50),
    level VARCHAR(20) DEFAULT 'beginner',
    workout_days INTEGER DEFAULT 3,
    -- Gamification
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    -- Status
    is_active BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    last_workout TIMESTAMP,
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_gym ON users(gym_id);

-- ==================== MEMBERSHIPS ====================
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'monthly',
    price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    starts_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- ==================== ATTENDANCE ====================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gym_id UUID REFERENCES gyms(id),
    check_in TIMESTAMP DEFAULT NOW(),
    check_out TIMESTAMP,
    method VARCHAR(20) DEFAULT 'qr',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(check_in);

-- ==================== WORKOUT PLANS ====================
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL,
    generated_by VARCHAR(20) DEFAULT 'ai',
    is_active BOOLEAN DEFAULT true,
    week_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_plans_user ON workout_plans(user_id);

-- ==================== NUTRITION LOGS ====================
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_name VARCHAR(255),
    calories INTEGER,
    protein DECIMAL(6,1),
    carbs DECIMAL(6,1),
    fats DECIMAL(6,1),
    meal_type VARCHAR(20),
    logged_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nutrition_user ON nutrition_logs(user_id);
CREATE INDEX idx_nutrition_date ON nutrition_logs(logged_at);

-- ==================== PAYMENTS ====================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    membership_id UUID REFERENCES memberships(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_date ON payments(created_at);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type VARCHAR(20) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ==================== OTP VERIFICATIONS ====================
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) DEFAULT 'registration',
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- ==================== USER ACTIVITY LOGS ====================
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_category ON user_activity_logs(category);
CREATE INDEX idx_activity_date ON user_activity_logs(created_at);

-- ==================== CHAT HISTORY ====================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_user ON chat_history(user_id);
CREATE INDEX idx_chat_date ON chat_history(created_at);
