from pydantic import BaseModel, EmailStr
from typing import Optional


class UpdateProfileRequest(BaseModel):
    name: str
    username: str
    email: EmailStr
    department: Optional[str] = None
    currentPassword: Optional[str] = None
    newPassword: Optional[str] = None