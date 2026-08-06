from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CreatePostRequest(BaseModel):
    social_account_id: int
    campaign_id: Optional[int] = None
    title: Optional[str] = Field(None, max_length=255)
    caption: str = Field(..., min_length=1)
    media_url: Optional[str] = None   
    scheduled_time: datetime

class UpdatePostRequest(BaseModel):
    social_account_id: Optional[int] = None
    campaign_id: Optional[int] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    media_url: Optional[str] = None
    scheduled_time: Optional[datetime] = None

class PostResponse(BaseModel):
    post_id: int
    user_id: int
    social_account_id: int
    campaign_id: Optional[int]
    title: Optional[str]
    caption: Optional[str]
    media_url: Optional[str] = None    
    status: str
    scheduled_time: Optional[datetime]
    published_time: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class CreateDraftRequest(BaseModel):
    social_account_id: int
    campaign_id: Optional[int] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    media_url: Optional[str] = None

class ScheduleDraftRequest(BaseModel):
    scheduled_time: datetime