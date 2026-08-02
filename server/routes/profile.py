from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from helper.jwt_helper import get_current_user, require_roles
from helper.auth_helper import hash_password, verify_password
from helper.cloudinary_helper import upload_avatar, delete_asset
from config.db import admin_collection, incharge_collection, student_collection
from model.profile_model import UpdateProfileRequest

router = APIRouter(prefix="/profile", tags=["Profile"])

COLLECTIONS = {
    "admin": admin_collection,
    "incharge": incharge_collection,
    "student": student_collection,
}

ID_FIELDS = {
    "admin": "adminId",
    "incharge": "inchargeId",
    "student": "studentId",
}


def _serialize(user: dict, role: str) -> dict:
    return {
        "id": user.get(ID_FIELDS[role]),
        "username": user["username"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "department": user.get("department"),
        "avatar": user.get("avatar"),
        "createdAt": user["createdAt"],
        "active": user["active"],
    }


@router.get("/me")
def get_my_profile(current=Depends(get_current_user)):
    role = current["role"]
    collection = COLLECTIONS.get(role)

    if collection is None:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = collection.find_one({"username": current["username"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return _serialize(user, role)


@router.put("/me")
def update_my_profile(
    data: UpdateProfileRequest,
    current=Depends(require_roles("admin", "incharge"))
):
    role = current["role"]
    collection = COLLECTIONS[role]

    user = collection.find_one({"username": current["username"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    username_exists = collection.find_one({
        "username": data.username,
        "_id": {"$ne": user["_id"]}
    })

    if username_exists:
        raise HTTPException(status_code=400, detail="Username already exists.")

    email_exists = collection.find_one({
        "email": data.email,
        "_id": {"$ne": user["_id"]}
    })

    if email_exists:
        raise HTTPException(status_code=400, detail="Email already exists.")

    update_fields = {
        "name": data.name,
        "username": data.username,
        "email": data.email,
    }

    if data.department is not None:
        update_fields["department"] = data.department

    if data.newPassword:
        if not data.currentPassword:
            raise HTTPException(
                status_code=400,
                detail="Current password is required to set a new password."
            )

        if not verify_password(data.currentPassword, user["password"]):
            raise HTTPException(
                status_code=400,
                detail="Current password is incorrect."
            )

        update_fields["password"] = hash_password(data.newPassword)

    collection.update_one(
        {"_id": user["_id"]},
        {"$set": update_fields}
    )

    updated_user = collection.find_one({"_id": user["_id"]})

    return {
        "message": "Profile updated successfully.",
        "user": _serialize(updated_user, role)
    }


@router.post("/me/avatar")
def upload_my_avatar(
    file: UploadFile = File(...),
    current=Depends(require_roles("admin", "incharge"))
):
    role = current["role"]
    collection = COLLECTIONS[role]

    user = collection.find_one({"username": current["username"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # remove old avatar from Cloudinary if one exists, to avoid orphaned files
    if user.get("avatarPublicId"):
        delete_asset(user["avatarPublicId"])

    avatar_url, public_id = upload_avatar(file.file)

    collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"avatar": avatar_url, "avatarPublicId": public_id}}
    )

    updated_user = collection.find_one({"_id": user["_id"]})

    return {
        "message": "Profile picture updated successfully.",
        "user": _serialize(updated_user, role)
    }


@router.delete("/me/avatar")
def delete_my_avatar(current=Depends(require_roles("admin", "incharge"))):
    role = current["role"]
    collection = COLLECTIONS[role]

    user = collection.find_one({"username": current["username"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("avatarPublicId"):
        delete_asset(user["avatarPublicId"])

    collection.update_one(
        {"_id": user["_id"]},
        {"$unset": {"avatar": "", "avatarPublicId": ""}}
    )

    updated_user = collection.find_one({"_id": user["_id"]})

    return {
        "message": "Profile picture removed.",
        "user": _serialize(updated_user, role)
    }