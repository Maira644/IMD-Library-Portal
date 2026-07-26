from pydantic import BaseModel
from typing import Optional


class BookCreate(BaseModel):
    id: str
    title: str
    author: str
    isbn: str
    publisher: str
    publicationYear: int
    edition: str
    category: str
    cabinetNo: str
    shelfNo: str
    digitalCopy: bool
    uploadedBy: str
    uploadDate: str
    description: str
    keywords: list[str]
    views: int = 0


class BookResponse(BookCreate):
    coverUrl: Optional[str] = None
    pdfUrl: Optional[str] = None