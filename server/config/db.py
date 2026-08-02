from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

try:
    # MongoDB Atlas connection
    client = MongoClient(MONGO_URI)

    # Test connection
    client.admin.command("ping")

    # Select database
    db = client[DB_NAME]

    # Collections
    admin_collection = db["admin"]
    incharge_collection = db["incharge"]
    student_collection = db["student"]
    thesis_collection = db["thesis"]
    book_collection = db["books"] 
    category_collection = db["categories"]
    announcement_collection = db["announcements"]
    theme_collection = db["theme_settings"]

    counter_collection = db["counters"]

    print("MongoDB Connected Successfully")
    print("Database:", DB_NAME)

except Exception as e:
    print("MongoDB Connection Error:", e)

    