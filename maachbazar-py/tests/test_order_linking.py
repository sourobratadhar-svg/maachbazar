import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import db

class TestOrderLinking(unittest.TestCase):
    def setUp(self):
        # Mock Supabase client
        self.mock_supabase = MagicMock()
        db.supabase = self.mock_supabase

    def test_check_order_exists_true(self):
        # Setup mock return
        self.mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{'id': 1}]
        
        exists = db.check_order_exists(123)
        self.assertTrue(exists)
        
        # Verify calls
        self.mock_supabase.table.assert_called_with("orders")
        self.mock_supabase.table().select.assert_called_with("id")
        self.mock_supabase.table().select().eq.assert_called_with("message_id", 123)

    def test_check_order_exists_false(self):
        self.mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        exists = db.check_order_exists(123)
        self.assertFalse(exists)

    def test_create_order_with_message_id(self):
        # Mock check_order_exists to return False
        with patch('db.check_order_exists', return_value=False):
            # Mock insert response
            self.mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{'id': 101}]
            
            items = [{'fish_name': 'Rohu', 'quantity': 1, 'price_per_kg': 200}]
            result = db.create_order("1234567890", items, "Test Address", message_id=555)
            
            self.assertEqual(result['status'], 'success')
            self.assertEqual(result['order_id'], 101)
            
            # Verify message status update was called
            # We expect multiple table calls: orders, order_items, messages
            # Check specifically for messages update
            # The calls are chained: table("messages").update(...).eq(...).execute()
            
            # We can check if table was called with "messages"
            self.mock_supabase.table.assert_any_call("messages")
            
            # More specific check is hard with chained mocks without complex setup, 
            # but we can verify the flow didn't error.

    def test_create_order_duplicate_message_id(self):
        # Mock check_order_exists to return True
        with patch('db.check_order_exists', return_value=True):
            items = [{'fish_name': 'Rohu', 'quantity': 1, 'price_per_kg': 200}]
            result = db.create_order("1234567890", items, "Test Address", message_id=555)
            
            self.assertIn("error", result)
            self.assertEqual(result['error'], "Order already placed for this message")

if __name__ == '__main__':
    unittest.main()
