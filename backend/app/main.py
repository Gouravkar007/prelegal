import os
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import init_db, get_db_connection
from app.models import (
    UserCreate, UserResponse, LoginRequest, LoginResponse,
    ChatRequest, ChatResponse, DocumentCreate, DocumentResponse
)
from app.ai_chat import process_ai_chat

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
        pwd = user.password or "password123"
        cursor.execute(
            "INSERT INTO users (email, name, password) VALUES (?, ?, ?);",
            (user.email, user.name, pwd)
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

@app.post("/api/auth/register", response_model=LoginResponse)
def register(user: UserCreate):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?;", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")

        pwd = user.password or "password123"
        cursor.execute(
            "INSERT INTO users (email, name, password) VALUES (?, ?, ?);",
            (user.email, user.name, pwd)
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
            message="User registered and authenticated successfully",
            user=user_resp
        )
    finally:
        conn.close()

@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, password, created_at FROM users WHERE email = ?;", (request.email,))
        row = cursor.fetchone()

        if not row:
            # Create user automatically if not existing (demo sign-in experience)
            pwd = request.password or "password123"
            display_name = request.email.split("@")[0].capitalize()
            cursor.execute(
                "INSERT INTO users (email, name, password) VALUES (?, ?, ?);",
                (request.email, display_name, pwd)
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
            message="Successfully authenticated",
            user=user_resp
        )
    finally:
        conn.close()

# Document Persistence Endpoints
@app.post("/api/documents", response_model=DocumentResponse)
def save_document(doc: DocumentCreate):
    import json
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        data_str = json.dumps(doc.data)
        cursor.execute(
            "INSERT INTO documents (user_id, title, document_type, data_json) VALUES (?, ?, ?, ?);",
            (doc.user_id, doc.title, doc.document_type, data_str)
        )
        conn.commit()
        doc_id = cursor.lastrowid
        cursor.execute("SELECT id, user_id, title, document_type, data_json, created_at, updated_at FROM documents WHERE id = ?;", (doc_id,))
        row = cursor.fetchone()
        return DocumentResponse(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            document_type=row["document_type"],
            data=json.loads(row["data_json"]),
            created_at=str(row["created_at"]) if row["created_at"] else None,
            updated_at=str(row["updated_at"]) if row["updated_at"] else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save document: {str(e)}")
    finally:
        conn.close()

@app.get("/api/documents", response_model=List[DocumentResponse])
def list_documents(user_id: Optional[int] = None):
    import json
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT id, user_id, title, document_type, data_json, created_at, updated_at FROM documents WHERE user_id = ? ORDER BY id DESC;", (user_id,))
        else:
            cursor.execute("SELECT id, user_id, title, document_type, data_json, created_at, updated_at FROM documents ORDER BY id DESC;")
        rows = cursor.fetchall()
        result = []
        for r in rows:
            result.append(DocumentResponse(
                id=r["id"],
                user_id=r["user_id"],
                title=r["title"],
                document_type=r["document_type"],
                data=json.loads(r["data_json"]),
                created_at=str(r["created_at"]) if r["created_at"] else None,
                updated_at=str(r["updated_at"]) if r["updated_at"] else None
            ))
        return result
    finally:
        conn.close()

@app.get("/api/documents/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: int):
    import json
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, user_id, title, document_type, data_json, created_at, updated_at FROM documents WHERE id = ?;", (doc_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
        return DocumentResponse(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            document_type=row["document_type"],
            data=json.loads(row["data_json"]),
            created_at=str(row["created_at"]) if row["created_at"] else None,
            updated_at=str(row["updated_at"]) if row["updated_at"] else None
        )
    finally:
        conn.close()

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM documents WHERE id = ?;", (doc_id,))
        conn.commit()
        return {"status": "success", "message": "Document deleted"}
    finally:
        conn.close()

@app.post("/api/chat", response_model=ChatResponse)
def ai_chat(request: ChatRequest):
    try:
        messages_dicts = [m.model_dump() for m in request.messages]
        result = process_ai_chat(messages_dicts, request.current_data)
        return ChatResponse(
            reply=result.get("reply", "I'm ready to help you fill out your NDA!"),
            updated_fields=result.get("updated_fields", {}),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")

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
