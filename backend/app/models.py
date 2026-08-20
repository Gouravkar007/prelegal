from pydantic import BaseModel, EmailStr
from typing import Optional

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
