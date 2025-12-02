import os
import logging
from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Import local modules
import db
import brain
import whatsapp_utils
from services import whatsapp

# Load environment variables
load_dotenv()

# Configuration
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for Frontend (Vite runs on 5173 or 8080)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PriceUpdate(BaseModel):
    name: str
    price: int

class InventoryUpdate(BaseModel):
    id: int
    price: int
    is_available: bool

class AddFish(BaseModel):
    name: str
    price: int
    is_available: bool = True

@app.get("/api/inventory")
async def get_inventory():
    return db.get_inventory()

@app.post("/api/inventory")
async def update_inventory(update: InventoryUpdate):
    return db.update_inventory_item(update.id, update.price, update.is_available)

@app.post("/api/inventory/add")
async def add_fish(fish: AddFish):
    return db.add_fish(fish.name, fish.price, fish.is_available)

@app.post("/api/update")
async def update_price(update: PriceUpdate):
    return db.update_price(update.name, update.price)

@app.get("/api/orders")
async def get_orders():
    return db.get_all_orders()

class OrderStatusUpdate(BaseModel):
    order_id: int
    status: str

@app.post("/api/orders/status")
async def update_order_status(update: OrderStatusUpdate):
    # 1. Update in DB
    result = db.update_order_status(update.order_id, update.status)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Notify User via WhatsApp
    order = result[0]
    user_phone = order.get("user_phone")
    
    if user_phone:
        if update.status == "confirmed":
            message = f"Your order #{update.order_id} has been CONFIRMED! We will deliver it shortly. 🐟"
        elif update.status == "rejected":
            message = f"Sorry, your order #{update.order_id} has been CANCELLED. Please contact us for details."
        else:
            message = f"Update on your order #{update.order_id}: Status is now '{update.status}'."
            
        whatsapp.send_message(user_phone, message)
        db.log_message(user_phone, "assistant", message)

    return {"status": "success", "order": order}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
async def login(credentials: LoginRequest):
    admin_user = os.getenv("ADMIN_USERNAME", "admin")
    admin_pass = os.getenv("ADMIN_PASSWORD", "password")
    
    if credentials.username == admin_user and credentials.password == admin_pass:
        return {"token": "fake-jwt-token-for-demo", "message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/")
async def root():
    return {"message": "Maachbazar Bot is running! 🐟"}

@app.get("/webhook")
async def verify_webhook(
    mode: str = Query(..., alias="hub.mode"),
    token: str = Query(..., alias="hub.verify_token"),
    challenge: str = Query(..., alias="hub.challenge")
):
    """
    Verifies the webhook subscription.
    """
    if mode == "subscribe" and token == VERIFY_TOKEN:
        logger.info("Webhook verified successfully!")
        return PlainTextResponse(content=challenge, status_code=200)
    else:
        logger.warning("Webhook verification failed.")
        raise HTTPException(status_code=403, detail="Verification failed")


@app.post("/webhook")
async def webhook_handler(request: Request):
    """
    Handles incoming webhook events.
    """
    try:
        payload = await request.json()
        logger.info(f"Received webhook payload: {payload}")

        # Extract basic info
        entry = payload.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if not messages:
            return {"status": "ok"}

        message = messages[0]
        sender_id = message.get("from")
        msg_type = message.get("type")

        # 1. Check/Create User
        user, is_new = db.get_or_create_user(sender_id)

        # 2. Handle New User -> Send Language Menu
        if is_new:
            whatsapp_utils.send_language_menu(sender_id)
            return {"status": "ok"}

        # 3. Handle Language Selection & Button Replies (Interactive Reply)
        if msg_type == "interactive":
            interactive = message.get("interactive", {})
            interactive_type = interactive.get("type")

            if interactive_type == "list_reply":
                selection_id = interactive.get("list_reply", {}).get("id")
                # Map selection_id to language code
                lang_map = {"lang_en": "English", "lang_bn": "Bangla", "lang_hi": "Hinglish"}
                selected_lang = lang_map.get(selection_id, "English")
                
                db.update_user_language(sender_id, selected_lang)
                whatsapp.send_message(sender_id, f"Language set to {selected_lang}. How can I help you today?")
                return {"status": "ok"}
            
            elif interactive_type == "button_reply":
                button_id = interactive.get("button_reply", {}).get("id")
                button_title = interactive.get("button_reply", {}).get("title")
                
                if button_id == "confirm_order":
                    # Treat as text message "Confirm"
                    message_text = "Confirm"
                    
                    # Extract context ID (the ID of the message being replied to)
                    context_id = message.get("context", {}).get("id")
                    internal_message_id = None
                    
                    if context_id:
                        internal_message_id = db.get_message_id_by_whatsapp_id(context_id)
                        logger.info(f"Resolved context_id {context_id} to internal_message_id {internal_message_id}")

                    logger.info(f"Processing button reply from {sender_id}: {message_text}")
                    db.log_message(sender_id, "user", message_text)
                    
                    # Pass internal_message_id to brain
                    ai_response = brain.generate_response(sender_id, message_text, message_id=internal_message_id)
                    
                    if ai_response:
                        db.log_message(sender_id, "assistant", ai_response)
                        whatsapp.send_message(sender_id, ai_response)
                    return {"status": "ok"}
                
                elif button_id == "change_address":
                    # Handle Change Address
                    logger.info(f"User {sender_id} requested to change address")
                    db.update_user_state(sender_id, "AWAITING_ADDRESS")
                    
                    response_text = "Please type your new address (include Floor, Block, Gali)."
                    whatsapp.send_message(sender_id, response_text)
                    db.log_message(sender_id, "assistant", response_text)
                    return {"status": "ok"}

        # 4. Handle Text Message
        if msg_type == "text":
            message_text = message.get("text", {}).get("body")
            logger.info(f"Processing message from {sender_id}: {message_text}")
            
            # 0. Check User State
            current_state = db.get_user_state(sender_id)
            
            if current_state == "AWAITING_ADDRESS":
                # Treat this text as the new address
                new_address = message_text
                db.update_user_address(sender_id, new_address)
                db.update_user_state(sender_id, None) # Clear state
                
                # Log the address update
                db.log_message(sender_id, "user", f"Updated address to: {new_address}")
                
                # Trigger confirmation again
                confirm_msg = f"Address updated to: {new_address}. Do you want to confirm your order now?"
                
                # Send interactive buttons again
                buttons = [
                    {"id": "confirm_order", "title": "Confirm Korun ✅"},
                    {"id": "change_address", "title": "Change Address 🏠"}
                ]
                wamid = whatsapp_utils.send_interactive_button(sender_id, confirm_msg, buttons)
                db.log_message(sender_id, "assistant", confirm_msg, whatsapp_message_id=wamid)
                return {"status": "ok"}

            # 1. Log User Message
            db.log_message(sender_id, "user", message_text)

            # 2. Generate AI response (Brain)
            ai_response = brain.generate_response(sender_id, message_text)
            
            # 3. Send response back to WhatsApp
            wamid = whatsapp.send_message(sender_id, ai_response)

            # 4. Log Assistant Message
            db.log_message(sender_id, "assistant", ai_response, whatsapp_message_id=wamid)
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
