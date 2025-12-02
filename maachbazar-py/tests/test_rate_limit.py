import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import db

class TestRateLimit(unittest.TestCase):
    def setUp(self):
        # Mock Supabase client
        self.mock_supabase = MagicMock()
        db.supabase = self.mock_supabase

    def test_increment_address_update_count(self):
        # Mock get_address_update_count to return 1
        with patch('db.get_address_update_count', return_value=1):
            db.increment_address_update_count("1234567890")
            
            # Verify update called with 2
            self.mock_supabase.table.assert_called_with("users")
            self.mock_supabase.table().update.assert_called_with({"address_update_count": 2})
            self.mock_supabase.table().update().eq.assert_called_with("phone", "1234567890")

    def test_reset_address_update_count(self):
        db.reset_address_update_count("1234567890")
        
        # Verify update called with 0
        self.mock_supabase.table().update.assert_called_with({"address_update_count": 0})

    def test_get_address_update_count(self):
        # Setup mock return
        self.mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{'address_update_count': 2}]
        
        count = db.get_address_update_count("1234567890")
        self.assertEqual(count, 2)

if __name__ == '__main__':
    unittest.main()
