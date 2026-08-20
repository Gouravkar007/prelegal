import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.database import init_db, get_db_connection
from app.models import UserCreate, UserResponse, LoginRequest, LoginResponse

app = FastAPI(
    title="PreLegal V1 API",
    description="FastAPI backend and static server for PreLegal",
    version="1.0.0"
)

@app.on_event("startup")
def startup_db_client():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "PreLegal Backend",
        "database": "SQLite Initialized",
        "version": "1.0.0"
    }

@app.get("/api/users")
def list_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, name, created_at FROM users;")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row["id"],
            "email": row["email"],
            "name": row["name"],
            "created_at": str(row["created_at"])
        }
        for row in rows
    ]

@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, name) VALUES (?, ?);",
            (user.email, user.name)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.execute("SELECT id, email, name, created_at FROM users WHERE id = ?;", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return UserResponse(
            id=row["id"],
            email=row["email"],
            name=row["name"],
            created_at=str(row["created_at"])
        )
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=f"User creation failed: {str(e)}")

@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest):
    conn = get_db_connection()
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

    conn.close()
    user_resp = UserResponse(
        id=row["id"],
        email=row["email"],
        name=row["name"],
        created_at=str(row["created_at"])
    )
    return LoginResponse(
        status="success",
        message="Successfully authenticated (prototype mode)",
        user=user_resp
    )

# Static file serving for Next.js build
STATIC_DIR = os.getenv("STATIC_DIR", os.path.join(os.path.dirname(__file__), "..", "static_frontend"))

if os.path.exists(STATIC_DIR):
    app.mount("/_next", StaticFiles(directory=os.path.join(STATIC_DIR, "_next")), name="next_assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        target_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(target_path):
            return FileResponse(target_path)
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return health_check()
