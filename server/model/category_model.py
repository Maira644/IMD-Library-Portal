from pydantic import BaseModel


class Category(BaseModel):
    id: str
    name: str
    description: str
    count: int = 0