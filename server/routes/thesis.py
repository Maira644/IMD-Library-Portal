from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from config.db import thesis_collection, category_collection
from helper.cloudinary_helper import upload_image, upload_pdf

router = APIRouter(
    prefix="/thesis",
    tags=["Thesis"]
)


# ==========================
# CREATE THESIS
# ==========================
@router.post("/")
async def create_thesis(
    id: str = Form(...),
    title: str = Form(...),
    studentNames: str = Form(...),
    supervisor: str = Form(...),
    department: str = Form(...),
    submissionYear: int = Form(...),
    category: str = Form(...),
    cabinetNo: str = Form(...),
    shelfNo: str = Form(...),
    abstract: str = Form(...),
    keywords: str = Form(...),
    uploadedBy: str = Form(...),
    uploadDate: str = Form(...),

    # Cover is now OPTIONAL
    cover: UploadFile | None = File(None),

    # PDF remains OPTIONAL
    pdf: UploadFile | None = File(None),
):
    # Check duplicate Thesis ID
    if thesis_collection.find_one({"id": id}):
        raise HTTPException(
            status_code=400,
            detail="Thesis ID already exists."
        )

    # Convert comma-separated strings into lists
    student_names = [
        name.strip()
        for name in studentNames.split(",")
        if name.strip()
    ]

    keyword_list = [
        keyword.strip()
        for keyword in keywords.split(",")
        if keyword.strip()
    ]

    # Upload cover only if selected
    cover_url = None
    if cover:
        cover_url = upload_image(cover.file)

    # Upload PDF only if selected
    pdf_url = None
    if pdf:
        pdf_url = upload_pdf(pdf)

    thesis = {
        "id": id,
        "title": title,
        "studentNames": student_names,
        "supervisor": supervisor,
        "department": department,
        "submissionYear": submissionYear,
        "category": category,
        "cabinetNo": cabinetNo,
        "shelfNo": shelfNo,
        "abstract": abstract,
        "keywords": keyword_list,
        "coverUrl": cover_url,
        "pdfUrl": pdf_url,
        "uploadedBy": uploadedBy,
        "uploadDate": uploadDate,
        "views": 0,
    }

    result = thesis_collection.insert_one(thesis)

    # Increase category count
    category_collection.update_one(
    {"name": category},
    {
        "$inc": {
            "count": 1,
            "thesisCount": 1
        }
    }
)

    thesis["_id"] = str(result.inserted_id)

    return {
        "message": "Thesis created successfully.",
        "thesis": thesis
    }


# ==========================
# GET ALL THESIS
# ==========================
@router.get("/")
async def get_all_thesis():
    theses = list(thesis_collection.find())

    for thesis in theses:
        thesis["_id"] = str(thesis["_id"])

    return {
        "message": "Thesis fetched successfully.",
        "thesis": theses
    }
# ==========================
# GET MOST VIEWED THESIS
# ==========================
@router.get("/most-viewed")
async def get_most_viewed_thesis():

    thesis = list(
        thesis_collection.find().sort("views", -1).limit(5)
    )

    for item in thesis:
        item["_id"] = str(item["_id"])

    return {
        "message": "Most viewed thesis fetched successfully.",
        "thesis": thesis
    }
# ==========================
# GET SINGLE THESIS
# ==========================
@router.get("/{thesis_id}")
async def get_thesis_by_id(thesis_id: str):
    thesis = thesis_collection.find_one({"id": thesis_id})

    if not thesis:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    thesis["_id"] = str(thesis["_id"])

    return {
        "message": "Thesis fetched successfully.",
        "thesis": thesis
    }

# ==========================
# UPDATE THESIS
# ==========================
@router.put("/{thesis_id}")
async def update_thesis(
    thesis_id: str,

    title: str = Form(...),
    studentNames: str = Form(...),
    supervisor: str = Form(...),
    department: str = Form(...),
    submissionYear: int = Form(...),
    category: str = Form(...),
    cabinetNo: str = Form(...),
    shelfNo: str = Form(...),
    abstract: str = Form(...),
    keywords: str = Form(...),
    uploadedBy: str = Form(...),
    uploadDate: str = Form(...),

    cover: UploadFile | None = File(None),
    pdf: UploadFile | None = File(None),
):

    existing = thesis_collection.find_one({"id": thesis_id})

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    # Store old category
    old_category = existing["category"]

    # Convert strings into lists
    student_names = [
        name.strip()
        for name in studentNames.split(",")
        if name.strip()
    ]

    keyword_list = [
        keyword.strip()
        for keyword in keywords.split(",")
        if keyword.strip()
    ]

    # Keep old cover if not changed
    cover_url = existing["coverUrl"]

    if cover:
        cover_url = upload_image(cover.file)

    # Keep old PDF if not changed
    pdf_url = existing["pdfUrl"]

    if pdf:
        pdf_url = upload_pdf(pdf)

    updated_data = {
        "title": title,
        "studentNames": student_names,
        "supervisor": supervisor,
        "department": department,
        "submissionYear": submissionYear,
        "category": category,
        "cabinetNo": cabinetNo,
        "shelfNo": shelfNo,
        "abstract": abstract,
        "keywords": keyword_list,
        "coverUrl": cover_url,
        "pdfUrl": pdf_url,
        "uploadedBy": uploadedBy,
        "uploadDate": uploadDate,
    }

    thesis_collection.update_one(
        {"id": thesis_id},
        {"$set": updated_data}
    )

    # Update category counts only if category changed
    if old_category != category:

        category_collection.update_one(
    {"name": old_category},
    {
        "$inc": {
            "count": -1,
            "thesisCount": -1
        }
    }
)

        category_collection.update_one(
    {"name": category},
    {
        "$inc": {
            "count": 1,
            "thesisCount": 1
        }
    }
)

    updated = thesis_collection.find_one({"id": thesis_id})
    updated["_id"] = str(updated["_id"])

    return {
        "message": "Thesis updated successfully.",
        "thesis": updated
    }




# ==========================
# DELETE THESIS
# ==========================
@router.delete("/{thesis_id}")
async def delete_thesis(thesis_id: str):

    thesis = thesis_collection.find_one({"id": thesis_id})

    if not thesis:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    # Decrease category count
    category_collection.update_one(
    {"name": thesis["category"]},
    {
        "$inc": {
            "count": -1,
            "thesisCount": -1
        }
    }
)

    thesis_collection.delete_one({"id": thesis_id})

    return {
        "message": "Thesis deleted successfully."
    }


