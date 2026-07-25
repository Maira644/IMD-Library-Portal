from pydantic import BaseModel
from typing import List, Optional


class ThesisCreate(BaseModel):
    id: str
    title: str
    studentNames: List[str]
    supervisor: str
    department: str
    submissionYear: int
    category: str
    abstract: str
    cabinetNo: str
    shelfNo: str

    keywords: List[str]
    uploadedBy: str
    uploadDate: str
    views: int = 0


class ThesisResponse(ThesisCreate):
    coverUrl: Optional[str] = None
    pdfUrl: Optional[str] = None