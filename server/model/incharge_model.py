from pydantic import BaseModel, EmailStr


class CreateIncharge(BaseModel):
    name: str
    username: str
    email: EmailStr
    department: str