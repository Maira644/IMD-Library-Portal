from pydantic import BaseModel
from typing import Optional


class AnnouncementCreate(BaseModel):
    title: str
    body: str
    imageUrl: Optional[str] = None
    pinned: bool = False
    expiresAt: Optional[str] = None