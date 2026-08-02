from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.db import db
from routes.auth import router as auth_router
from routes.thesis import router as thesis_router
from routes.category import router as category_router
from routes.announcement import router as announcement_router
from routes.book import router as book_router
from routes.admin_routes import router as admin_router
from routes.theme import router as theme_router

app = FastAPI(
    title="Library Portal API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Library Portal Backend Running",
        "database": db.name
    }


@app.get("/health")
def health():
    return {
        "status": "OK",
        "mongodb": "Connected"
    }


# Routes
app.include_router(auth_router)
app.include_router(thesis_router)
app.include_router(category_router)
app.include_router(announcement_router)
app.include_router(book_router)
app.include_router(admin_router)
app.include_router(theme_router)

