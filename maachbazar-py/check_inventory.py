import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

try:
    response = supabase.table("inventory").select("*").limit(1).execute()
    if response.data:
        print("Inventory Columns:", list(response.data[0].keys()))
    else:
        print("Inventory table empty.")
except Exception as e:
    print(f"Error: {e}")
