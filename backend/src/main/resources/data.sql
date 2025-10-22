-- MelvinBank Zambia - Database Initialization Script
-- This script inserts sample data for demonstration purposes

-- Note: This will only run with H2 database in test profile
-- For production, data should be loaded through proper migration tools

-- Sample data is only inserted if tables are empty

-- Insert sample user (password is hashed for 'Test123!')
INSERT INTO users (first_name, last_name, email, password, phone_number, address, two_fa_enabled, enabled, account_non_expired, account_non_locked, credentials_non_expired, role, created_at, updated_at)
SELECT 'Demo', 'User', 'demo@melvinbank.zm', '$2a$12$LQv3c1yqBFVydhgzf4/YMelFFWJfH5sQGP7C5DhJwKKOi3Xvp7.8.', '+260971234567', 'Lusaka, Zambia', false, true, true, true, true, 'USER', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@melvinbank.zm');

-- Insert sample accounts for demo user
INSERT INTO accounts (account_number, account_type, balance, account_name, description, active, user_id, created_at, updated_at)
SELECT 'MB1234567890', 'CHECKING', 25000.00, 'Primary Checking', 'Main checking account', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = 'MB1234567890');

INSERT INTO accounts (account_number, account_type, balance, account_name, description, active, user_id, created_at, updated_at)
SELECT 'MB1234567891', 'SAVINGS', 50000.00, 'Emergency Savings', 'Emergency fund savings account', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = 'MB1234567891');

INSERT INTO accounts (account_number, account_type, balance, account_name, description, active, credit_limit, user_id, created_at, updated_at)
SELECT 'MB1234567892', 'CREDIT_CARD', 5000.00, 'MelvinCard Platinum', 'Platinum credit card', true, 20000.00, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = 'MB1234567892');

-- Insert sample transactions
INSERT INTO transactions (account_id, amount, type, description, category, merchant, reference_number, status, balance_after, transaction_date, created_at)
SELECT 
    (SELECT id FROM accounts WHERE account_number = 'MB1234567890'), 
    2500.00, 'DEPOSIT', 'Salary deposit', 'Income', 'MelvinBank Zambia', 'TXN001', 'COMPLETED', 25000.00, DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, NOW())
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_number = 'TXN001');

INSERT INTO transactions (account_id, amount, type, description, category, merchant, reference_number, status, balance_after, transaction_date, created_at)
SELECT 
    (SELECT id FROM accounts WHERE account_number = 'MB1234567890'), 
    450.00, 'WITHDRAWAL', 'ATM withdrawal', 'Cash', 'MelvinBank ATM', 'TXN002', 'COMPLETED', 24550.00, DATEADD('HOUR', -2, NOW()), DATEADD('HOUR', -2, NOW())
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_number = 'TXN002');

INSERT INTO transactions (account_id, amount, type, description, category, merchant, reference_number, status, balance_after, transaction_date, created_at)
SELECT 
    (SELECT id FROM accounts WHERE account_number = 'MB1234567890'), 
    1250.00, 'PAYMENT', 'Grocery shopping', 'Food & Dining', 'Shoprite', 'TXN003', 'COMPLETED', 23300.00, DATEADD('HOUR', -4, NOW()), DATEADD('HOUR', -4, NOW())
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_number = 'TXN003');

INSERT INTO transactions (account_id, amount, type, description, category, merchant, reference_number, status, balance_after, transaction_date, created_at)
SELECT 
    (SELECT id FROM accounts WHERE account_number = 'MB1234567891'), 
    5000.00, 'DEPOSIT', 'Monthly savings', 'Savings', 'Internal Transfer', 'TXN004', 'COMPLETED', 50000.00, DATEADD('DAY', -1, NOW()), DATEADD('DAY', -1, NOW())
WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_number = 'TXN004');

-- Insert sample bills
INSERT INTO bills (payee_name, amount, due_date, status, category, description, recurring, recurrence_frequency, auto_pay, user_id, created_at, updated_at)
SELECT 'ZESCO', 850.00, DATEADD('DAY', 5, CURDATE()), 'PENDING', 'Utilities', 'Monthly electricity bill', true, 'MONTHLY', false, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bills WHERE payee_name = 'ZESCO' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

INSERT INTO bills (payee_name, amount, due_date, status, category, description, recurring, recurrence_frequency, auto_pay, user_id, created_at, updated_at)
SELECT 'Lusaka Water', 320.00, DATEADD('DAY', 8, CURDATE()), 'PENDING', 'Utilities', 'Monthly water bill', true, 'MONTHLY', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bills WHERE payee_name = 'Lusaka Water' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

INSERT INTO bills (payee_name, amount, due_date, status, category, description, recurring, recurrence_frequency, auto_pay, user_id, created_at, updated_at)
SELECT 'Airtel Zambia', 150.00, DATEADD('DAY', 2, CURDATE()), 'PENDING', 'Telecom', 'Mobile phone bill', true, 'MONTHLY', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bills WHERE payee_name = 'Airtel Zambia' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

-- Insert sample budgets
INSERT INTO budgets (category, budget_limit, current_spent, start_date, end_date, period, alert_enabled, alert_threshold, description, active, user_id, created_at, updated_at)
SELECT 'Food & Dining', 3000.00, 1250.00, DATE_TRUNC('MONTH', NOW()), DATEADD('DAY', -1, DATE_TRUNC('MONTH', DATEADD('MONTH', 1, NOW()))), 'MONTHLY', true, 80.00, 'Monthly food and dining budget', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM budgets WHERE category = 'Food & Dining' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

INSERT INTO budgets (category, budget_limit, current_spent, start_date, end_date, period, alert_enabled, alert_threshold, description, active, user_id, created_at, updated_at)
SELECT 'Utilities', 1500.00, 850.00, DATE_TRUNC('MONTH', NOW()), DATEADD('DAY', -1, DATE_TRUNC('MONTH', DATEADD('MONTH', 1, NOW()))), 'MONTHLY', true, 90.00, 'Monthly utilities budget', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM budgets WHERE category = 'Utilities' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

INSERT INTO budgets (category, budget_limit, current_spent, start_date, end_date, period, alert_enabled, alert_threshold, description, active, user_id, created_at, updated_at)
SELECT 'Transportation', 2000.00, 450.00, DATE_TRUNC('MONTH', NOW()), DATEADD('DAY', -1, DATE_TRUNC('MONTH', DATEADD('MONTH', 1, NOW()))), 'MONTHLY', true, 75.00, 'Monthly transportation budget', true, (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM budgets WHERE category = 'Transportation' AND user_id = (SELECT id FROM users WHERE email = 'demo@melvinbank.zm'));

-- Insert sample admin user (optional)
INSERT INTO users (first_name, last_name, email, password, phone_number, address, two_fa_enabled, enabled, account_non_expired, account_non_locked, credentials_non_expired, role, created_at, updated_at)
SELECT 'Admin', 'User', 'admin@melvinbank.zm', '$2a$12$LQv3c1yqBFVydhgzf4/YMelFFWJfH5sQGP7C5DhJwKKOi3Xvp7.8.', '+260977777777', 'MelvinBank HQ, Lusaka', true, true, true, true, true, 'ADMIN', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@melvinbank.zm');

COMMIT;