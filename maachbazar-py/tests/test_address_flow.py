import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import db

class TestAddressFlow(unittest.TestCase):
    def setUp(self):
        # Mock Supabase client
        self.mock_supabase = MagicMock()
        db.supabase = self.mock_supabase

    def test_update_user_state(self):
        db.update_user_state("1234567890", "AWAITING_ADDRESS")
        
        # Verify call
        self.mock_supabase.table.assert_called_with("users")
        self.mock_supabase.table().update.assert_called_with({"conversation_state": "AWAITING_ADDRESS"})
        self.mock_supabase.table().update().eq.assert_called_with("phone", "1234567890")

    def test_get_user_state(self):
        # Setup mock return
        self.mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{'conversation_state': 'AWAITING_ADDRESS'}]
        
        state = db.get_user_state("1234567890")
        self.assertEqual(state, "AWAITING_ADDRESS")

    def test_get_user_state_none(self):
        self.mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{'conversation_state': None}]
        state = db.get_user_state("1234567890")
        self.assertIsNone(state)

if __name__ == '__main__':
    unittest.main()
