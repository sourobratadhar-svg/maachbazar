-- Migration: Address Change Rate Limiting

-- 1. Add address_update_count to users table
-- This tracks how many times a user has updated their address for the current order flow.
-- Default is 0. It resets when an order is confirmed.
ALTER TABLE users 
ADD COLUMN address_update_count INTEGER DEFAULT 0;
