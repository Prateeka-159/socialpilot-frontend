from pydantic import BaseModel, EmailStr
from typing import Optional

# Register Request
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    role: Optional[str] = "Content Creator"

# Login Request
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# JWT Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# User Response
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    bio: Optional[str] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None