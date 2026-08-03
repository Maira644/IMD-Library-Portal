from fastapi import APIRouter
from config.db import search_keyword_collection

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ==========================
# TOP SEARCHED KEYWORDS
# ==========================
@router.get("/top-keywords")
async def get_top_keywords():

    keywords = list(
        search_keyword_collection.find(
            {},
            {
                "_id": 0
            }
        )
        .sort("count", -1)
        .limit(10)
    )

    return {
        "message": "Top keywords fetched successfully.",
        "keywords": keywords,
    }