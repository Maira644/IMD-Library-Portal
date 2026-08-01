from pydantic import BaseModel, EmailStr
from typing import Optional


class UpdateStudent(BaseModel):
    name: str
    username: str
    email: EmailStr
    department: Optional[str] = None
    newPassword: Optional[str] = None