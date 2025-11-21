import os
import logging
from dotenv import load_dotenv
import db
import brain

# Load env vars
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_db():
    print("Testing DB...")
    try:
        inv_string = db.get_inventory_string()
        print(f"Inventory String: {inv_string}")
        
        lang = db.get_user_language("1234567890")
        print(f"User Language: {lang}")
    except Exception as e:
        print(f"DB Test Failed: {e}")

def test_brain():
    print("\nTesting Brain...")
    try:
        response = brain.generate_response("1234567890", "What is the price of Rohu?")
        print(f"Brain Response: {response}")
    except Exception as e:
        print(f"Brain Test Failed: {e}")

if __name__ == "__main__":
    test_db()
    test_brain()
