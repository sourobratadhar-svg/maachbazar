-- Migration: Change Delivery Address Workflow

-- 1. Add conversation_state to users table
-- This tracks the user's current interaction state (e.g., 'AWAITING_ADDRESS').
ALTER TABLE users 
ADD COLUMN conversation_state TEXT;

-- 2. Add delivery_address to orders table
-- This stores the specific address for an order, separate from the user's profile address.
-- Using IF NOT EXISTS to be safe, though previous code suggested it might be missing.
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_address TEXT;
