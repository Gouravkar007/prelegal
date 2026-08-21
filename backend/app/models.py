from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

class UserCreate(BaseModel):
    email: str
    name: str
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None

class LoginResponse(BaseModel):
    status: str
    message: str
    user: UserResponse

class DocumentCreate(BaseModel):
    user_id: int
    title: str
    document_type: str
    data: Dict[str, Any]

class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    document_type: str
    data: Dict[str, Any]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_data: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    updated_fields: dict
    status: str = "success"

