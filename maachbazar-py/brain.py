import logging
import db
import whatsapp_utils
from services import ai

logger = logging.getLogger(__name__)

def generate_response(sender_id: str, message_text: str, message_id: int = None) -> str:
    """
    Generates a response using Gemini, incorporating chat history and user context.
    """
    try:
        # 1. Fetch User Context (Language)
        user, _ = db.get_or_create_user(sender_id)
        language = user.get("language", "English") if user else "English"

        # 2. Fetch Chat History
        history = db.get_chat_history(sender_id, limit=5)
        
        # Format history for the prompt
        history_text = ""
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            content = msg["content"]
            history_text += f"{role}: {content}\n"

        # 3. Fetch User Address
        user_address = db.get_user_address(sender_id)

        # 4. Construct Prompt
        # We wrap the user's message with context
        full_prompt = f"""
User Language Preference: {language}

Chat History:
{history_text}

User: {message_text}
Assistant:
"""
        # 5. Call AI Service
        response = ai.generate_response(full_prompt, user_phone=sender_id, user_address=user_address, message_id=message_id)
        
        # Check if response asks for confirmation
        if "confirm" in response.lower() and "?" in response:
             # Send interactive button
             buttons = [
                 {"id": "confirm_order", "title": "Confirm Korun ✅"},
                 {"id": "change_address", "title": "Change Address 🏠"}
             ]
             wamid = whatsapp_utils.send_interactive_button(sender_id, response, buttons)
             # Log assistant message with wamid
             db.log_message(sender_id, "assistant", response, whatsapp_message_id=wamid)
             return None # Signal that message is already sent

        return response

    except Exception as e:
        logger.error(f"Error in brain.generate_response: {e}")
        return "I'm having a bit of trouble thinking right now. Please try again."
