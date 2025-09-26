import os
import logging
import replicate
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Initialize Replicate with API token from environment variables
replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    logger.warning("REPLICATE_API_TOKEN not found in environment variables")

async def generate_image_from_text(prompt: str) -> str:
    """
    Generate an image from text using Replicate's Stable Diffusion model
    """
    try:
        if not replicate_token:
            raise RuntimeError("Replicate API token not configured")
        
        logger.info(f"Generating image for prompt: {prompt}")
        
        # Using a cost-effective Stable Diffusion model
        # You can change this to other models like:
        # - "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
        # - "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d4631"
        
        output = await replicate.async_run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            input={
                "prompt": prompt,
                "width": 512,
                "height": 512,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 20,
            }
        )

        logger.info(f"Raw output from Replicate: {output}")
        
        # Handle different output formats
        image_url = None
        if isinstance(output, list):
            image_url = output[0]
        elif isinstance(output, str):
            image_url = output
        elif hasattr(output, '__str__'):
            image_url = str(output)
        else:
            raise ValueError('Unexpected output format from Replicate')

        # Ensure we have a valid URL string
        if not isinstance(image_url, str):
            raise ValueError('Image URL is not a string')

        logger.info(f"Image generated successfully: {image_url}")
        return image_url
        
    except Exception as error:
        logger.error(f"Error generating image: {error}")
        raise Exception(f"Failed to generate image: {str(error)}")

async def generate_image_with_fallback(prompt: str) -> Dict[str, Any]:
    """
    Generate an image with a fallback to a default image if generation fails
    """
    try:
        image_url = await generate_image_from_text(prompt)
        return {
            "success": True,
            "imageUrl": image_url,
            "prompt": prompt
        }
    except Exception as error:
        logger.error(f"Image generation failed, using fallback: {error}")
        # Return a default/placeholder image URL
        return {
            "success": False,
            "imageUrl": "https://via.placeholder.com/512x512/cccccc/666666?text=Image+Generation+Failed",
            "prompt": prompt,
            "error": str(error)
        }

async def generate_image_batch(prompts: list) -> list:
    """
    Generate multiple images in batch
    """
    results = []
    for prompt in prompts:
        try:
            result = await generate_image_with_fallback(prompt)
            results.append(result)
        except Exception as error:
            logger.error(f"Error generating image for prompt '{prompt}': {error}")
            results.append({
                "success": False,
                "imageUrl": "https://via.placeholder.com/512x512/cccccc/666666?text=Generation+Failed",
                "prompt": prompt,
                "error": str(error)
            })
    
    return results

async def get_model_info(model_name: str = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf") -> Dict[str, Any]:
    """
    Get information about a specific model
    """
    try:
        if not replicate_token:
            raise RuntimeError("Replicate API token not configured")
        
        model = await replicate.models.async_get(model_name)
        
        return {
            "name": model.name,
            "description": getattr(model, 'description', ''),
            "visibility": getattr(model, 'visibility', ''),
            "github_url": getattr(model, 'github_url', ''),
            "paper_url": getattr(model, 'paper_url', ''),
            "license_url": getattr(model, 'license_url', ''),
            "cover_image_url": getattr(model, 'cover_image_url', ''),
        }
        
    except Exception as error:
        logger.error(f"Error getting model info: {error}")
        raise
