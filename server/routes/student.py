from fastapi import APIRouter, HTTPException, Depends
from helper.jwt_helper import require_roles
from helper.auth_helper import hash_password
from config.db import student_collection
from model.student_model import UpdateStudent

router = APIRouter(prefix="/admin/student", tags=["Admin - Student"])


@router.get("/")
def get_student(admin=Depends(require_roles("admin"))):
    student = student_collection.find_one({}, {"_id": 0, "password": 0})

    if not student:
        raise HTTPException(status_code=404, detail="Student account not found.")

    return student


@router.put("/")
def update_student(
    data: UpdateStudent,
    admin=Depends(require_roles("admin"))
):
    student = student_collection.find_one({})

    if not student:
        raise HTTPException(status_code=404, detail="Student account not found.")

    student_id = student["studentId"]

    username_exists = student_collection.find_one({
        "username": data.username,
        "studentId": {"$ne": student_id}
    })
    if username_exists:
        raise HTTPException(status_code=400, detail="Username already exists.")

    email_exists = student_collection.find_one({
        "email": data.email,
        "studentId": {"$ne": student_id}
    })
    if email_exists:
        raise HTTPException(status_code=400, detail="Email already exists.")

    update_fields = {
        "name": data.name,
        "username": data.username,
        "email": data.email,
        "department": data.department,
    }

    if data.newPassword:
        update_fields["password"] = hash_password(data.newPassword)

    student_collection.update_one(
        {"studentId": student_id},
        {"$set": update_fields}
    )

    return {"message": "Student account updated successfully."}