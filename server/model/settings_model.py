from pydantic import BaseModel
from typing import Optional


class UpdateSettings(BaseModel):
    siteName: Optional[str] = None
    tagline: Optional[str] = None
    footer: Optional[str] = None
    studentProfileEditable: Optional[bool] = None