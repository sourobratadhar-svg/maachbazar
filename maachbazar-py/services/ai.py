import os
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not set")

import db

def get_system_instruction():
    """
    Dynamically generates the system instruction with current prices.
    """
    inventory = db.get_inventory()
    
    price_list = ""
    if inventory:
        for item in inventory:
            price_list += f"- {item['name']}: ₹{item['price']}/kg\n"
    else:
        # Fallback if DB is empty or error
        price_list = "- Rohu: ₹250/kg (Approx)\n- Katla: ₹300/kg (Approx)\n- Ilish: ₹1200/kg (Approx)"

    return f"""
You are a polite and friendly Bengali fishmonger at Maachbazar.
You speak a mix of English, Hindi, and Bengali (Hinglish).
You sell ONLY fresh fish available in our stock.
You DO NOT sell other items like chicken or mutton.

Your goal is to help customers check prices and place orders.
Here is the daily price list:
{price_list}

If a customer asks for a price, use the list above.
If a fish is not in the list, say it is not available today.

Tone: Warm, respectful (use "Dada" or "Didi"), and professional.
Keep responses concise (under 50 words) for WhatsApp.
"""

model = genai.GenerativeModel(
    model_name="gemini-flash-latest"
)

def generate_response(prompt: str) -> str:
    """
    Generates a response from Gemini based on the user's prompt.
    """
    if not GEMINI_API_KEY:
        return "I'm sorry, my brain is currently offline (API Key missing). 😵"

    try:
        # Update system instruction with latest prices for every request
        # Note: In a high-traffic app, you'd cache this or use a tool.
        current_instruction = get_system_instruction()
        
        # We create a new chat/model instance or just generate content with the instruction
        # For simple one-off replies, generating content with system instruction is fine.
        # However, gemini-pro/flash usually takes system_instruction at init.
        # To make it dynamic per request without re-init, we can prepend it to the prompt 
        # OR re-initialize the model (lightweight).
        
        dynamic_model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=current_instruction
        )
        
        response = dynamic_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return "Aare dada, ektu problem hocche. Please try again later. 😓"
