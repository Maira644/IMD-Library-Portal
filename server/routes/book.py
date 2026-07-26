from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from config.db import book_collection, category_collection
from helper.cloudinary_helper import upload_image, upload_pdf

router = APIRouter(
    prefix="/book",
    tags=["Books"]
)


# ==========================
# CREATE BOOK
# ==========================
@router.post("/")
async def create_book(

    title: str = Form(...),
    author: str = Form(...),
    publisher: str = Form(...),
    edition: str = Form(...),
    publicationYear: int = Form(...),

    category: str = Form(...),

    cabinetNo: str = Form(...),
    shelfNo: str = Form(...),

    keywords: str = Form(...),

    physicalCopy: bool = Form(...),
    digitalCopy: bool = Form(...),

    uploadedBy: str = Form(...),
    uploadDate: str = Form(...),

    cover: UploadFile | None = File(None),
    pdf: UploadFile | None = File(None),
):

    # ==========================
    # Generate Book ID
    # ==========================
    last_book = book_collection.find_one(
        sort=[("id", -1)]
    )

    if last_book:
        last_num = int(last_book["id"].split("-")[1])
        next_id = f"BK-{last_num + 1:03d}"
    else:
        next_id = "BK-001"

    keyword_list = [
        keyword.strip()
        for keyword in keywords.split(",")
        if keyword.strip()
    ]

    cover_url = None
    if cover:
        cover_url = upload_image(cover.file)

    pdf_url = None
    if pdf:
        pdf_url = upload_pdf(pdf)

    book = {
        "id": next_id,
        "title": title,
        "author": author,
        "publisher": publisher,
        "edition": edition,
        "publicationYear": publicationYear,

        "category": category,

        "cabinetNo": cabinetNo,
        "shelfNo": shelfNo,

        "keywords": keyword_list,

        "coverUrl": cover_url,
        "pdfUrl": pdf_url,

        "physicalCopy": physicalCopy,
        "digitalCopy": digitalCopy,

        "uploadedBy": uploadedBy,
        "uploadDate": uploadDate,

        "views": 0,
    }

    result = book_collection.insert_one(book)

    category_collection.update_one(
        {"name": category},
        {"$inc": {"count": 1}}
    )

    book["_id"] = str(result.inserted_id)

    return {
        "message": "Book created successfully.",
        "book": book,
    }


# ==========================
# GET ALL BOOKS
# ==========================
@router.get("/")
async def get_all_books():

    books = list(book_collection.find())

    for book in books:
        book["_id"] = str(book["_id"])

    return {
        "message": "Books fetched successfully.",
        "books": books
    }


# ==========================
# GET SINGLE BOOK
# ==========================
@router.get("/{book_id}")
async def get_book_by_id(book_id: str):

    book = book_collection.find_one({"id": book_id})

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found."
        )

    book["_id"] = str(book["_id"])

    return {
        "message": "Book fetched successfully.",
        "book": book
    }