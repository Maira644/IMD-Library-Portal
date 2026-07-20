from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.db import db
from routes.auth import router as auth_router

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

app.include_router(auth_router)