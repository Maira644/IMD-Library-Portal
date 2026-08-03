from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends

from config.db import announcement_collection
from model.announcement_model import AnnouncementCreate
from helper.jwt_helper import get_current_user, require_roles
from helper.activity_helper import log_activity

router = APIRouter(
    prefix="/announcement",
    tags=["Announcement"]
)


# ==========================
# CREATE ANNOUNCEMENT
# ==========================
@router.post("/")
async def create_announcement(
    announcement: AnnouncementCreate,
    user: dict = Depends(require_roles("admin", "incharge"))
):

    # Generate Announcement ID
    last_announcement = announcement_collection.find_one(
        sort=[("id", -1)]
    )

    if last_announcement:
        last_number = int(last_announcement["id"].split("-")[1])
        new_id = f"ANN-{last_number + 1:03d}"
    else:
        new_id = "ANN-001"

    new_announcement = {
        "id": new_id,
        "title": announcement.title,
        "body": announcement.body,
        "imageUrl": announcement.imageUrl,
        "pinned": announcement.pinned,
        "expiresAt": announcement.expiresAt,
        "createdBy": user["username"],
        "createdAt": datetime.utcnow().isoformat()
    }

    result = announcement_collection.insert_one(new_announcement)

    log_activity(
        actor=user["username"].title(),
        action="created announcement",
        target=announcement.title
    )

    new_announcement["_id"] = str(result.inserted_id)

    return {
        "message": "Announcement created successfully.",
        "announcement": new_announcement
    }

# ==========================
# GET ALL ANNOUNCEMENTS
# ==========================
@router.get("/")
async def get_all_announcements():

    announcements = list(
        announcement_collection.find().sort("createdAt", -1)
    )

    for announcement in announcements:
        announcement["_id"] = str(announcement["_id"])

    return {
        "message": "Announcements fetched successfully.",
        "announcements": announcements
    }

# ==========================
# GET ANNOUNCEMENT BY ID
# ==========================
@router.get("/{announcement_id}")
async def get_announcement_by_id(
    announcement_id: str,
    user: dict = Depends(get_current_user)
):

    announcement = announcement_collection.find_one({"id": announcement_id})

    if not announcement:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found."
        )

    announcement["_id"] = str(announcement["_id"])

    return {
        "message": "Announcement fetched successfully.",
        "announcement": announcement
    }

# ==========================
# UPDATE ANNOUNCEMENT
# ==========================
@router.put("/{announcement_id}")
async def update_announcement(
    announcement_id: str,
    announcement: AnnouncementCreate,
    user: dict = Depends(require_roles("admin", "incharge"))
):

    existing = announcement_collection.find_one({"id": announcement_id})

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found."
        )

    announcement_collection.update_one(
        {"id": announcement_id},
        {
            "$set": {
                "title": announcement.title,
                "body": announcement.body,
                "imageUrl": announcement.imageUrl,
                "pinned": announcement.pinned,
                "expiresAt": announcement.expiresAt,
            }
        }
    )

    updated = announcement_collection.find_one({"id": announcement_id})
    updated["_id"] = str(updated["_id"])

    log_activity(
        actor=user["username"].title(),
        action="updated announcement",
        target=announcement.title
    )

    return {
        "message": "Announcement updated successfully.",
        "announcement": updated
    }

# ==========================
# TOGGLE PIN
# ==========================
@router.patch("/{announcement_id}/pin")
async def toggle_pin(
    announcement_id: str,
    user: dict = Depends(require_roles("admin", "incharge"))
):

    existing = announcement_collection.find_one({"id": announcement_id})

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found."
        )

    new_pinned = not existing.get("pinned", False)

    announcement_collection.update_one(
        {"id": announcement_id},
        {"$set": {"pinned": new_pinned}}
    )

    updated = announcement_collection.find_one({"id": announcement_id})
    updated["_id"] = str(updated["_id"])

    return {
        "message": "Announcement pinned." if new_pinned else "Announcement unpinned.",
        "announcement": updated
    }

# ==========================
# DELETE ANNOUNCEMENT
# ==========================
@router.delete("/{announcement_id}")
async def delete_announcement(
    announcement_id: str,
    user: dict = Depends(require_roles("admin", "incharge"))
):

    announcement = announcement_collection.find_one({"id": announcement_id})

    if not announcement:
        raise HTTPException(
            status_code=404,
            detail="Announcement not found."
        )

    log_activity(
        actor=user["username"].title(),
        action="deleted announcement",
        target=announcement["title"]
    )

    announcement_collection.delete_one({"id": announcement_id})

    return {
        "message": "Announcement deleted successfully."
    }