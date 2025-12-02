import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = None

if url and key:
    try:
        supabase = create_client(url, key)
    except Exception as e:
        logger.error(f"Failed to initialize Supabase: {e}")

def get_inventory():
    """
    Fetches inventory from Supabase.
    Returns a list of dicts: [{'name': 'Rohu', 'price': 250}, ...]
    """
    if not supabase:
        logger.warning("Supabase not configured, returning empty inventory")
        return []
    
    try:
        response = supabase.table("inventory").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching inventory: {e}")
        return []

def update_price(fish_name: str, new_price: int):
    """
    Updates the price of a specific fish in Supabase.
    """
    if not supabase:
        return {"error": "Supabase not configured"}

    try:
        response = supabase.table("inventory").update({"price": new_price}).eq("name", fish_name).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating price: {e}")
        return {"error": str(e)}

def update_inventory_item(item_id: int, price: int, is_available: bool):
    """
    Updates price and availability of an inventory item.
    """
    if not supabase:
        return {"error": "Supabase not configured"}

    try:
        response = supabase.table("inventory").update({
            "price": price,
            "is_available": is_available
        }).eq("id", item_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating inventory item: {e}")
        return {"error": str(e)}

def add_fish(name: str, price: int, is_available: bool = True):
    """
    Adds a new fish to the inventory.
    """
    if not supabase:
        return {"error": "Supabase not configured"}

    try:
        response = supabase.table("inventory").insert({
            "name": name,
            "price": price,
            "is_available": is_available
        }).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error adding fish: {e}")
        return {"error": str(e)}

def get_or_create_user(phone_number: str):
    """
    Checks if user exists. If not, creates them.
    Returns: (user_data, is_new)
    """
    if not supabase:
        return None, False

    try:
        # Check if user exists
        response = supabase.table("users").select("*").eq("phone", phone_number).execute()
        if response.data:
            return response.data[0], False
        
        # Create new user
        new_user = {"phone": phone_number, "language": None}
        response = supabase.table("users").insert(new_user).execute()
        return response.data[0], True
    except Exception as e:
        logger.error(f"Error in get_or_create_user: {e}")
        return None, False

def update_user_language(phone_number: str, language: str):
    """
    Updates the user's preferred language.
    """
    if not supabase: return
    try:
        supabase.table("users").update({"language": language}).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error updating language: {e}")

def log_message(phone_number: str, role: str, content: str, whatsapp_message_id: str = None):
    """
    Logs a message to the database.
    Role: 'user' or 'assistant'
    whatsapp_message_id: External ID from WhatsApp (wamid)
    """
    if not supabase: return
    try:
        data = {
            "user_phone": phone_number,
            "role": role,
            "content": content
        }
        if whatsapp_message_id:
            data["whatsapp_message_id"] = whatsapp_message_id

        supabase.table("messages").insert(data).execute()
    except Exception as e:
        logger.error(f"Error logging message: {e}")

def get_message_id_by_whatsapp_id(whatsapp_message_id: str):
    """
    Fetches the internal DB ID for a given WhatsApp Message ID.
    """
    if not supabase: return None
    try:
        response = supabase.table("messages").select("id").eq("whatsapp_message_id", whatsapp_message_id).execute()
        if response.data:
            return response.data[0]['id']
        return None
    except Exception as e:
        logger.error(f"Error fetching message ID by wamid: {e}")
        return None

def get_chat_history(phone_number: str, limit: int = 5):
    """
    Fetches the last N messages for context.
    """
    if not supabase: return []
    try:
        response = supabase.table("messages").select("*")\
            .eq("user_phone", phone_number)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        # Return reversed list (oldest first) for AI context
        return response.data[::-1] if response.data else []
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        return []

def get_inventory_string():
    """
    Fetches all available items and returns a formatted string.
    Example: "Rohu: 250/kg, Katla: 300/kg"
    """
    if not supabase:
        return "Inventory unavailable"
    
    try:
        response = supabase.table("inventory").select("*").eq("is_available", True).execute()
        items = response.data
        if not items:
            return "No items available today."
        
        # Format: "Name: Price/kg"
        formatted_items = [f"{item['name']}: {item['price']}/kg" for item in items]
        return ", ".join(formatted_items)
    except Exception as e:
        logger.error(f"Error fetching inventory string: {e}")
        return "Error fetching prices"

def get_user_language(phone_number: str):
    """
    Fetches the user's preferred language.
    Defaults to 'English' if not set.
    """
    if not supabase:
        return "English"
    
    try:
        response = supabase.table("users").select("language").eq("phone", phone_number).execute()
        if response.data and response.data[0].get("language"):
            return response.data[0]["language"]
        return "English"
    except Exception as e:
        logger.error(f"Error fetching user language: {e}")
        return "English"

def update_user_address(phone_number: str, address: str):
    """
    Updates the user's address.
    """
    if not supabase: return
    try:
        supabase.table("users").update({"address": address}).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error updating address: {e}")

def get_user_address(phone_number: str):
    """
    Fetches the user's address.
    """
    if not supabase: return None
    try:
        response = supabase.table("users").select("address").eq("phone", phone_number).execute()
        if response.data and response.data[0].get("address"):
            return response.data[0]["address"]
        return None
    except Exception as e:
        logger.error(f"Error fetching address: {e}")
        return None
def check_order_exists(message_id: int):
    """
    Checks if an order already exists for a given message_id.
    """
    if not supabase: return False
    try:
        response = supabase.table("orders").select("id").eq("message_id", message_id).execute()
        return len(response.data) > 0
    except Exception as e:
        logger.error(f"Error checking order existence: {e}")
        return False

def create_order(user_phone: str, items: list, address: str = None, message_id: int = None):
    """
    Creates a new order with multiple items.
    items: list of dicts [{'fish_name': 'Rohu', 'quantity': 1.5, 'price_per_kg': 250}]
    message_id: ID of the message that triggered the order (optional)
    """
    if not supabase:
        return {"error": "Supabase not configured"}

    try:
        # 0. Idempotency Check
        if message_id and check_order_exists(message_id):
            logger.info(f"Order already exists for message_id {message_id}")
            return {"error": "Order already placed for this message"}

        # 1. Calculate total price
        total_price = 0
        for item in items:
            item['subtotal'] = int(item['quantity'] * item['price_per_kg'])
            total_price += item['subtotal']

        # 2. Create Order
        order_data = {
            "user_phone": user_phone,
            "total_price": int(total_price),
            "status": "pending"
        }
        if address:
            order_data["delivery_address"] = address
            # Also update user profile
            update_user_address(user_phone, address)
        
        if message_id:
            order_data["message_id"] = message_id

        order_response = supabase.table("orders").insert(order_data).execute()
        
        if not order_response.data:
            return {"error": "Failed to create order"}
            
        order_id = order_response.data[0]['id']

        # 3. Create Order Items
        order_items_data = []
        for item in items:
            order_items_data.append({
                "order_id": order_id,
                "fish_name": item['fish_name'],
                "quantity": item['quantity'],
                "price_per_kg": int(item['price_per_kg']),
                "subtotal": int(item['subtotal'])
            })
            
        logger.info(f"Inserting order items: {order_items_data}")
        supabase.table("order_items").insert(order_items_data).execute()

        # 4. Update Message Status (if message_id provided)
        if message_id:
            try:
                supabase.table("messages").update({"order_placed": True}).eq("id", message_id).execute()
            except Exception as e:
                logger.error(f"Failed to update message status for {message_id}: {e}")
                # Don't fail the whole order if this fails, but log it.
        
        # 5. Reset Address Update Count
        reset_address_update_count(user_phone)

        return {"order_id": order_id, "total_price": total_price, "status": "success"}

    except Exception as e:
        logger.error(f"Error creating order: {e}")
        return {"error": str(e)}

def get_user_orders(user_phone: str):
    """
    Fetches past orders for a user.
    """
    if not supabase: return []
    try:
        response = supabase.table("orders").select("*, order_items(*)")\
            .eq("user_phone", user_phone)\
            .order("created_at", desc=True)\
            .limit(5)\
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching user orders: {e}")
        return []


def get_all_orders():
    """
    Fetches all orders for the admin dashboard.
    """
    if not supabase: return []
    try:
        response = supabase.table("orders").select("*, order_items(*)").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching all orders: {e}")
        return []

def update_order_status(order_id: int, status: str):
    """
    Updates the status of an order.
    """
    if not supabase: return {"error": "Supabase not configured"}
    try:
        response = supabase.table("orders").update({"status": status}).eq("id", order_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        return {"error": str(e)}

def update_user_state(phone_number: str, state: str):
    """
    Updates the user's conversation state.
    """
    if not supabase: return
    try:
        # Handle nullable state (None)
        state_val = state if state else None
        supabase.table("users").update({"conversation_state": state_val}).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error updating user state: {e}")

def get_user_state(phone_number: str):
    """
    Fetches the user's conversation state.
    """
    if not supabase: return None
    try:
        response = supabase.table("users").select("conversation_state").eq("phone", phone_number).execute()
        if response.data and response.data[0].get("conversation_state"):
            return response.data[0]["conversation_state"]
        return None
    except Exception as e:
        logger.error(f"Error fetching user state: {e}")
        return None

def get_address_update_count(phone_number: str):
    """
    Fetches the current address update count for the user.
    """
    if not supabase: return 0
    try:
        response = supabase.table("users").select("address_update_count").eq("phone", phone_number).execute()
        if response.data and "address_update_count" in response.data[0]:
            return response.data[0]["address_update_count"]
        return 0
    except Exception as e:
        logger.error(f"Error fetching address update count: {e}")
        return 0

def increment_address_update_count(phone_number: str):
    """
    Increments the address update count by 1.
    """
    if not supabase: return
    try:
        # We can't do atomic increment easily with simple update, so read-modify-write or RPC.
        # For simplicity in this context, we'll read then write, or use a raw query if possible.
        # Supabase-py doesn't support raw SQL easily without RPC.
        # Let's do read-modify-write for now (low concurrency expected per user).
        current = get_address_update_count(phone_number)
        supabase.table("users").update({"address_update_count": current + 1}).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error incrementing address update count: {e}")

def reset_address_update_count(phone_number: str):
    """
    Resets the address update count to 0.
    """
    if not supabase: return
    try:
        supabase.table("users").update({"address_update_count": 0}).eq("phone", phone_number).execute()
    except Exception as e:
        logger.error(f"Error resetting address update count: {e}")

