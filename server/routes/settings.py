from fastapi import APIRouter, Depends, HTTPException
from config.db import settings_collection
from helper.jwt_helper import require_roles, get_current_user
from model.settings_model import UpdateSettings

router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULTS = {
    "siteName": "IMD Library Portal",
    "tagline": "A modern university digital library.",
    "footer": "© IMD Library · All resources are for academic use only.",
    "studentProfileEditable": False,
}


def _get_or_create():
    settings = settings_collection.find_one({"_key": "site_settings"})
    if not settings:
        doc = {"_key": "site_settings", **DEFAULTS}
        settings_collection.insert_one(doc)
        settings = doc
    return settings


def _serialize(settings):
    return {
        "siteName": settings.get("siteName", DEFAULTS["siteName"]),
        "tagline": settings.get("tagline", DEFAULTS["tagline"]),
        "footer": settings.get("footer", DEFAULTS["footer"]),
        "studentProfileEditable": settings.get("studentProfileEditable", False),
    }


@router.get("/")
def get_settings(current=Depends(get_current_user)):
    return _serialize(_get_or_create())


@router.put("/")
def update_settings(data: UpdateSettings, admin=Depends(require_roles("admin"))):
    update_fields = {k: v for k, v in data.dict().items() if v is not None}

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update.")

    settings_collection.update_one(
        {"_key": "site_settings"},
        {"$set": update_fields},
        upsert=True
    )

    return {
        "message": "Settings updated successfully.",
        "settings": _serialize(_get_or_create())
    }