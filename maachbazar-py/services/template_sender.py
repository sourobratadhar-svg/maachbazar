import logging
import asyncio
from services.whatsapp import send_template
import db

logger = logging.getLogger(__name__)

async def broadcast_morning_template():
    """
    Fetches opt-in users and sends the morning 'fresh_stock_alert' template.
    """
    logger.info("Starting morning broadcast...")
    
    # 1. Fetch Opt-in Users
    users = db.get_opt_in_users()
    if not users:
        logger.info("No opt-in users found.")
        return

    logger.info(f"Found {len(users)} opt-in users.")
    
    # 2. Fetch Inventory for {{2}}
    # "Rohu, Katla, Pomfret"
    inventory_str = db.get_inventory_string()
    # Simple extraction or use as is if it's formatted nicely. 
    # get_inventory_string returns "Rohu: 250/kg, ..."
    # We might want just names for the template to keep it short if needed, 
    # but the prompt example says "includes {{2}}", so "Rohu, Katla" is nice.
    # Let's clean it up to just names for brevity in the alert.
    
    try:
        items = db.get_inventory()
        # Filter available
        avail_names = [i['name'] for i in items if i.get('is_available')]
        stock_list = ", ".join(avail_names) if avail_names else "fresh fish"
    except Exception:
        stock_list = "fresh fish"

    for user in users:
        phone = user.get("phone")
        
        # Prepare template components
        # {{1}} = Customer Name
        user_name = "Customer" 
        
        components = [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": user_name
                    }
                ]
            }
        ]
        
        # Send
        try:
            msg_id = send_template(phone, "maachbazar_intro_v2", language_code="en", components=components)
            if msg_id:
                count_sent += 1
                # Log usage
                db.log_message(phone, "assistant", "Sent daily fresh stock alert", whatsapp_message_id=msg_id)
            else:
                count_failed += 1
        except Exception as e:
            logger.error(f"Failed to broadcast to {phone}: {e}")
            count_failed += 1
            
        # Rate limiting matching WhatsApp limits (approx 80/sec is limit, but be safe)
        await asyncio.sleep(0.1) 

    logger.info(f"Broadcast complete. Sent: {count_sent}, Failed: {count_failed}")
    return {"sent": count_sent, "failed": count_failed}
