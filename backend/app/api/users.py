from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.schemas.auth import UpdateProfileRequest
from app.core.postgres import get_db
from app.models.sql_models import User
from app.core.rbac import require_roles
from app.core.roles import UserRole

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user["sub"]

    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user": {
            "id": db_user.user_id,
            "name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role.value,
            "phone": db_user.phone or "",
            "location": db_user.location or "",
            "bio": db_user.bio or ""
        }
    }

@router.put("/me")
def update_profile(
    user_data: UpdateProfileRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email = current_user["sub"]

    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user_data.name is not None:
        db_user.full_name = user_data.name

    if user_data.phone is not None:
        db_user.phone = user_data.phone

    if user_data.location is not None:
        db_user.location = user_data.location

    if user_data.bio is not None:
        db_user.bio = user_data.bio

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": db_user.user_id,
            "name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role.value,
            "phone": db_user.phone or "",
            "location": db_user.location or "",
            "bio": db_user.bio or ""
        }
    }

@router.get("/")
def get_all_users(
    current_user=Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.user_id).all()

    return {
        "total_users": len(users),
        "users": [
            {
                "id": user.user_id,
                "name": user.full_name,
                "email": user.email,
                "role": user.role.value
            }
            for user in users
        ]
    }



@router.delete("/{email}")
def delete_user(
    email: str,
    current_user=Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    deleted_user = {
        "name": db_user.full_name,
        "email": db_user.email,
        "role": db_user.role.value
    }

    db.delete(db_user)
    db.commit()

    return {
        "message": "User deleted successfully",
        "deleted_user": deleted_user
    }