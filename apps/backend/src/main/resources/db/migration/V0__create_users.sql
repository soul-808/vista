-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Insert sample users if they don't already exist
INSERT INTO users (name, email, role, username, password)
VALUES 
    ('Sarah Johnson', 'sarah.johnson@company.com', 'COMPLIANCE_OFFICER', 'sjohnson', '$2a$10$xzxD5K8UW3LBNxljb5HOwe.oL5qQ6iMHzCmYYzxKHgwDi7.JlZP8q'),
    ('James Smith', 'james.smith@company.com', 'COMPLIANCE_ANALYST', 'jsmith', '$2a$10$xzxD5K8UW3LBNxljb5HOwe.oL5qQ6iMHzCmYYzxKHgwDi7.JlZP8q'),
    ('Robert Chen', 'robert.chen@company.com', 'COMPLIANCE_MANAGER', 'rchen', '$2a$10$xzxD5K8UW3LBNxljb5HOwe.oL5qQ6iMHzCmYYzxKHgwDi7.JlZP8q')
ON CONFLICT (username) DO NOTHING; 