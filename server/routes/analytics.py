from fastapi import APIRouter
from config.db import (
    search_keyword_collection,
    activity_collection,
)
from datetime import datetime, timezone

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
        .limit(8)
    )

    return {
        "message": "Top keywords fetched successfully.",
        "keywords": keywords,
    }


# ==========================
# FORMAT RELATIVE TIME
# ==========================
def format_relative_time(activity_time):

    now = datetime.now(timezone.utc)

    # If datetime is naive, treat it as UTC
    if activity_time.tzinfo is None:
        activity_time = activity_time.replace(tzinfo=timezone.utc)

    diff = now - activity_time

    seconds = int(diff.total_seconds())

    if seconds < 60:
        return "just now"

    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes}m ago"

    elif seconds < 86400:
        hours = seconds // 3600
        return f"{hours}h ago"

    elif seconds < 2592000:
        days = seconds // 86400
        return f"{days}d ago"

    elif seconds < 31536000:
        months = seconds // 2592000
        return f"{months}mo ago"

    else:
        years = seconds // 31536000
        return f"{years}y ago"


# ==========================
# RECENT ACTIVITY
# ==========================
@router.get("/recent-activity")
async def get_recent_activity():

    activities = list(
        activity_collection.find(
            {},
            {
                "_id": 0
            }
        )
        .sort("time", -1)
        .limit(5)
    )

    for activity in activities:
        activity["time"] = format_relative_time(activity["time"])

    return {
        "message": "Recent activity fetched successfully.",
        "activities": activities,
    }