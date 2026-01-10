import os
import requests
import logging
import json

logger = logging.getLogger(__name__)

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")

def send_message(to: str, body: str):
    """
    Sends a text message to a WhatsApp user.
    """
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("WHATSAPP_TOKEN or PHONE_NUMBER_ID not set")
        return

    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": body},
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        logger.info(f"Message sent to {to}: {body}")
        return response.json()['messages'][0]['id']
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send message: {e}")
        if e.response:
            logger.error(f"Response: {e.response.text}")
        return None

def process_webhook_payload(payload: dict):
    """
    Extracts relevant data from the webhook payload.
    Returns a tuple (sender_id, message_text) or (None, None).
    """
    try:
        entry = payload.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if messages:
            message = messages[0]
            sender_id = message.get("from")
            text_body = message.get("text", {}).get("body")
            
            if message.get("type") == "text":
                return sender_id, text_body
            
    except (IndexError, AttributeError) as e:
        logger.warning(f"Error parsing payload: {e}")
    
    return None, None

def send_template(to_phone: str, template_name: str, language_code: str = "en_US", components: list = None):
    """
    Sends a WhatsApp template message.
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
        "type": "template",
        "template": {
            "name": template_name,
            "language": {
                "code": language_code
            }
        }
    }

    if components:
        payload["template"]["components"] = components

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Template '{template_name}' sent to {to_phone}")
        return response.json()['messages'][0]['id']
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to send template: {e}")
        if e.response:
            logger.error(f"Response: {e.response.text}")
        return None
