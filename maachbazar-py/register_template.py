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

def register_daily_template():
    if not WABA_ID:
        print("Error: WHATSAPP_BUSINESS_ACCOUNT_ID is not set in .env")
        return

    url = f"https://graph.facebook.com/v17.0/{WABA_ID}/message_templates"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Template: fresh_stock_alert
    # Text:
    # Hello {{1}}, good morning! 🌞
    # Today's fresh stock has arrived at Maachbazar.
    # Reply with *order* to place an order or *menu* to view the list.

    payload = {
        "name": "maachbazar_intro_v2",
        "category": "MARKETING",
        "language": "en",
        "components": [
            {
                "type": "BODY",
                "text": "Hello {{1}}! This is Maachbazar.\n\nFresh fish & poultry delivered to your door.\nTap below to view our items."
            },
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "QUICK_REPLY",
                        "text": "View Items"
                    }
                ]
            }
        ]
    }
    
    print(f"Registering template '{payload['name']}' to WABA {WABA_ID}...")
    
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
        register_daily_template()
