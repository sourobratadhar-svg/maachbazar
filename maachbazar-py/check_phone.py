import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fallback: Try loading from sibling directory `maachbazar/.env` if not found
if not os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID"):
    sibling_env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "maachbazar", ".env")
    if os.path.exists(sibling_env):
        print(f"Loading env from: {sibling_env}")
        load_dotenv(sibling_env)

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
WABA_ID = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID")

def check_phone_numbers():
    if not WABA_ID:
        print("Error: WHATSAPP_BUSINESS_ACCOUNT_ID is not set")
        return

    url = f"https://graph.facebook.com/v17.0/{WABA_ID}/phone_numbers"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        print("Phone Numbers:")
        print(json.dumps(data, indent=2))
        
        if not data.get("data"):
            print("WARNING: No phone numbers found!")
        else:
            print(f"Found {len(data['data'])} phone number(s).")
            
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch phone numbers: {e}")
        if e.response:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    check_phone_numbers()
