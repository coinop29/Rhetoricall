import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Get the image provider from environment variable (default to pexels for free option)
IMAGE_PROVIDER = os.getenv("IMAGE_PROVIDER", "pexels").lower()

# Import the appropriate service based on configuration
if IMAGE_PROVIDER == "replicate":
    logger.info("Using Replicate for image generation")
    from replicate_service import (
        generate_image_from_text,
        generate_image_with_fallback,
        generate_image_batch
    )
elif IMAGE_PROVIDER == "pexels":
    logger.info("Using Pexels for image search")
    from pexels_service import (
        generate_image_from_text,
        generate_image_with_fallback,
        generate_image_batch
    )
else:
    logger.warning(f"Unknown IMAGE_PROVIDER: {IMAGE_PROVIDER}, defaulting to Pexels")
    from pexels_service import (
        generate_image_from_text,
        generate_image_with_fallback,
        generate_image_batch
    )

async def get_image(prompt: str) -> Dict[str, Any]:
    """
    Get an image based on the configured provider
    """
    result = await generate_image_with_fallback(prompt)
    result["provider"] = IMAGE_PROVIDER
    return result

async def get_images_batch(prompts: list) -> list:
    """
    Get multiple images in batch
    """
    results = await generate_image_batch(prompts)
    for result in results:
        result["provider"] = IMAGE_PROVIDER
    return results

def get_current_provider() -> str:
    """
    Get the currently configured image provider
    """
    return IMAGE_PROVIDER

