from pydantic import BaseModel, EmailStr


# Register Request
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


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

    class Config:
        from_attributes = True