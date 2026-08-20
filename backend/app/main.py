import os
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import init_db, get_db_connection
from app.models import UserCreate, UserResponse, LoginRequest, LoginResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database fresh on startup
    init_db()
    yield

app = FastAPI(
    title="PreLegal V1 API",
    description="FastAPI backend and static server for PreLegal",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "PreLegal Backend",
        "database": "SQLite Initialized",
        "version": "1.0.0"
    }

@app.get("/api/users", response_model=List[UserResponse])
def list_users():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, created_at FROM users;")
        rows = cursor.fetchall()
        return [
            UserResponse(
                id=row["id"],
                email=row["email"],
                name=row["name"],
                created_at=str(row["created_at"]) if row["created_at"] is not None else None
            )
            for row in rows
        ]
    finally:
        conn.close()

@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, name) VALUES (?, ?);",
            (user.email, user.name)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("SELECT id, email, name, created_at FROM users WHERE id = ?;", (user_id,))
        row = cursor.fetchone()
        return UserResponse(
            id=row["id"],
            email=row["email"],
            name=row["name"],
            created_at=str(row["created_at"]) if row["created_at"] is not None else None
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"User creation failed: {str(e)}")
    finally:
        conn.close()

@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, created_at FROM users WHERE email = ?;", (request.email,))
        row = cursor.fetchone()
        
        if not row:
            # Create user if email not found (fake login behavior)
            cursor.execute(
                "INSERT INTO users (email, name) VALUES (?, ?);",
                (request.email, request.email.split("@")[0].capitalize())
            )
            conn.commit()
            user_id = cursor.lastrowid
            cursor.execute("SELECT id, email, name, created_at FROM users WHERE id = ?;", (user_id,))
            row = cursor.fetchone()

        user_resp = UserResponse(
            id=row["id"],
            email=row["email"],
            name=row["name"],
            created_at=str(row["created_at"]) if row["created_at"] is not None else None
        )
        return LoginResponse(
            status="success",
            message="Successfully authenticated (prototype mode)",
            user=user_resp
        )
    finally:
        conn.close()

# Static file serving for Next.js build
STATIC_DIR = os.getenv("STATIC_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static_frontend")))
NEXT_ASSETS_DIR = os.path.join(STATIC_DIR, "_next")

if os.path.exists(NEXT_ASSETS_DIR):
    app.mount("/_next", StaticFiles(directory=NEXT_ASSETS_DIR), name="next_assets")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Do not serve frontend index HTML for unknown API endpoints
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")

    target_path = os.path.join(STATIC_DIR, full_path)
    if os.path.exists(STATIC_DIR) and os.path.isfile(target_path):
        return FileResponse(target_path)

    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(STATIC_DIR) and os.path.exists(index_path):
        return FileResponse(index_path)

    return health_check()
