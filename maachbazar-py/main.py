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
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

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

        # 3. Handle Language Selection (Interactive Reply)
        if msg_type == "interactive":
            interactive = message.get("interactive", {})
            if interactive.get("type") == "list_reply":
                selection_id = interactive.get("list_reply", {}).get("id")
                # Map selection_id to language code
                lang_map = {"lang_en": "English", "lang_bn": "Bangla", "lang_hi": "Hinglish"}
                selected_lang = lang_map.get(selection_id, "English")
                
                db.update_user_language(sender_id, selected_lang)
                whatsapp.send_message(sender_id, f"Language set to {selected_lang}. How can I help you today?")
                return {"status": "ok"}

        # 4. Handle Text Message
        if msg_type == "text":
            message_text = message.get("text", {}).get("body")
            logger.info(f"Processing message from {sender_id}: {message_text}")
            
            # 1. Log User Message
            db.log_message(sender_id, "user", message_text)

            # 2. Generate AI response (Brain)
            ai_response = brain.generate_response(sender_id, message_text)
            
            # 3. Log Assistant Message
            db.log_message(sender_id, "assistant", ai_response)

            # 4. Send response back to WhatsApp
            whatsapp.send_message(sender_id, ai_response)
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
