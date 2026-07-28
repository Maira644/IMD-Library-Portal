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
    "count": 0,
    "bookCount": 0,
    "thesisCount": 0
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

# ==========================
# UPDATE CATEGORY
# ==========================
@router.put("/{category_id}")
async def update_category(category_id: str, category: CategoryCreate):

    # Check if category exists
    existing = category_collection.find_one({
        "id": category_id
    })

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    # Check duplicate name
    duplicate = category_collection.find_one({
        "id": {"$ne": category_id},
        "name": {
            "$regex": f"^{category.name}$",
            "$options": "i"
        }
    })

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Category already exists."
        )

    category_collection.update_one(
        {"id": category_id},
        {
            "$set": {
                "name": category.name,
                "description": category.description
            }
        }
    )

    updated = category_collection.find_one({
        "id": category_id
    })

    updated["_id"] = str(updated["_id"])

    return {
        "message": "Category updated successfully.",
        "category": updated
    }

# ==========================
# DELETE CATEGORY
# ==========================
@router.delete("/{category_id}")
async def delete_category(category_id: str):

    # Check if category exists
    category = category_collection.find_one({"id": category_id})

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    # Delete category
    category_collection.delete_one({"id": category_id})

    return {
        "message": "Category deleted successfully."
    }