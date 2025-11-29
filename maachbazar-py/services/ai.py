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

def get_system_instruction(user_address: str = None):
    """
    Dynamically generates the system instruction with current prices and user context.
    """
    inventory = db.get_inventory()
    
    price_list = ""
    if inventory:
        for item in inventory:
            price_list += f"- {item['name']}: ₹{item['price']}/kg\n"
    else:
        price_list = "Inventory unavailable. Please check back later."

    address_context = f"User's Address: {user_address}" if user_address else "User's Address: Not provided yet."

    return f"""
You are a polite and friendly Bengali fishmonger at Maachbazar.
You speak a mix of English, Hindi, and Bengali (Hinglish).

Your goal is to help customers place orders following this STRICT flow:
1. **Price List**: Share the daily price list if asked.
2. **Selection**: Ask what fish and quantity they want.
3. **Suggestions**: Suggest other available fish if appropriate.
4. **Address**: Ask for their delivery address. (Current: {address_context})
   - If you already have the address, confirm if they want to use it.
5. **Bill**: Calculate the total bill and show it to them.
6. **Confirmation**: Ask "Do you want to confirm this order?"
7. **Order Placement**: ONLY call the `place_order` tool after the user explicitly types "confirm" or says "yes" to the bill.

**Daily Price List**:
{price_list}

**Rules**:
- Do NOT place an order without an address.
- Do NOT place an order without explicit confirmation after showing the bill.
- Keep responses concise (under 50 words).
"""

model = genai.GenerativeModel(
    model_name="gemini-flash-latest"
)


# Tool Definition
place_order_tool = {
    "function_declarations": [
        {
            "name": "place_order",
            "description": "Places an order. Use ONLY after user confirms the bill and address.",
            "parameters": {
                "type": "OBJECT",
                "properties": {
                    "items": {
                        "type": "ARRAY",
                        "description": "List of items to order",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "fish_name": {"type": "STRING", "description": "Name of the fish"},
                                "quantity": {"type": "NUMBER", "description": "Quantity in kg"},
                                "price_per_kg": {"type": "INTEGER", "description": "Price per kg"}
                            },
                            "required": ["fish_name", "quantity", "price_per_kg"]
                        }
                    },
                    "address": {
                        "type": "STRING",
                        "description": "Delivery address of the user"
                    }
                },
                "required": ["items", "address"]
            }
        }
    ]
}

def generate_response(prompt: str, user_phone: str = None, user_address: str = None) -> str:
    """
    Generates a response from Gemini based on the user's prompt.
    Supports function calling for placing orders.
    """
    if not GEMINI_API_KEY:
        return "I'm sorry, my brain is currently offline (API Key missing). 😵"

    try:
        current_instruction = get_system_instruction(user_address)
        
        # Initialize model with tools
        dynamic_model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=current_instruction,
            tools=[place_order_tool]
        )
        
        # Start a chat session to handle function calls naturally
        # chat = dynamic_model.start_chat(enable_automatic_function_calling=True)
        
        # Manual approach:
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
                
                address = fc.args.get("address")
                
                # Execute DB function
                result = db.create_order(user_phone, items_data, address)
                
                if "error" in result:
                    return f"Sorry, I couldn't place the order. Error: {result['error']}"
                
                return f"Order placed successfully! Order ID: #{result['order_id']}. Total: ₹{result['total_price']}. We will deliver to: {address}. Thank you!"

        return response.text
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return "Aare dada, ektu problem hocche. Please try again later. 😓"

