from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.core.postgres import get_db
from app.models.sql_models import User, UserRoleEnum, UserStatusEnum, NotificationPreference, DashboardStatistic
from app.core.security import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", status_code=201)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Map role string to enum
    role_enum = UserRoleEnum.CONTENT_CREATOR
    if user_data.role:
        for r in UserRoleEnum:
            if r.value.lower() == user_data.role.lower() or r.name.lower() == user_data.role.lower():
                role_enum = r
                break

    # Save user to PostgreSQL
    new_user = User(
        full_name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        phone=user_data.phone,
        bio=user_data.bio,
        location=user_data.location,
        role=role_enum,
        status=UserStatusEnum.ACTIVE
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize default NotificationPreferences and DashboardStatistics
    notif_pref = NotificationPreference(user_id=new_user.user_id)
    db_stat = DashboardStatistic(user_id=new_user.user_id)
    db.add(notif_pref)
    db.add(db_stat)
    db.commit()

    return {
        "message": "User registered successfully",
        "user_id": new_user.user_id,
        "email": new_user.email
    }


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == login_data.email).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(login_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role.value
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    user_email = current_user.get("sub") if isinstance(current_user, dict) else current_user
    db_user = db.query(User).filter(User.email == user_email).first()
    if not db_user:
        return {"message": "Current User", "user": current_user}
    return {
        "message": "Current User",
        "user": {
            "user_id": db_user.user_id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role.value,
            "bio": db_user.bio,
            "location": db_user.location,
            "status": db_user.status.value,
            "created_at": db_user.created_at.isoformat() if db_user.created_at else None
        }
    }
