from fastapi import APIRouter, HTTPException
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.database.fake_db import fake_users_db
from app.core.security import get_current_user
from fastapi import Depends
from app.core.roles import UserRole



router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

 
@router.post("/register", status_code=201)
def register(user: RegisterRequest):

    # Check if email already exists
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user.password)

    # Save user
    fake_users_db[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": UserRole.ADMIN  
    }

    return {
        "message": "User registered successfully"
    }


@router.post("/login", response_model=TokenResponse)
def login(user: LoginRequest):

    db_user = fake_users_db.get(user.email)

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token(
        {
            "sub": db_user["email"],
            "role": db_user["role"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }



@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "Current User",
        "user": current_user
    }
