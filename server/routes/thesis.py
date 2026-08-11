from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from config.db import thesis_collection, category_collection

from helper.cloudinary_helper import (
    upload_image,
    upload_pdf,
    delete_asset,
    delete_pdf,
)

from helper.activity_helper import log_activity


router = APIRouter(
    prefix="/thesis",
    tags=["Thesis"]
)


# ============================================================
# CREATE THESIS
# ============================================================

@router.post("/")
async def create_thesis(
    id: str = Form(...),
    title: str = Form(...),
    studentNames: str = Form(""),
    supervisor: str = Form(...),
    department: str = Form(...),
    submissionYear: int = Form(...),
    category: str = Form(""),
    cabinetNo: str = Form(""),
    shelfNo: str = Form(""),
    abstract: str = Form(...),
    keywords: str = Form(...),
    uploadedBy: str = Form(...),
    uploadDate: str = Form(...),

    # Cover is optional
    cover: UploadFile | None = File(None),

    # PDF is optional
    pdf: UploadFile | None = File(None),
):

    # --------------------------------------------------------
    # Check duplicate Thesis ID
    # --------------------------------------------------------

    if thesis_collection.find_one({"id": id}):
        raise HTTPException(
            status_code=400,
            detail="Thesis ID already exists."
        )

    # --------------------------------------------------------
    # Convert student names into list
    # --------------------------------------------------------

    student_names = [
        name.strip()
        for name in studentNames.split(",")
        if name.strip()
    ]

    # --------------------------------------------------------
    # Convert keywords into list
    # --------------------------------------------------------

    keyword_list = [
        keyword.strip()
        for keyword in keywords.split(",")
        if keyword.strip()
    ]

    # --------------------------------------------------------
    # Upload cover only if selected
    # --------------------------------------------------------

    cover_url = None
    cover_public_id = None

    if cover:
        cover_url, cover_public_id = upload_image(
            cover.file
        )

    # --------------------------------------------------------
    # Upload PDF only if selected
    # --------------------------------------------------------

    pdf_url = None
    pdf_public_id = None

    if pdf:
        pdf_url, pdf_public_id = upload_pdf(
            pdf
        )

    # --------------------------------------------------------
    # Create thesis document
    # --------------------------------------------------------

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
        "coverPublicId": cover_public_id,
        "pdfUrl": pdf_url,
        "pdfPublicId": pdf_public_id,
        "uploadedBy": uploadedBy,
        "uploadDate": uploadDate,
        "views": 0,
    }

    # --------------------------------------------------------
    # Insert thesis
    # --------------------------------------------------------

    result = thesis_collection.insert_one(
        thesis
    )

    # --------------------------------------------------------
    # Log activity
    # --------------------------------------------------------

    log_activity(
        actor=uploadedBy,
        action="uploaded thesis",
        target=title
    )

    # --------------------------------------------------------
    # Increase category count
    # --------------------------------------------------------

    category_collection.update_one(
        {"name": category},
        {
            "$inc": {
                "count": 1,
                "thesisCount": 1
            }
        }
    )

    thesis["_id"] = str(
        result.inserted_id
    )

    return {
        "message": "Thesis created successfully.",
        "thesis": thesis
    }


# ============================================================
# GET ALL THESIS
# ============================================================

@router.get("/")
async def get_all_thesis():

    theses = list(
        thesis_collection.find()
    )

    for thesis in theses:
        thesis["_id"] = str(
            thesis["_id"]
        )

    return {
        "message": "Thesis fetched successfully.",
        "thesis": theses
    }


# ============================================================
# GET FYDP COUNT BY YEAR
# ============================================================

@router.get("/statistics/by-year")
async def get_fydp_by_year():

    yearly_data = list(
        thesis_collection.aggregate(
            [
                {
                    "$group": {
                        "_id": "$submissionYear",
                        "count": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$sort": {
                        "_id": -1
                    }
                }
            ]
        )
    )

    result = [
        {
            "year": item["_id"],
            "count": item["count"]
        }
        for item in yearly_data
    ]

    return {
        "message": "FYDP count by year fetched successfully.",
        "data": result
    }


# ============================================================
# GET MOST VIEWED THESIS
# ============================================================

@router.get("/most-viewed")
async def get_most_viewed_thesis():

    thesis = list(
        thesis_collection
        .find()
        .sort("views", -1)
        .limit(5)
    )

    for item in thesis:
        item["_id"] = str(
            item["_id"]
        )

    return {
        "message": "Most viewed thesis fetched successfully.",
        "thesis": thesis
    }


# ============================================================
# GET SINGLE THESIS
# ============================================================

@router.get("/{thesis_id}")
async def get_thesis_by_id(
    thesis_id: str
):

    thesis = thesis_collection.find_one(
        {
            "id": thesis_id
        }
    )

    if not thesis:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    thesis["_id"] = str(
        thesis["_id"]
    )

    return {
        "message": "Thesis fetched successfully.",
        "thesis": thesis
    }


# ============================================================
# INCREMENT THESIS VIEW
# ============================================================

@router.patch("/{thesis_id}/view")
async def increment_thesis_view(
    thesis_id: str
):

    thesis = thesis_collection.find_one(
        {
            "id": thesis_id
        }
    )

    if not thesis:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    thesis_collection.update_one(
        {
            "id": thesis_id
        },
        {
            "$inc": {
                "views": 1
            }
        }
    )

    return {
        "message": "Thesis view updated successfully."
    }


# ============================================================
# UPDATE THESIS
# ============================================================

@router.put("/{thesis_id}")
async def update_thesis(
    thesis_id: str,

    title: str = Form(...),
    studentNames: str = Form(""),
    supervisor: str = Form(...),
    department: str = Form(...),
    submissionYear: int = Form(...),
    category: str = Form(""),
    cabinetNo: str = Form(""),
    shelfNo: str = Form(""),
    abstract: str = Form(...),
    keywords: str = Form(...),
    uploadedBy: str = Form(...),
    uploadDate: str = Form(...),

    cover: UploadFile | None = File(None),
    pdf: UploadFile | None = File(None),
):

    # --------------------------------------------------------
    # Find existing thesis
    # --------------------------------------------------------

    existing = thesis_collection.find_one(
        {
            "id": thesis_id
        }
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    # --------------------------------------------------------
    # Store old category
    # --------------------------------------------------------

    old_category = existing["category"]

    # --------------------------------------------------------
    # Convert student names into list
    # --------------------------------------------------------

    student_names = [
        name.strip()
        for name in studentNames.split(",")
        if name.strip()
    ]

    # --------------------------------------------------------
    # Convert keywords into list
    # --------------------------------------------------------

    keyword_list = [
        keyword.strip()
        for keyword in keywords.split(",")
        if keyword.strip()
    ]

    # --------------------------------------------------------
    # Keep old cover if not changed
    # --------------------------------------------------------

    cover_url = existing.get(
        "coverUrl"
    )

    cover_public_id = existing.get(
        "coverPublicId"
    )

    if cover:

        if cover_public_id:
            delete_asset(
                cover_public_id
            )

        cover_url, cover_public_id = upload_image(
            cover.file
        )

    # --------------------------------------------------------
    # Keep old PDF if not changed
    # --------------------------------------------------------

    pdf_url = existing.get(
        "pdfUrl"
    )

    pdf_public_id = existing.get(
        "pdfPublicId"
    )

    if pdf:

        if pdf_public_id:
            delete_pdf(
                pdf_public_id
            )

        pdf_url, pdf_public_id = upload_pdf(
            pdf
        )

    # --------------------------------------------------------
    # Updated thesis data
    # --------------------------------------------------------

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
        "coverPublicId": cover_public_id,
        "pdfUrl": pdf_url,
        "pdfPublicId": pdf_public_id,
        "uploadedBy": uploadedBy,
        "uploadDate": uploadDate,
    }

    # --------------------------------------------------------
    # Update thesis
    # --------------------------------------------------------

    thesis_collection.update_one(
        {
            "id": thesis_id
        },
        {
            "$set": updated_data
        }
    )

    # --------------------------------------------------------
    # Update category counts if category changed
    # --------------------------------------------------------

    if old_category != category:

        category_collection.update_one(
            {
                "name": old_category
            },
            {
                "$inc": {
                    "count": -1,
                    "thesisCount": -1
                }
            }
        )

        category_collection.update_one(
            {
                "name": category
            },
            {
                "$inc": {
                    "count": 1,
                    "thesisCount": 1
                }
            }
        )

    # --------------------------------------------------------
    # Get updated thesis
    # --------------------------------------------------------

    updated = thesis_collection.find_one(
        {
            "id": thesis_id
        }
    )

    updated["_id"] = str(
        updated["_id"]
    )

    # --------------------------------------------------------
    # Log activity
    # --------------------------------------------------------

    log_activity(
        actor=uploadedBy,
        action="updated thesis",
        target=title
    )

    return {
        "message": "Thesis updated successfully.",
        "thesis": updated
    }


# ============================================================
# DELETE THESIS
# ============================================================

@router.delete("/{thesis_id}")
async def delete_thesis(
    thesis_id: str
):

    # --------------------------------------------------------
    # Find thesis
    # --------------------------------------------------------

    thesis = thesis_collection.find_one(
        {
            "id": thesis_id
        }
    )

    if not thesis:
        raise HTTPException(
            status_code=404,
            detail="Thesis not found."
        )

    # --------------------------------------------------------
    # Decrease category count
    # --------------------------------------------------------

    category_collection.update_one(
        {
            "name": thesis["category"]
        },
        {
            "$inc": {
                "count": -1,
                "thesisCount": -1
            }
        }
    )

    # --------------------------------------------------------
    # Delete cover from Cloudinary
    # --------------------------------------------------------

    if thesis.get("coverPublicId"):
        delete_asset(
            thesis["coverPublicId"]
        )

    # --------------------------------------------------------
    # Delete PDF from Cloudinary
    # --------------------------------------------------------

    if thesis.get("pdfPublicId"):
        delete_pdf(
            thesis["pdfPublicId"]
        )

    # --------------------------------------------------------
    # Delete thesis
    # --------------------------------------------------------

    thesis_collection.delete_one(
        {
            "id": thesis_id
        }
    )

    # --------------------------------------------------------
    # Log activity
    # --------------------------------------------------------

    log_activity(
        actor=thesis["uploadedBy"],
        action="deleted thesis",
        target=thesis["title"]
    )

    return {
        "message": "Thesis deleted successfully."
    }