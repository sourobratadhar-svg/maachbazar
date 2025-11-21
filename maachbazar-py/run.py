import os
import sys
import uvicorn
from pyngrok import ngrok
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def start_server():
    # Set ngrok authtoken if available
    ngrok_auth_token = os.getenv("NGROK_AUTHTOKEN")
    if ngrok_auth_token:
        ngrok.set_auth_token(ngrok_auth_token)

    # Open a ngrok tunnel to the dev server
    public_url = ngrok.connect(8000).public_url
    print(f" * ngrok tunnel \"{public_url}\" -> \"http://127.0.0.1:8000\"")

    # Update the webhook URL in your WhatsApp Cloud API configuration with this URL
    # e.g., https://<ngrok-url>/webhook

    # Start the Uvicorn server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start_server()
