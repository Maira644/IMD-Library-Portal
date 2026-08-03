from config.db import (
    admin_collection,
    incharge_collection,
)


def find_user_by_email(email: str):
    user = incharge_collection.find_one({"email": email})
    if user:
        return user, incharge_collection

    user = admin_collection.find_one({"email": email})
    if user:
        return user, admin_collection

    return None, None


def find_user_by_reset_token(hashed_token: str):
    user = incharge_collection.find_one(
        {"resetToken": hashed_token}
    )
    if user:
        return user, incharge_collection

    user = admin_collection.find_one(
        {"resetToken": hashed_token}
    )
    if user:
        return user, admin_collection

    return None, None