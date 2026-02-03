-- Add opt_in and last_active_ts columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS opt_in BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_active_ts TIMESTAMPTZ DEFAULT NOW();

-- Create index on opt_in for faster querying
CREATE INDEX IF NOT EXISTS idx_users_opt_in ON users(opt_in);
