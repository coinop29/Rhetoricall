from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DisplayModeEnum(str, Enum):
    text = "text"
    image = "image"

class MessageItem(BaseModel):
    sid: str
    from_number: str = Field(alias="from")
    to_number: str = Field(alias="to")
    body: str
    filtered: str
    image_url: Optional[str] = None
    image_generation_status: Optional[str] = None
    image_prompt: Optional[str] = None
    display_mode: DisplayModeEnum = DisplayModeEnum.image
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class BackgroundVideo(BaseModel):
    url: str
    filename: str
    is_default: bool = Field(default=False, alias="isDefault")
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class DisplayMode(BaseModel):
    mode: DisplayModeEnum

class ImageGenerationRequest(BaseModel):
    prompt: str

class ImageGenerationResponse(BaseModel):
    success: bool
    image_url: Optional[str] = None
    prompt: str
    error: Optional[str] = None

class TwilioMessage(BaseModel):
    Body: str
    From: str
    SmsSid: str
    To: str

class BackgroundUploadResponse(BaseModel):
    url: str
    filename: str

class BackgroundDeleteRequest(BaseModel):
    _id: str

class BackgroundSetDefaultRequest(BaseModel):
    _id: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    environment: str
