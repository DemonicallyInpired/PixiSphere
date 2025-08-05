-- Initialize Pixisphere Database
-- This script sets up the initial database structure and seed data

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert initial categories
INSERT INTO categories (name, description, is_active) VALUES
('wedding', 'Wedding photography and videography services', true),
('maternity', 'Maternity and pregnancy photography', true),
('portrait', 'Portrait and headshot photography', true),
('event', 'Event and party photography', true),
('commercial', 'Commercial and business photography', true),
('fashion', 'Fashion and lifestyle photography', true)
ON CONFLICT (name) DO NOTHING;

-- Insert initial locations
INSERT INTO locations (city, state, is_active) VALUES
('Mumbai', 'Maharashtra', true),
('Delhi', 'Delhi', true),
('Bangalore', 'Karnataka', true),
('Chennai', 'Tamil Nadu', true),
('Kolkata', 'West Bengal', true),
('Hyderabad', 'Telangana', true),
('Pune', 'Maharashtra', true),
('Ahmedabad', 'Gujarat', true),
('Jaipur', 'Rajasthan', true),
('Lucknow', 'Uttar Pradesh', true)
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password, role, first_name, last_name, city, is_active) VALUES
('admin@pixisphere.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'admin', 'System', 'Administrator', 'Mumbai', true)
ON CONFLICT (email) DO NOTHING;
