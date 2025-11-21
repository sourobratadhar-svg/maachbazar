import logging
import db
from services import ai

logger = logging.getLogger(__name__)

def generate_response(sender_id: str, message_text: str) -> str:
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

        # 3. Construct Prompt
        # We wrap the user's message with context
        full_prompt = f"""
User Language Preference: {language}

Chat History:
{history_text}

User: {message_text}
Assistant:
"""
        # 4. Call AI Service
        # Note: ai.generate_response currently takes a simple prompt.
        # We might need to adjust it if we want to pass system instructions dynamically,
        # but for now, passing the full context in the prompt is a good start.
        response = ai.generate_response(full_prompt)
        
        return response

    except Exception as e:
        logger.error(f"Error in brain.generate_response: {e}")
        return "I'm having a bit of trouble thinking right now. Please try again."
