import sys
import os
import hmac
import hashlib

# Add parent directory to path so we can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import verify_signature

# Mock environment variable for the test
# We need to set this before importing main normally, but since we imported a function, 
# main might have already read os.environ.
# Let's override the module variable directly if needed, or rely on correct behavior.
import main
main.APP_SECRET = "test_secret"

def test_signature_verification():
    secret = "test_secret"
    body = b'{"hello": "world"}'
    
    # Calculate expected signature
    expected_sig = hmac.new(
        secret.encode("utf-8"),
        body,
        hashlib.sha256
    ).hexdigest()
    
    valid_header = f"sha256={expected_sig}"
    
    # Test 1: Valid signature
    if verify_signature(body, valid_header):
        print("✅ Test 1 Passed: Valid signature verified")
    else:
        print("❌ Test 1 Failed: Valid signature rejected")
        
    # Test 2: Invalid signature
    invalid_header = "sha256=invalidSignature12345"
    if not verify_signature(body, invalid_header):
         print("✅ Test 2 Passed: Invalid signature rejected")
    else:
         print("❌ Test 2 Failed: Invalid signature accepted")
         
    # Test 3: Missing signature
    if not verify_signature(body, None):
        print("✅ Test 3 Passed: Missing signature rejected")
    else:
        print("❌ Test 3 Failed: Missing signature accepted")

if __name__ == "__main__":
    test_signature_verification()
