import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Global database connection
db = None

async def init_db():
    """Initialize MongoDB connection"""
    global db
    try:
        connection_url = os.getenv("DB_URL")
        if not connection_url:
            raise ValueError("DB_URL environment variable is required")
        
        client = AsyncIOMotorClient(connection_url)
        db = client.sms  # Database name
        
        # Test the connection
        await client.admin.command('ping')
        logger.info("MongoDB server is connected")
        
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def insert_item(item: Dict[str, Any]) -> str:
    """Insert a message item into the database"""
    try:
        if not db:
            raise RuntimeError("Database not initialized")
        
        collection = db.items
        result = await collection.insert_one(item)
        logger.info(f"Item inserted with ID: {result.inserted_id}")
        return str(result.inserted_id)
        
    except Exception as e:
        logger.error(f"Error inserting item: {e}")
        raise

async def check_phone_number(phone_number: str) -> bool:
    """Check if a phone number exists in the database"""
    try:
        if not db:
            raise RuntimeError("Database not initialized")
        
        collection = db.items
        existing_record = await collection.find_one({"from": phone_number})
        
        logger.info(f"Phone number {phone_number} exists: {existing_record is not None}")
        return existing_record is not None
        
    except Exception as e:
        logger.error(f"Error checking phone number: {e}")
        raise

async def get_all_items(limit: int = 100) -> list:
    """Get all message items from the database"""
    try:
        if not db:
            raise RuntimeError("Database not initialized")
        
        collection = db.items
        cursor = collection.find().sort("created_at", -1).limit(limit)
        items = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for item in items:
            if "_id" in item:
                item["_id"] = str(item["_id"])
        
        return items
        
    except Exception as e:
        logger.error(f"Error getting items: {e}")
        raise

async def get_item_by_id(item_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific item by ID"""
    try:
        if not db:
            raise RuntimeError("Database not initialized")
        
        from bson import ObjectId
        collection = db.items
        item = await collection.find_one({"_id": ObjectId(item_id)})
        
        if item and "_id" in item:
            item["_id"] = str(item["_id"])
        
        return item
        
    except Exception as e:
        logger.error(f"Error getting item by ID: {e}")
        raise

async def delete_item(item_id: str) -> bool:
    """Delete an item by ID"""
    try:
        if not db:
            raise RuntimeError("Database not initialized")
        
        from bson import ObjectId
        collection = db.items
        result = await collection.delete_one({"_id": ObjectId(item_id)})
        
        return result.deleted_count > 0
        
    except Exception as e:
        logger.error(f"Error deleting item: {e}")
        raise
