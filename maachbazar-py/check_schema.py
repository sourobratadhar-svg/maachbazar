import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

def check_table(table_name):
    print(f"Checking table: {table_name}")
    try:
        response = supabase.table(table_name).select("*").limit(1).execute()
        if response.data:
            print(f"Columns: {response.data[0].keys()}")
        else:
            print("Table empty, cannot determine columns.")
    except Exception as e:
        print(f"Error: {e}")

def probe_messages():
    print("Probing messages table...")
    try:
        # Insert succeeded, so let's fetch it
        response = supabase.table("messages").select("*").limit(1).order("created_at", desc=True).execute()
        if response.data:
            print(f"Columns: {response.data[0].keys()}")
            print(f"Data: {response.data[0]}")
    except Exception as e:
        print(f"Error: {e}")

probe_messages()
