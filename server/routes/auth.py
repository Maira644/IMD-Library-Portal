from fastapi import APIRouter, HTTPException
from config.db import (
    admin_collection,
    incharge_collection,
    student_collection,
)
from model.login_model import LoginRequest
from helper.auth_helper import verify_password
from helper.jwt_helper import create_access_token

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
    "createdAt": user["createdAt"],
    "active": user["active"]
}
    }