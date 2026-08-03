from fastapi import APIRouter, HTTPException
from datetime import datetime
from fastapi import Depends
from helper.jwt_helper import require_roles
from config.db import incharge_collection

from model.incharge_model import CreateIncharge

from helper.id_generator import generate_incharge_id
from helper.password_generator import generate_password
from helper.auth_helper import hash_password
from helper.email_helper import send_incharge_credentials
from helper.activity_helper import log_activity

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/create-incharge")
def create_incharge(
    data: CreateIncharge,
    admin=Depends(require_roles("admin"))
):

    # Check username
    existing_username = incharge_collection.find_one(
        {"username": data.username}
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )

    # Check email
    existing_email = incharge_collection.find_one(
        {"email": data.email}
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    # Generate ID
    incharge_id = generate_incharge_id()

    # Generate temporary password
    temporary_password = generate_password()

    # Hash password
    hashed_password = hash_password(temporary_password)

    # Create document
    new_incharge = {
    "inchargeId": incharge_id,
    "name": data.name,
    "username": data.username,
    "email": data.email,
    "department": data.department,
    "password": hashed_password,
    "role": "incharge",
    "createdAt": datetime.utcnow().isoformat(),
    "active": True,

    # Password reset
    "resetToken": None,
    "resetTokenExpiry": None,
}

    # Save to MongoDB
    incharge_collection.insert_one(new_incharge)

    log_activity(
        actor="Admin",
        action="created incharge",
        target=data.name
    )

    # Send Email
    send_incharge_credentials(
        recipient_email=data.email,
        name=data.name,
        username=data.username,
        password=temporary_password,
        incharge_id=incharge_id
    )

    return {
        "message": "Incharge created successfully.",
        "inchargeId": incharge_id
    }


@router.get("/incharges")
def get_all_incharges(
    admin=Depends(require_roles("admin"))
):

    incharges = []

    for item in incharge_collection.find({}, {"_id": 0}):

        incharges.append(item)

    return incharges

@router.put("/incharges/{incharge_id}")
def update_incharge(
    incharge_id: str,
    data: CreateIncharge,
    admin=Depends(require_roles("admin"))
):

    existing = incharge_collection.find_one(
        {"inchargeId": incharge_id}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Incharge not found."
        )

    # Check username uniqueness
    username_exists = incharge_collection.find_one({
        "username": data.username,
        "inchargeId": {"$ne": incharge_id}
    })

    if username_exists:
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )

    # Check email uniqueness
    email_exists = incharge_collection.find_one({
        "email": data.email,
        "inchargeId": {"$ne": incharge_id}
    })

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    incharge_collection.update_one(
        {"inchargeId": incharge_id},
        {
            "$set": {
                "name": data.name,
                "username": data.username,
                "email": data.email,
                "department": data.department
            }
        }
    )

    log_activity(
        actor="Admin",
        action="updated incharge",
        target=data.name
    )

    return {
        "message": "Incharge updated successfully."
    }

@router.patch("/incharges/{incharge_id}/status")
def toggle_incharge_status(
    incharge_id: str,
    admin=Depends(require_roles("admin"))
):

    incharge = incharge_collection.find_one(
        {"inchargeId": incharge_id}
    )

    if not incharge:
        raise HTTPException(
            status_code=404,
            detail="Incharge not found."
        )

    new_status = not incharge["active"]

    incharge_collection.update_one(
        {"inchargeId": incharge_id},
        {
            "$set": {
                "active": new_status
            }
        }
    )

    return {
        "message": f"Incharge {'activated' if new_status else 'deactivated'} successfully."
    }

@router.delete("/incharges/{incharge_id}")
def delete_incharge(
    incharge_id: str,
    admin=Depends(require_roles("admin"))
):

    existing = incharge_collection.find_one(
        {"inchargeId": incharge_id}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Incharge not found."
        )

    log_activity(
        actor="Admin",
        action="deleted incharge",
        target=existing["name"]
    )

    incharge_collection.delete_one(
        {"inchargeId": incharge_id}
    )

    return {
        "message": "Incharge deleted successfully."
    }