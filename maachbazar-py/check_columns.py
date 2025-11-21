import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Missing credentials")
    exit(1)

supabase = create_client(url, key)

print("--- Users Table ---")
try:
    # Fetch one row to see keys
    response = supabase.table("users").select("*").limit(1).execute()
    if response.data:
        print("Columns:", list(response.data[0].keys()))
    else:
        print("Table empty, cannot infer columns easily via select. Trying insert to fail...")
except Exception as e:
    print(f"Error: {e}")

print("\n--- Messages Table ---")
try:
    response = supabase.table("messages").select("*").limit(1).execute()
    if response.data:
        print("Columns:", list(response.data[0].keys()))
    else:
        print("Table empty. Checking if 'phone' or 'user_phone' works...")
        # Try selecting specific columns to see which one exists
        try:
            supabase.table("messages").select("phone").limit(1).execute()
            print("Column 'phone' EXISTS.")
        except:
            print("Column 'phone' does NOT exist.")
            
        try:
            supabase.table("messages").select("user_phone").limit(1).execute()
            print("Column 'user_phone' EXISTS.")
        except:
            print("Column 'user_phone' does NOT exist.")
            
        try:
            supabase.table("messages").select("phone_number").limit(1).execute()
            print("Column 'phone_number' EXISTS.")
        except:
            print("Column 'phone_number' does NOT exist.")

except Exception as e:
    print(f"Error: {e}")
