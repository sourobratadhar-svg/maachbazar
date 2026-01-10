
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
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
WABA_ID = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID")

def register_template():
    waba_id = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID")
    if not waba_id:
        print("Error: WHATSAPP_BUSINESS_ACCOUNT_ID is not set in .env")
        return

    url = f"https://graph.facebook.com/v20.0/{waba_id}/message_templates"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "name": "order_update",
        "category": "UTILITY",
        "language": "en",
        "components": [
            {
                "type": "BODY",
                "text": "Your order {{1}} is confirmed and will arrive by {{2}}."
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print("Template registered successfully!")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.RequestException as e:
        print(f"Failed to register template: {e}")
        if e.response:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    if not WHATSAPP_TOKEN:
        print("Error: WHATSAPP_TOKEN not set")
    else:
        register_template()
