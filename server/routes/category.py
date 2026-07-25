from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.db import category_collection

router = APIRouter(
    prefix="/category",
    tags=["Category"]
)


class CategoryCreate(BaseModel):
    name: str
    description: str = ""


# ==========================
# CREATE CATEGORY
# ==========================
@router.post("/")
async def create_category(category: CategoryCreate):

    # Check duplicate category name
    existing = category_collection.find_one({
        "name": {
            "$regex": f"^{category.name}$",
            "$options": "i"
        }
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Category already exists."
        )

    # Generate Category ID
    last_category = category_collection.find_one(
        sort=[("id", -1)]
    )

    if last_category:
        last_number = int(last_category["id"].split("-")[1])
        new_id = f"CAT-{last_number + 1:03d}"
    else:
        new_id = "CAT-001"

    new_category = {
        "id": new_id,
        "name": category.name,
        "description": category.description,
        "count": 0
    }

    result = category_collection.insert_one(new_category)

    new_category["_id"] = str(result.inserted_id)

    return {
        "message": "Category created successfully.",
        "category": new_category
    }

# ==========================
# GET ALL CATEGORIES
# ==========================
@router.get("/")
async def get_all_categories():

    categories = list(
        category_collection.find().sort("id", 1)
    )

    for category in categories:
        category["_id"] = str(category["_id"])

    return {
        "message": "Categories fetched successfully.",
        "categories": categories
    }

# ==========================
# GET CATEGORY BY ID
# ==========================
@router.get("/{category_id}")
async def get_category_by_id(category_id: str):

    category = category_collection.find_one({"id": category_id})

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    category["_id"] = str(category["_id"])

    return {
        "message": "Category fetched successfully.",
        "category": category
    }