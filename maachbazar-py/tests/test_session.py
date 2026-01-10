import sys
import os
import time

# Add parent directory to path so we can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import update_session, session_active, sessions, SESSION_EXPIRY

def test_session_logic():
    user_id = "test_user"
    
    # Test 1: Session not active initially
    if not session_active(user_id):
        print("✅ Test 1 Passed: Session initially inactive")
    else:
        print("❌ Test 1 Failed: Session initially active")

    # Test 2: Update session (Session starts)
    update_session(user_id)
    if session_active(user_id):
        print("✅ Test 2 Passed: Session active after update")
    else:
        print("❌ Test 2 Failed: Session inactive after update")
        
    # Test 3: Manual expiration
    # Simulate time passing by modifying the stored timestamp
    sessions[user_id] = int(time.time()) - (SESSION_EXPIRY + 10)
    
    if not session_active(user_id):
        print("✅ Test 3 Passed: Session expired correctly")
    else:
        print("❌ Test 3 Failed: Session still active after expiry")

if __name__ == "__main__":
    test_session_logic()
