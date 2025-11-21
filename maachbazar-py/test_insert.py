import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

print("Attempting to insert into messages...")
try:
    # Check if user exists first (FK constraint)
    phone = "919818743327"
    user = supabase.table("users").select("*").eq("phone", phone).execute()
    if not user.data:
        print(f"User {phone} not found. Creating...")
        supabase.table("users").insert({"phone": phone}).execute()

    data = {
        "user_phone": phone,
        "role": "user",
        "content": "Test message from script"
    }
    print(f"Data: {data}")
    response = supabase.table("messages").insert(data).execute()
    print("Success!")
    print(response.data)
except Exception as e:
    print(f"Error: {e}")
