import os
import logging
import aiohttp
from typing import List, Dict, Any, Optional
from datetime import datetime
from bs4 import BeautifulSoup
from database import db
from models import BackgroundVideo

logger = logging.getLogger(__name__)

class BackgroundService:
    def __init__(self):
        self.collection_name = "background_videos"
    
    async def create_background(self, background: BackgroundVideo) -> str:
        """Create a new background video record"""
        try:
            if not db:
                raise RuntimeError("Database not initialized")
            
            collection = db[self.collection_name]
            background_dict = background.dict()
            background_dict["created_at"] = datetime.now()
            
            result = await collection.insert_one(background_dict)
            logger.info(f"Background created with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating background: {e}")
            raise
    
    async def get_all_backgrounds(self) -> List[Dict[str, Any]]:
        """Get all background videos"""
        try:
            if not db:
                raise RuntimeError("Database not initialized")
            
            collection = db[self.collection_name]
            cursor = collection.find().sort("created_at", -1)
            backgrounds = await cursor.to_list(length=None)
            
            # Convert ObjectId to string for JSON serialization
            for background in backgrounds:
                if "_id" in background:
                    background["_id"] = str(background["_id"])
                if "created_at" in background:
                    background["created_at"] = background["created_at"].isoformat()
            
            return backgrounds
            
        except Exception as e:
            logger.error(f"Error getting backgrounds: {e}")
            raise
    
    async def get_default_background(self) -> Optional[Dict[str, Any]]:
        """Get the default background video"""
        try:
            if not db:
                raise RuntimeError("Database not initialized")
            
            collection = db[self.collection_name]
            background = await collection.find_one({"isDefault": True})
            
            if background and "_id" in background:
                background["_id"] = str(background["_id"])
            if background and "created_at" in background:
                background["created_at"] = background["created_at"].isoformat()
            
            return background
            
        except Exception as e:
            logger.error(f"Error getting default background: {e}")
            raise
    
    async def set_default_background(self, background_id: str) -> bool:
        """Set a background as default"""
        try:
            if not db:
                raise RuntimeError("Database not initialized")
            
            from bson import ObjectId
            collection = db[self.collection_name]
            
            # Unset previous default
            await collection.update_many(
                {"isDefault": True},
                {"$set": {"isDefault": False}}
            )
            
            # Set new default
            result = await collection.update_one(
                {"_id": ObjectId(background_id)},
                {"$set": {"isDefault": True}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error setting default background: {e}")
            raise
    
    async def delete_background(self, background_id: str) -> bool:
        """Delete a background video"""
        try:
            if not db:
                raise RuntimeError("Database not initialized")
            
            from bson import ObjectId
            collection = db[self.collection_name]
            
            # Get background info before deletion
            background = await collection.find_one({"_id": ObjectId(background_id)})
            
            # Delete from database
            result = await collection.delete_one({"_id": ObjectId(background_id)})
            
            # Optionally delete file from filesystem
            if background and result.deleted_count > 0:
                filename = background.get("filename")
                if filename:
                    file_path = os.path.join("public", filename)
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                            logger.info(f"File deleted: {file_path}")
                    except Exception as file_error:
                        logger.error(f"Error deleting file {file_path}: {file_error}")
            
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting background: {e}")
            raise
    
    async def fetch_and_save_external_backgrounds(self) -> Dict[str, Any]:
        """Fetch backgrounds from external server and save new ones"""
        try:
            external_url = "https://rhetoricall.site/backgroundvideos/"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(external_url) as response:
                    if response.status != 200:
                        raise Exception(f"Failed to fetch external backgrounds: {response.status}")
                    
                    html_content = await response.text()
            
            # Parse HTML to extract video links
            soup = BeautifulSoup(html_content, 'html.parser')
            links = []
            
            for link in soup.find_all('a', href=True):
                href = link['href']
                if href.endswith('.mp4'):
                    links.append(href)
            
            logger.info(f"Found {len(links)} video links from external server")
            
            # Get existing URLs from database
            if not db:
                raise RuntimeError("Database not initialized")
            
            collection = db[self.collection_name]
            existing_videos = await collection.find({}, {"url": 1}).to_list(length=None)
            existing_urls = [video["url"] for video in existing_videos]
            
            # Filter out URLs that already exist
            new_links = [link for link in links if link not in existing_urls]
            
            # Save new links to database
            new_backgrounds = 0
            if new_links:
                video_documents = [
                    {
                        "url": link,
                        "filename": link,
                        "isDefault": False,
                        "created_at": datetime.now()
                    }
                    for link in new_links
                ]
                
                result = await collection.insert_many(video_documents)
                new_backgrounds = len(result.inserted_ids)
                logger.info(f"Inserted {new_backgrounds} new backgrounds")
            
            return {
                "total_found": len(links),
                "new_backgrounds": new_backgrounds,
                "existing_backgrounds": len(existing_urls)
            }
            
        except Exception as e:
            logger.error(f"Error fetching external backgrounds: {e}")
            raise
