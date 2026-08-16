from fastapi import APIRouter, Query
from pydantic import BaseModel

from config.db import (
    book_collection,
    thesis_collection,
    search_keyword_collection,
)


router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


# ============================================================
# SEARCH
# ============================================================

@router.get("/")
async def search_library(
    q: str = Query(..., min_length=1)
):

    q = q.strip()

    regex = {
        "$regex": q,
        "$options": "i"
    }

    results = []

    # ========================================================
    # ROLL NUMBER SEARCH
    #
    # If query starts with IM-, search ONLY FYDPs.
    # Subtitle will show student roll numbers.
    # ========================================================

    if q.upper().startswith("IM-"):

        thesis = list(
            thesis_collection.find(
                {
                    "studentRollNos": regex
                }
            ).limit(6)
        )

        for item in thesis:

            matched_keyword = None

            for keyword in item.get("keywords", []):
                if keyword.lower().startswith(q.lower()):
                    matched_keyword = keyword
                    break

            results.append(
                {
                    "type": "thesis",
                    "id": item["id"],
                    "title": item["title"],

                    # Roll number search
                    "subtitle": ", ".join(
                        item.get("studentRollNos", [])
                    ),

                    "matchedKeyword": matched_keyword,
                }
            )

        return {
            "message": "Search completed successfully.",
            "results": results,
        }


    # ========================================================
    # NORMAL SEARCH
    #
    # Searches both books and FYDPs.
    #
    # Books:
    # subtitle = author
    #
    # FYDPs:
    # subtitle = supervisor
    # ========================================================

    books = list(
        book_collection.find(
            {
                "$or": [
                    {"title": regex},
                    {"author": regex},
                    {"keywords": regex},
                ]
            }
        ).limit(6)
    )


    thesis = list(
        thesis_collection.find(
            {
                "$or": [
                    {"title": regex},
                    {"studentNames": regex},
                    {"studentRollNos": regex},
                    {"keywords": regex},
                ]
            }
        ).limit(6)
    )


    # ========================================================
    # BOOK RESULTS
    # ========================================================

    for book in books:

        matched_keyword = None

        for keyword in book.get("keywords", []):

            if keyword.lower().startswith(
                q.lower()
            ):
                matched_keyword = keyword
                break

        results.append(
            {
                "type": "book",
                "id": book["id"],
                "title": book["title"],

                # Book subtitle = author
                "subtitle": book.get(
                    "author",
                    ""
                ),

                "matchedKeyword": matched_keyword,
            }
        )


    # ========================================================
    # THESIS / FYDP RESULTS
    # ========================================================

    for item in thesis:

        matched_keyword = None

        for keyword in item.get("keywords", []):

            if keyword.lower().startswith(
                q.lower()
            ):
                matched_keyword = keyword
                break

        results.append(
            {
                "type": "thesis",
                "id": item["id"],
                "title": item["title"],

                # Normal FYDP search subtitle = supervisor
                "subtitle": item.get(
                    "supervisor",
                    ""
                ),

                "matchedKeyword": matched_keyword,
            }
        )


    # ========================================================
    # RETURN SEARCH RESULTS
    # ========================================================

    return {
        "message": "Search completed successfully.",
        "results": results,
    }


# ============================================================
# RECORD SEARCH KEYWORD
# ============================================================

class SearchKeyword(BaseModel):
    keyword: str


@router.post("/record")
async def record_search(
    data: SearchKeyword
):

    keyword = data.keyword.strip().lower()

    if not keyword:

        return {
            "message": "No keyword to record."
        }


    search_keyword_collection.update_one(
        {
            "keyword": keyword
        },
        {
            "$inc": {
                "count": 1
            }
        },
        upsert=True,
    )


    return {
        "message": "Keyword recorded successfully."
    }


# ============================================================
# TOP SEARCH KEYWORDS
# ============================================================

@router.get("/top-keywords")
async def get_top_keywords():

    keywords = list(
        search_keyword_collection.find(
            {},
            {
                "_id": 0
            }
        )
        .sort(
            "count",
            -1
        )
        .limit(8)
    )


    return {
        "message": "Top keywords fetched successfully.",
        "keywords": keywords,
    }