-- Migration: Order Linking Logic

-- 1. Add order_placed and whatsapp_message_id columns to messages table
-- order_placed: tracks if an order has been created.
-- whatsapp_message_id: stores the external WhatsApp Message ID (wamid) to link button clicks.
ALTER TABLE messages 
ADD COLUMN order_placed BOOLEAN DEFAULT FALSE,
ADD COLUMN whatsapp_message_id TEXT UNIQUE;

-- 2. Add message_id and order_created_at to orders table
-- message_id links the order back to the specific message that triggered it.
-- order_created_at stores the exact timestamp of the button click.
ALTER TABLE orders 
ADD COLUMN message_id BIGINT REFERENCES messages(id),
ADD COLUMN order_created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Add Unique Constraint to ensure 1-to-1 relationship
-- This ensures that one message cannot generate multiple orders.
ALTER TABLE orders 
ADD CONSTRAINT unique_message_order UNIQUE (message_id);

-- 4. Create an index on message_id for faster lookups
CREATE INDEX idx_orders_message_id ON orders(message_id);
