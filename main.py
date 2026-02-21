from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, Form, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response, JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import asyncio
import json
import logging
from datetime import datetime
import time
import uvicorn
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware

# Load environment variables from .env file
load_dotenv()

# Env keys to redact when logging (sensitive values)
_REDACT_KEYS = frozenset({
    "password", "secret", "token", "key", "auth"
})

def _is_sensitive(key: str) -> bool:
    k = key.lower()
    return any(r in k for r in _REDACT_KEYS)

def _log_env_on_startup():
    """Log all env vars at server start. Redacts sensitive values."""
    logger.info("=== Environment variables (startup) ===")
    # Sort for consistent output
    for key in sorted(os.environ.keys()):
        val = os.environ[key]
        if _is_sensitive(key):
            val = "[REDACTED]" if val else "[NOT SET]"
        logger.info("  %s=%s", key, val)
    logger.info("=======================================")

# Import our modules
from database import init_db, insert_item, check_phone_number
from twilio_service import init_twilio
from image_service import get_image, get_current_provider
from models import MessageItem, BackgroundVideo, DisplayMode
from profanity_filter import clean_text
from background_service import BackgroundService
from video_storage import upload_video, is_local_storage, get_cloudinary_thumbnail_url

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global display mode setting
global_display_mode = 'image'

# Global banner settings
global_banner_settings = {
    "message": "WHAT IS YOUR CRITICAL IDEA?",
    "enabled": True,
    "fontSize": 24,
    "phoneNumber": "845-524-9694",
    "phoneFontSize": 20,
    "textColor": "#ffffff",
    "phoneColor": "#ffffff",
    "fontFamily": "Orbitron"
}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
        # Send current display mode to newly connected client
        await websocket.send_json({"type": "displayModeChanged", "mode": global_display_mode})

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict):
        logger.info(f"Broadcasting message to {len(self.active_connections)} connections: {message}")
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
                logger.info(f"Message sent successfully to connection")
            except Exception as e:
                logger.error(f"Error sending message to connection: {e}")
                # Remove disconnected connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    _log_env_on_startup()
    await init_db()
    logger.info("Database initialized and ready")
    await init_twilio()
    logger.info("Application startup complete")
    yield
    # Shutdown
    logger.info("Application shutdown")

app = FastAPI(
    title="Rhetorical Backend API",
    description="FastAPI version of the rhetorical SMS visualization server",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

# Background service
background_service = BackgroundService()

# Note: uvicorn has a hardcoded ~1MB request body limit in its HTTP parser
# The 413 error occurs before the request reaches FastAPI
# Solutions:
# 1. Use hypercorn instead (has configurable limits) - see requirements.txt
# 2. Use nginx reverse proxy with: client_max_body_size 100m;
# 3. For local dev, the limit may be higher, but production needs proper config

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{datetime.now().isoformat()} - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv("NODE_ENV", "development"),
        "image_provider": get_current_provider()
    }

@app.get("/api/image-provider")
async def get_image_provider():
    """Get the currently configured image provider"""
    return {
        "provider": get_current_provider(),
        "options": ["pexels", "replicate"],
        "description": {
            "pexels": "Free stock photo search (no AI generation)",
            "replicate": "AI-powered image generation (paid service)"
        }
    }

@app.get("/ws")
async def websocket_endpoint():
    return {"message": "WebSocket endpoint ready"}

@app.websocket("/ws")
async def websocket_handler(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "history":
                await manager.broadcast({"type": "historyChanged", "data": data.get("data")})
            elif data.get("type") == "setDisplayMode":
                mode = data.get("mode")
                if mode in ['text', 'image']:
                    global global_display_mode
                    global_display_mode = mode
                    await manager.broadcast({"type": "displayModeChanged", "mode": global_display_mode})
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/display-mode")
async def get_display_mode():
    return {
        "success": True,
        "displayMode": global_display_mode
    }

@app.post("/api/display-mode")
async def set_display_mode(mode: DisplayMode):
    global global_display_mode
    global_display_mode = mode.mode
    await manager.broadcast({"type": "displayModeChanged", "mode": global_display_mode})
    
    return {
        "success": True,
        "displayMode": global_display_mode,
        "message": f"Display mode changed to {mode.mode}"
    }

@app.post("/api/test-image-generation")
async def test_image_generation(prompt: dict):
    try:
        if not prompt.get("prompt"):
            raise HTTPException(status_code=400, detail="Prompt is required")
        
        logger.info(f"Testing image generation for prompt: {prompt['prompt']}")
        image_result = await get_image(prompt["prompt"])
        
        return {
            "success": True,
            "result": image_result,
            "provider": get_current_provider(),
            "message": f"Image generation test completed using {get_current_provider()}"
        }
    except Exception as error:
        logger.error(f"Test image generation failed: {error}")
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/api/messageIncoming")
async def message_incoming(request: Request):
    try:
        form_data = await request.form()
        body = form_data.get("Body")
        from_number = form_data.get("From")
        sms_sid = form_data.get("SmsSid")
        to_number = form_data.get("To")
        
        logger.info(f"Received SMS: {body} from {from_number}")
        
        # Create message item
        if global_display_mode == 'image':
            image_result = await get_image(body)
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=image_result["imageUrl"],
                image_generation_status="success" if image_result["success"] else "failed",
                image_prompt=image_result["prompt"],
                display_mode="image"
            )
        else:
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=None,
                image_generation_status="skipped",
                image_prompt=body,
                display_mode="text"
            )
        
        # Check if phone number exists
        is_exists = await check_phone_number(item.from_number)
        
        # Insert item
        await insert_item(item.dict())
        
        # Broadcast to WebSocket clients
        # Convert datetime objects to strings for JSON serialization
        item_dict = item.dict()
        if item_dict.get('created_at'):
            item_dict['created_at'] = item_dict['created_at'].isoformat()
        await manager.broadcast({"type": "messageIncoming", "filtered": item_dict})
        
        if is_exists:
            return Response(content="success", status_code=200)
        else:
            twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                <Message>Thanks for your contribution! Image generated.</Message>
            </Response>"""
            return Response(content=twiml_response, media_type="text/xml")
            
    except Exception as error:
        logger.error(f"Error processing message: {error}")
        # Fallback response
        twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Message>Thanks for your contribution!</Message>
        </Response>"""
        return Response(content=twiml_response, media_type="text/xml")

@app.post("/api/whatsAppMessageIncoming")
async def whatsapp_message_incoming(request: Request):
    try:
        form_data = await request.form()
        body = form_data.get("Body")
        from_number = form_data.get("From")
        sms_sid = form_data.get("SmsSid")
        to_number = form_data.get("To")
        
        logger.info(f"Received WhatsApp message: {body} from {from_number}")
        
        # Create message item (same logic as SMS)
        if global_display_mode == 'image':
            image_result = await get_image(body)
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=image_result["imageUrl"],
                image_generation_status="success" if image_result["success"] else "failed",
                image_prompt=image_result["prompt"],
                display_mode="image"
            )
        else:
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=None,
                image_generation_status="skipped",
                image_prompt=body,
                display_mode="text"
            )
        
        # Check if phone number exists
        is_exists = await check_phone_number(item.from_number)
        
        # Insert item
        await insert_item(item.dict())
        
        # Broadcast to WebSocket clients
        # Convert datetime objects to strings for JSON serialization
        item_dict = item.dict()
        if item_dict.get('created_at'):
            item_dict['created_at'] = item_dict['created_at'].isoformat()
        await manager.broadcast({"type": "messageIncoming", "filtered": item_dict})
        
        if is_exists:
            return Response(content="success", status_code=200)
        else:
            twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
            <Response>
                <Message>Thanks for your contribution! Image generated.</Message>
            </Response>"""
            return Response(content=twiml_response, media_type="text/xml")
            
    except Exception as error:
        logger.error(f"Error processing WhatsApp message: {error}")
        # Fallback response
        twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Message>Thanks for your contribution!</Message>
        </Response>"""
        return Response(content=twiml_response, media_type="text/xml")

@app.post("/api/dev/messageIncoming")
async def dev_message_incoming(payload: dict):
    """Local testing endpoint to simulate Twilio webhook without public URL.
    Accepts JSON: { body, from, to, sid } and follows the same processing
    as /api/messageIncoming, returning a JSON result.
    """
    try:
        body = (payload.get("body") or "").strip()
        if not body:
            raise HTTPException(status_code=400, detail="body is required")
        from_number = payload.get("from") or "+19999999999"
        to_number = payload.get("to") or "+18888888888"
        sms_sid = payload.get("sid") or f"DEV-{int(time.time()*1000)}"

        logger.info(f"[DEV] Simulating SMS: {body} from {from_number}")

        # Build MessageItem with same logic as Twilio handler
        if global_display_mode == 'image':
            image_result = await get_image(body)
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=image_result["imageUrl"],
                image_generation_status="success" if image_result["success"] else "failed",
                image_prompt=image_result["prompt"],
                display_mode="image"
            )
        else:
            item = MessageItem(
                sid=sms_sid,
                from_number=from_number,
                to_number=to_number,
                body=body,
                filtered=clean_text(body),
                image_url=None,
                image_generation_status="skipped",
                image_prompt=body,
                display_mode="text"
            )

        # Check if phone number exists (same side-effect as prod path)
        is_exists = await check_phone_number(item.from_number)

        # Insert item
        await insert_item(item.dict())

        # Broadcast to clients
        item_dict = item.dict()
        if item_dict.get('created_at'):
            item_dict['created_at'] = item_dict['created_at'].isoformat()
        await manager.broadcast({"type": "messageIncoming", "filtered": item_dict})

        return {
            "success": True,
            "simulated": True,
            "stored": True,
            "exists": is_exists,
            "item": item_dict
        }
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Error in /api/dev/messageIncoming: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Background video endpoints
async def process_background_upload(filename: str, file_content: bytes):
    """Background task to upload video (local or Cloudinary) and create database record"""
    try:
        file_url, stored_filename, cloudinary_public_id = await upload_video(file_content, filename)
        
        # Create database record
        background = BackgroundVideo(
            url=file_url,
            filename=stored_filename,
            cloudinary_public_id=cloudinary_public_id
        )
        
        await background_service.create_background(background)
        logger.info(f"Background record created for: {filename}")
        
    except Exception as error:
        logger.error(f"Error in background task for {filename}: {error}")

@app.post("/api/upload")
async def upload_background(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        filename = f"{int(datetime.now().timestamp() * 1000)}-{file.filename}"
        
        # Read file content in chunks to handle large files
        content = b""
        while chunk := await file.read(1024 * 1024):  # Read in 1MB chunks
            content += chunk
        
        # Add background task to upload and create database record
        background_tasks.add_task(process_background_upload, filename, content)
        
        logger.info(f"Upload task queued for: {filename} (size: {len(content)} bytes)")
        
        # For local storage, URL is predictable; for Cloudinary, client should refetch /api/backgrounds
        file_url = f"/static/media/{filename}" if is_local_storage() else ""
        return {
            "url": file_url,
            "filename": filename,
            "status": "processing"
        }
    except Exception as error:
        logger.error(f"Error in /api/upload: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/api/backgrounds")
async def get_backgrounds():
    try:
        if is_local_storage():
            # List files from static/media directory
            media_dir = "static/media"
            backgrounds = []
            
            if os.path.exists(media_dir):
                files = os.listdir(media_dir)
                mp4_files = [f for f in files if f.endswith('.mp4')]
                
                for i, filename in enumerate(mp4_files):
                    backgrounds.append({
                        "url": f"/static/media/{filename}",
                        "filename": filename,
                        "isDefault": (filename == "grid2.mp4"),
                        "_id": filename,
                        "thumbnail_url": None,
                    })
            else:
                logger.warning(f"Media directory not found: {media_dir}")
        else:
            # Cloudinary: get from database (background_service stores all uploads there)
            backgrounds_raw = await background_service.get_all_backgrounds()
            # Also merge with default local fallbacks (grid2, etc.) if they exist locally
            media_dir = "static/media"
            local_defaults = []
            if os.path.exists(media_dir):
                for f in os.listdir(media_dir):
                    if f.endswith('.mp4') and f in ("grid2.mp4", "scifi1.mp4", "scifi2.mp4", "scifi3.mp4", "tunnel.mp4"):
                        local_defaults.append({
                            "url": f"/static/media/{f}",
                            "filename": f,
                            "isDefault": (f == "grid2.mp4"),
                            "_id": f,
                            "thumbnail_url": None,
                        })
            # Format DB records for API response
            backgrounds = []
            for b in backgrounds_raw:
                doc_id = b.get("_id", "")
                url = b.get("url", "")
                thumb = get_cloudinary_thumbnail_url(url) if url and "cloudinary.com" in url else None
                backgrounds.append({
                    "url": url,
                    "filename": b.get("filename", ""),
                    "isDefault": b.get("isDefault", False),
                    "_id": doc_id,
                    "cloudinary_public_id": b.get("cloudinary_public_id"),
                    "thumbnail_url": thumb,
                })
            # Combine DB records with local defaults (DB first)
            existing_urls = {bg["url"] for bg in backgrounds}
            for ld in local_defaults:
                if ld["url"] not in existing_urls:
                    backgrounds.append(ld)
                    existing_urls.add(ld["url"])
        
        return backgrounds
    except Exception as error:
        logger.error(f"Error in /api/backgrounds: {error}")
        # Return default backgrounds as fallback
        return [
            {"url": "/static/media/grid2.mp4", "filename": "grid2.mp4", "isDefault": True, "_id": "grid2", "thumbnail_url": None},
            {"url": "/static/media/scifi1.mp4", "filename": "scifi1.mp4", "isDefault": False, "_id": "scifi1", "thumbnail_url": None},
            {"url": "/static/media/scifi2.mp4", "filename": "scifi2.mp4", "isDefault": False, "_id": "scifi2", "thumbnail_url": None},
            {"url": "/static/media/scifi3.mp4", "filename": "scifi3.mp4", "isDefault": False, "_id": "scifi3", "thumbnail_url": None},
            {"url": "/static/media/tunnel.mp4", "filename": "tunnel.mp4", "isDefault": False, "_id": "tunnel", "thumbnail_url": None}
        ]

@app.get("/api/getBackgroundsFromExternalServer")
async def get_backgrounds_from_external_server():
    try:
        result = await background_service.fetch_and_save_external_backgrounds()
        return {
            "message": "Backgrounds fetched successfully",
            "backgrounds": result.get("new_backgrounds", 0)
        }
    except Exception as error:
        logger.error(f"Error in /api/getBackgroundsFromExternalServer: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/api/set_default")
async def set_default_background(background_id: dict):
    try:
        await background_service.set_default_background(background_id["_id"])
        return {"message": "Default background set successfully"}
    except Exception as error:
        logger.error(f"Error in /api/set_default: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/api/get_default")
async def get_default_background():
    try:
        background = await background_service.get_default_background()
        if not background:
            raise HTTPException(status_code=404, detail="Default background not found")
        url = background.get("url", "")
        thumb = get_cloudinary_thumbnail_url(url) if url and "cloudinary.com" in url else None
        return {**background, "thumbnail_url": thumb}
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Error in /api/get_default: {error}")
        # Return default background as fallback
        return {"url": "grid2.mp4", "filename": "grid2.mp4", "isDefault": True}

@app.post("/api/delete")
async def delete_background(background_id: dict):
    try:
        result = await background_service.delete_background(background_id["_id"])
        if not result:
            raise HTTPException(status_code=404, detail="Background not found")
        return {"message": "Background removed successfully"}
    except HTTPException:
        raise
    except Exception as error:
        logger.error(f"Error in /api/delete: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/api/load")
async def load_twilio_data():
    try:
        data = await init_twilio()
        return {"data": data}
    except Exception as error:
        logger.error(f"Error in /api/load: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Banner message endpoints
@app.get("/api/banner-message")
async def get_banner_message():
    """Get the current banner message"""
    try:
        return dict(global_banner_settings)
    except Exception as error:
        logger.error(f"Error getting banner message: {error}")
        return dict(global_banner_settings)

@app.post("/api/banner-message")
async def set_banner_message(request: dict):
    """Set a new banner message"""
    try:
        global global_banner_settings

        fs = request.get("fontSize")
        pfs = request.get("phoneFontSize")
        updated_settings = {
            "message": request.get("message", global_banner_settings["message"]),
            "enabled": request.get("enabled", global_banner_settings["enabled"]),
            "fontSize": int(fs) if fs is not None else global_banner_settings["fontSize"],
            "phoneNumber": request.get("phoneNumber", global_banner_settings["phoneNumber"]),
            "phoneFontSize": int(pfs) if pfs is not None else global_banner_settings["phoneFontSize"],
            "textColor": request.get("textColor", global_banner_settings["textColor"]),
            "phoneColor": request.get("phoneColor", global_banner_settings["phoneColor"]),
            "fontFamily": request.get("fontFamily", global_banner_settings["fontFamily"])
        }

        global_banner_settings.update(updated_settings)

        logger.info(
            "Banner settings updated: message='%s', enabled=%s, fontSize=%s, phone='%s'",
            global_banner_settings["message"],
            global_banner_settings["enabled"],
            global_banner_settings["fontSize"],
            global_banner_settings["phoneNumber"],
        )

        return {"success": True, **global_banner_settings}
    except Exception as error:
        logger.error(f"Error setting banner message: {error}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import sys
    port = int(os.getenv("PORT", 8000))
    server_type = os.getenv("SERVER_TYPE", "uvicorn").lower()
    
    if server_type == "hypercorn":
        # Use hypercorn which supports configurable max_incomplete_size for large uploads
        from hypercorn.config import Config as HypercornConfig
        from hypercorn.asyncio import serve
        
        config = HypercornConfig()
        config.bind = [f"0.0.0.0:{port}"]
        config.max_incomplete_size = 100 * 1024 * 1024  # 100MB
        logger.info(f"Starting server with hypercorn on port {port} (supports large uploads up to 100MB)")
        asyncio.run(serve(app, config))
    else:
        # Use uvicorn (has ~1MB limit, use hypercorn or nginx for larger files)
        logger.warning("Using uvicorn - request body size is limited to ~1MB. For larger uploads, set SERVER_TYPE=hypercorn or use nginx reverse proxy")
        uvicorn.run(app, host="0.0.0.0", port=port)
