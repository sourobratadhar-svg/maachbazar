import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

print(f"URL: {url}")
# print(f"KEY: {key}") # Don't print secrets

if not url or not key:
    print("Missing credentials")
    exit(1)

supabase = create_client(url, key)

print("Testing 'users' table...")
try:
    response = supabase.table("users").select("*").limit(1).execute()
    print("Users table accessible.")
    print(response)
except Exception as e:
    print(f"Error accessing users: {e}")

print("\nTesting 'messages' table...")
try:
    response = supabase.table("messages").select("*").limit(1).execute()
    print("Messages table accessible.")
    print(response)
except Exception as e:
    print(f"Error accessing messages: {e}")
