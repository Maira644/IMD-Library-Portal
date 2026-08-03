from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
from config.db import (
    admin_collection,
    incharge_collection,
    student_collection,
)
from model.login_model import LoginRequest
from helper.auth_helper import verify_password
from helper.jwt_helper import create_access_token
from datetime import datetime, timedelta

from model.password_reset_model import (
    ForgotPasswordRequest,
)

from model.password_reset_model import ( 
    ResetPasswordRequest
)

from helper.reset_token_helper import (
    generate_reset_token,
)

from helper.email_helper import (
    send_password_reset_link,
)

from helper.reset_token_helper import hash_reset_token
from helper.auth_helper import hash_password
from helper.password_reset_helper import (
    find_user_by_email,
    find_user_by_reset_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
async def login(login_data: LoginRequest):

    if login_data.role == "admin":
        user = admin_collection.find_one(
            {"username": login_data.username}
        )

    elif login_data.role == "incharge":
        user = incharge_collection.find_one(
            {"username": login_data.username}
        )

    elif login_data.role == "student":
        user = student_collection.find_one(
        {"username": login_data.username}
    )

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        login_data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token({
        "username": user["username"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
    "id": (
        user["adminId"]
        if user["role"] == "admin"
        else user["inchargeId"]
        if user["role"] == "incharge"
        else user["studentId"]
    ),
    "username": user["username"],
    "name": user["name"],
    "email": user["email"],
    "role": user["role"],
    "department": user.get("department"),
    "avatar": user.get("avatar"),
    "createdAt": user["createdAt"],
    "active": user["active"]
}
    }

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):

    # Find Incharge
    # Search Incharge first
    user = incharge_collection.find_one(
        {"email": data.email}
    )

    collection = incharge_collection

    # If not found, search Admin
    if not user:
        user = admin_collection.find_one(
            {"email": data.email}
        )
        collection = admin_collection

    # Always return the same response
    # Don't reveal whether the email exists.
    if not user:
        return {
            "message":
            "If an account exists, a password reset link has been sent."
        }

    # Generate secure token
    raw_token, hashed_token = generate_reset_token()

    expiry = datetime.utcnow() + timedelta(minutes=15)

    # Save hashed token
    collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "resetToken": hashed_token,
                "resetTokenExpiry": expiry
            }
        }
    )

    reset_link = (
    f"{FRONTEND_URL}/reset-password/{raw_token}"
)

    send_password_reset_link(
        recipient_email=user["email"],
        name=user["name"],
        reset_link=reset_link
    )

    return {
        "message":
        "If an account exists, a password reset link has been sent."
    }


@router.get("/validate-reset-token")
async def validate_reset_token(token: str):

    hashed_token = hash_reset_token(token)

    user = incharge_collection.find_one(
        {
            "resetToken": hashed_token
        }
    )

    # Search Admin if not found
    if not user:
        user = admin_collection.find_one(
            {
                "resetToken": hashed_token
            }
        )

    if not user:
        return {
            "valid": False,
            "message": "Reset link is invalid or has expired."
        }

    expiry = user.get("resetTokenExpiry")

    if not expiry or expiry < datetime.utcnow():
        return {
            "valid": False,
            "message": "Reset link is invalid or has expired."
        }

    return {
        "valid": True,
        "message": "Token is valid."
    }

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):

    hashed_token = hash_reset_token(data.token)

    user = incharge_collection.find_one(
        {
            "resetToken": hashed_token
        }
    )

    collection = incharge_collection

    # Search Admin
    if not user:
        user = admin_collection.find_one(
            {
                "resetToken": hashed_token
            }
        )

        collection = admin_collection

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link."
        )

    expiry = user.get("resetTokenExpiry")

    if not expiry or expiry < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Reset link has expired."
        )

    hashed_password = hash_password(data.password)

    collection.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password": hashed_password
            },
            "$unset": {
                "resetToken": "",
                "resetTokenExpiry": ""
            }
        }
    )

    return {
        "message": "Password reset successfully."
    }