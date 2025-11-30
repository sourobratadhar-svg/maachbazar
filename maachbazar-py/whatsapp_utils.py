import os
import requests
import logging
import json

logger = logging.getLogger(__name__)

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")

def send_language_menu(to_phone: str):
    """
    Sends an interactive list message to select language.
    """
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("WHATSAPP_TOKEN or PHONE_NUMBER_ID not set")
        return

    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "Welcome to Maachbazar! 🐟"
            },
            "body": {
                "text": "Please select your preferred language / Apni kon bhasha pochondo koren?"
            },
            "footer": {
                "text": "Maachbazar Bot"
            },
            "action": {
                "button": "Select Language",
                "sections": [
                    {
                        "title": "Languages",
                        "rows": [
                            {
                                "id": "lang_en",
                                "title": "English",
                                "description": "English"
                            },
                            {
                                "id": "lang_bn",
                                "title": "Bangla",
                                "description": "বাংলা"
                            },
                            {
                                "id": "lang_hi",
                                "title": "Hinglish",
                                "description": "Hindi + English"
                            }
                        ]
                    }
                ]
            }
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Language menu sent to {to_phone}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send language menu: {e}")
        if e.response:
            logger.error(f"Response: {e.response.text}")

def send_interactive_button(to_phone: str, text_body: str, buttons: list):
    """
    Sends an interactive button message.
    buttons: list of dicts [{'id': 'btn_1', 'title': 'Button 1'}]
    """
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("WHATSAPP_TOKEN or PHONE_NUMBER_ID not set")
        return

    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    
    # Construct button rows
    button_rows = []
    for btn in buttons:
        button_rows.append({
            "type": "reply",
            "reply": {
                "id": btn["id"],
                "title": btn["title"]
            }
        })

    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": text_body
            },
            "action": {
                "buttons": button_rows
            }
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Interactive button sent to {to_phone}: {text_body}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send interactive button: {e}")
        if e.response:
            logger.error(f"Response: {e.response.text}")
