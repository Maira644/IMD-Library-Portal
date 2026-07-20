from pydantic import BaseModel

from typing import Literal

class LoginRequest(BaseModel):
    username: str
    password: str
    role: Literal["admin", "incharge", "student"]