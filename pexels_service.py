import os
import logging
import aiohttp
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Initialize Pexels with API key from environment variables
pexels_api_key = os.getenv("PEXELS_API_KEY")
if not pexels_api_key:
    logger.warning("PEXELS_API_KEY not found in environment variables")

PEXELS_API_URL = "https://api.pexels.com/v1/search"

async def generate_image_from_text(prompt: str) -> str:
    """
    Search for an image from Pexels based on text prompt
    """
    try:
        if not pexels_api_key:
            raise RuntimeError("Pexels API key not configured")
        
        logger.info(f"Searching Pexels for: {prompt}")
        
        # Prepare headers with API key
        headers = {
            "Authorization": pexels_api_key
        }
        
        # Prepare query parameters
        params = {
            "query": prompt,
            "per_page": 1,  # We only need one image
            "orientation": "square",  # Get square images for consistency
            "size": "medium"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(PEXELS_API_URL, headers=headers, params=params) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise RuntimeError(f"Pexels API error: {response.status} - {error_text}")
                
                data = await response.json()
                
                # Check if we got any photos
                if not data.get("photos") or len(data["photos"]) == 0:
                    raise RuntimeError(f"No images found for prompt: {prompt}")
                
                # Get the first photo's medium-sized URL
                photo = data["photos"][0]
                image_url = photo["src"]["medium"]  # or "large", "original" for higher quality
                
                logger.info(f"Image found successfully: {image_url}")
                return image_url
        
    except Exception as error:
        logger.error(f"Error searching Pexels: {error}")
        raise Exception(f"Failed to get image from Pexels: {str(error)}")

async def generate_image_with_fallback(prompt: str) -> Dict[str, Any]:
    """
    Search for an image with a fallback to a default image if search fails
    """
    try:
        image_url = await generate_image_from_text(prompt)
        return {
            "success": True,
            "imageUrl": image_url,
            "prompt": prompt,
            "provider": "pexels"
        }
    except Exception as error:
        logger.error(f"Pexels image search failed, using fallback: {error}")
        # Return a default/placeholder image URL
        return {
            "success": False,
            "imageUrl": "https://via.placeholder.com/512x512/cccccc/666666?text=Image+Not+Found",
            "prompt": prompt,
            "provider": "pexels",
            "error": str(error)
        }

async def generate_image_batch(prompts: list) -> list:
    """
    Search for multiple images in batch
    """
    results = []
    for prompt in prompts:
        try:
            result = await generate_image_with_fallback(prompt)
            results.append(result)
        except Exception as error:
            logger.error(f"Error searching Pexels for prompt '{prompt}': {error}")
            results.append({
                "success": False,
                "imageUrl": "https://via.placeholder.com/512x512/cccccc/666666?text=Search+Failed",
                "prompt": prompt,
                "provider": "pexels",
                "error": str(error)
            })
    
    return results

