-- PostgreSQL initialization
-- The database itself is created by the POSTGRES_DB environment variable

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    karma INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create flags table
CREATE TABLE IF NOT EXISTS flags (
    id SERIAL PRIMARY KEY,
    flag_id VARCHAR(255) UNIQUE NOT NULL,
    level_id VARCHAR(255) NOT NULL,
    points INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_flags table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_flags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    flag_id INTEGER REFERENCES flags(id) ON DELETE CASCADE,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, flag_id)
);

-- Create choices table
CREATE TABLE IF NOT EXISTS choices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    level_id VARCHAR(255) NOT NULL,
    choice_id VARCHAR(255) NOT NULL,
    karma_change INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial flags for each level
INSERT INTO flags (flag_id, level_id, points) VALUES
    ('flag_alpha', 'alpha', 100),
    ('flag_beta', 'beta', 100),
    ('flag_gamma', 'gamma', 150),
    ('flag_delta', 'delta', 150),
    ('flag_sigma', 'sigma', 150),
    ('flag_theta', 'theta', 150),
    ('flag_zeta', 'zeta', 200),
    ('flag_sigma-2', 'sigma-2', 200),
    ('flag_omega', 'omega', 250)
ON CONFLICT (flag_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_flags_user_id ON user_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_choices_user_id ON choices(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);