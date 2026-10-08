import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any, Dict, List

import uvicorn
from bson.errors import InvalidId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, field_validator

from database import delete_item, delete_item_by_sid, get_all_items, init_db, insert_item
from image_service import get_current_provider, get_image
from models import DisplayMode, MessageItem
from profanity_filter import clean_text

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

global_display_mode = "image"
global_banner_settings = {
    "message": "WHAT IS YOUR CRITICAL IDEA?",
    "enabled": True,
    "fontSize": 24,
    "textColor": "#ffffff",
    "fontFamily": "Orbitron",
}


class ChatMessageRequest(BaseModel):
    body: str = Field(min_length=1, max_length=500)
    session_id: str = Field(min_length=1, max_length=64)

    @field_validator("body", "session_id")
    @classmethod
    def strip_and_require_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("must not be blank")
        return value


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await websocket.send_json({"type": "displayModeChanged", "mode": global_display_mode})
        await websocket.send_json({"type": "bannerSettingsChanged", **global_banner_settings})

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        stale = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                stale.append(connection)
        for connection in stale:
            self.disconnect(connection)


manager = ConnectionManager()


def item_dict_for_client(item: MessageItem, inserted_id: str) -> Dict[str, Any]:
    data = item.model_dump()
    if data.get("created_at"):
        data["created_at"] = data["created_at"].isoformat()
    data["_id"] = inserted_id
    return data


async def save_web_message(body: str, session_id: str) -> Dict[str, Any]:
    sid = f"WEB-{uuid.uuid4().hex}"
    source = f"web:{session_id}"

    if global_display_mode == "image":
        image_result = await get_image(body)
        item = MessageItem(
            sid=sid,
            from_number=source,
            to_number="web-chat",
            body=body,
            filtered=clean_text(body),
            image_url=image_result["imageUrl"],
            image_generation_status="success" if image_result["success"] else "failed",
            image_prompt=image_result["prompt"],
            display_mode="image",
        )
    else:
        item = MessageItem(
            sid=sid,
            from_number=source,
            to_number="web-chat",
            body=body,
            filtered=clean_text(body),
            image_generation_status="skipped",
            image_prompt=body,
            display_mode="text",
        )

    inserted_id = await insert_item(item.model_dump())
    payload = item_dict_for_client(item, inserted_id)
    await manager.broadcast({"type": "messageIncoming", "filtered": payload})
    return payload


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await init_db()
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown")


app = FastAPI(
    title="Rhetorical Web Chat",
    description="QR-powered audience chat and live visualization",
    version="2.0.0",
    lifespan=lifespan,
)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("%s - %s %s", datetime.now().isoformat(), request.method, request.url.path)
    return await call_next(request)


@app.get("/", response_class=HTMLResponse)
async def display_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/chat", response_class=HTMLResponse)
async def chat_page(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": os.getenv("NODE_ENV", "development"),
        "image_provider": get_current_provider(),
    }


@app.websocket("/ws")
async def websocket_handler(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "setDisplayMode" and data.get("mode") in {"text", "image"}:
                global global_display_mode
                global_display_mode = data["mode"]
                await manager.broadcast({"type": "displayModeChanged", "mode": global_display_mode})
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/api/chat/messages", status_code=201)
async def create_chat_message(message: ChatMessageRequest):
    try:
        item = await save_web_message(message.body, message.session_id)
        return {"success": True, "message": item}
    except Exception as error:
        logger.exception("Error saving web chat message")
        raise HTTPException(status_code=500, detail="Could not save your message. Please try again.") from error


@app.get("/api/messages")
async def list_messages(limit: int = 100):
    safe_limit = max(1, min(limit, 100))
    return {"success": True, "messages": await get_all_items(safe_limit)}


@app.get("/api/display-mode")
async def get_display_mode():
    return {"success": True, "displayMode": global_display_mode}


@app.post("/api/display-mode")
async def set_display_mode(mode: DisplayMode):
    global global_display_mode
    global_display_mode = mode.mode.value
    await manager.broadcast({"type": "displayModeChanged", "mode": global_display_mode})
    return {"success": True, "displayMode": global_display_mode}


@app.post("/api/delete-message")
async def delete_message(request: dict):
    message_id = str(request.get("_id") or request.get("id") or "").strip() or None
    sid = str(request.get("sid") or "").strip() or None
    if not message_id and not sid:
        raise HTTPException(status_code=400, detail="Provide _id or sid")

    deleted = False
    if message_id:
        try:
            deleted = await delete_item(message_id)
        except InvalidId:
            pass
    if not deleted and sid:
        deleted = await delete_item_by_sid(sid)
    if not deleted:
        raise HTTPException(status_code=404, detail="Message not found")

    removal: Dict[str, Any] = {"type": "messageRemoved"}
    if message_id:
        removal["_id"] = message_id
    if sid:
        removal["sid"] = sid
    await manager.broadcast(removal)
    return {"success": True}


@app.get("/api/banner-message")
async def get_banner_message():
    return dict(global_banner_settings)


@app.post("/api/banner-message")
async def set_banner_message(request: dict):
    font_size = request.get("fontSize")
    global_banner_settings.update(
        {
            "message": str(request.get("message", global_banner_settings["message"]))[:120],
            "enabled": bool(request.get("enabled", global_banner_settings["enabled"])),
            "fontSize": int(font_size) if font_size is not None else global_banner_settings["fontSize"],
            "textColor": request.get("textColor", global_banner_settings["textColor"]),
            "fontFamily": request.get("fontFamily", global_banner_settings["fontFamily"]),
        }
    )
    await manager.broadcast({"type": "bannerSettingsChanged", **global_banner_settings})
    return {"success": True, **global_banner_settings}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    server_type = os.getenv("SERVER_TYPE", "uvicorn").lower()
    if server_type == "hypercorn":
        from hypercorn.asyncio import serve
        from hypercorn.config import Config as HypercornConfig

        config = HypercornConfig()
        config.bind = [f"0.0.0.0:{port}"]
        asyncio.run(serve(app, config))
    else:
        uvicorn.run(app, host="0.0.0.0", port=port)
