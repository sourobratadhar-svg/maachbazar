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


# Tool Definition
place_order_tool = {
    "function_declarations": [
        {
            "name": "place_order",
            "description": "Places an order for fish. Use this when the user explicitly confirms they want to buy.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "items": {
                        "type": "ARRAY",
                        "description": "List of items to order",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "fish_name": {"type": "STRING", "description": "Name of the fish (e.g., Rohu, Katla)"},
                                "quantity": {"type": "NUMBER", "description": "Quantity in kg"},
                                "price_per_kg": {"type": "INTEGER", "description": "Price per kg at the time of order"}
                            },
                            "required": ["fish_name", "quantity", "price_per_kg"]
                        }
                    }
                },
                "required": ["items"]
            }
        }
    ]
}

def generate_response(prompt: str, user_phone: str = None) -> str:
    """
    Generates a response from Gemini based on the user's prompt.
    Supports function calling for placing orders.
    """
    if not GEMINI_API_KEY:
        return "I'm sorry, my brain is currently offline (API Key missing). 😵"

    try:
        current_instruction = get_system_instruction()
        
        # Initialize model with tools
        dynamic_model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=current_instruction,
            tools=[place_order_tool]
        )
        
        # Start a chat session to handle function calls naturally
        chat = dynamic_model.start_chat(enable_automatic_function_calling=True)
        
        # We need to manually handle the function execution if we want to use our db.create_order
        # But genai's automatic function calling usually requires the function to be passed in the tools list as a callable
        # OR we handle the response parts.
        
        # Let's try the manual approach for better control:
        # 1. Generate content with tools config
        response = dynamic_model.generate_content(
            prompt,
            tools=[place_order_tool],
            tool_config={'function_calling_config': {'mode': 'AUTO'}}
        )
        
        # 2. Check for function call
        if not response.candidates:
            logger.error(f"Gemini returned no candidates. Response: {response}")
            return "I'm sorry, I couldn't generate a response (No candidates)."

        candidate = response.candidates[0]
        if not candidate.content.parts:
            logger.error(f"Gemini candidate has no parts. Candidate: {candidate}")
            return "I'm sorry, I couldn't generate a response (No parts)."

        part = candidate.content.parts[0]
        
        if part.function_call:
            fc = part.function_call
            if fc.name == "place_order":
                if not user_phone:
                    return "I need your phone number to place an order. (System Error: Phone not passed)"
                
                # Extract args
                items_data = []
                for item in fc.args["items"]:
                    items_data.append({
                        "fish_name": item["fish_name"],
                        "quantity": item["quantity"],
                        "price_per_kg": item["price_per_kg"]
                    })
                
                # Execute DB function
                result = db.create_order(user_phone, items_data)
                
                if "error" in result:
                    return f"Sorry, I couldn't place the order. Error: {result['error']}"
                
                return f"Order placed successfully! Order ID: #{result['order_id']}. Total: ₹{result['total_price']}. We will contact you shortly for delivery."

        return response.text
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return "Aare dada, ektu problem hocche. Please try again later. 😓"

