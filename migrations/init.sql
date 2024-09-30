-- Initial migration script

-- Users Table 

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    token INT DEFAULT 6, 
    subscription_status VARCHAR(50) DEFAULT 'inactive',  -- See if this issues problems in the future
    next_token_reset TIMESTAMP, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plans Table

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10, 2),
    tokens_per_day INT,
    is_unlimited BOOLEAN DEFAULT false
);

-- Insert the plans 

INSERT INTO plans (name, price, tokens_per_day, is_unlimited) 
VALUES 
('free', 0.00, 6, false),
('standard', 19.99, 100, false),
('premium', 29.99, NULL, true)
ON CONFLICT DO NOTHING;