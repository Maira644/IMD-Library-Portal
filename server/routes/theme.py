from fastapi import APIRouter
from pydantic import BaseModel
from config.db import theme_collection

router = APIRouter(
    prefix="/theme",
    tags=["Theme"]
)


# ==========================
# THEME MODEL
# ==========================
class ThemeModel(BaseModel):
    mode: str
    primaryHue: int
    radius: int
    sidebarStyle: str
    cardStyle: str
    animationSpeed: float
    fontScale: float
    compact: bool


# ==========================
# DEFAULT THEME
# ==========================
DEFAULT_THEME = {
    "mode": "light",
    "primaryHue": 255,
    "radius": 12,
    "sidebarStyle": "solid",
    "cardStyle": "elevated",
    "animationSpeed": 1,
    "fontScale": 1,
    "compact": False,
}


# ==========================
# GET THEME
# ==========================
@router.get("/")
async def get_theme():

    theme = theme_collection.find_one()

    # Create default theme if it doesn't exist
    if theme is None:

        theme_collection.insert_one(DEFAULT_THEME.copy())

        return {
            "message": "Theme created successfully.",
            "theme": DEFAULT_THEME,
        }

    # Remove MongoDB ObjectId before returning
    theme.pop("_id", None)

    return {
        "message": "Theme fetched successfully.",
        "theme": theme,
    }


# ==========================
# UPDATE THEME
# ==========================
@router.put("/")
async def update_theme(theme: ThemeModel):

    theme_collection.update_one(
        {},
        {
            "$set": theme.model_dump()
        },
        upsert=True,
    )

    updated_theme = theme_collection.find_one()

    if updated_theme:
        updated_theme.pop("_id", None)

    return {
        "message": "Theme updated successfully.",
        "theme": updated_theme,
    }