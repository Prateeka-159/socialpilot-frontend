from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.schemas.auth import UpdateProfileRequest
from app.core.postgres import get_db
from app.models.sql_models import User, UserRoleEnum
from app.core.rbac import require_roles

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    email = current_user.get("sub") if isinstance(current_user, dict) else current_user
    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "User Profile",
        "user": {
            "user_id": db_user.user_id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "phone": db_user.phone,
            "bio": db_user.bio,
            "location": db_user.location,
            "role": db_user.role.value,
            "timezone": db_user.timezone,
            "status": db_user.status.value,
            "created_at": db_user.created_at.isoformat() if db_user.created_at else None,
            "updated_at": db_user.updated_at.isoformat() if db_user.updated_at else None
        }
    }


@router.put("/me")
def update_profile(
    user_data: UpdateProfileRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email = current_user.get("sub") if isinstance(current_user, dict) else current_user

    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name:
        db_user.full_name = user_data.name
    if user_data.phone is not None:
        db_user.phone = user_data.phone
    if user_data.bio is not None:
        db_user.bio = user_data.bio
    if user_data.location is not None:
        db_user.location = user_data.location

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "user_id": db_user.user_id,
            "full_name": db_user.full_name,
            "email": db_user.email,
            "phone": db_user.phone,
            "bio": db_user.bio,
            "location": db_user.location,
            "role": db_user.role.value
        }
    }


@router.get("/")
def get_all_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRoleEnum.ADMINISTRATOR.value))
):
    users_db = db.query(User).all()
    users_list = []

    for u in users_db:
        users_list.append({
            "user_id": u.user_id,
            "name": u.full_name,
            "email": u.email,
            "role": u.role.value,
            "bio": u.bio,
            "location": u.location,
            "status": u.status.value
        })

    return {
        "total_users": len(users_list),
        "users": users_list
    }


@router.delete("/{email}")
def delete_user(
    email: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(UserRoleEnum.ADMINISTRATOR.value))
):
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    deleted_info = {
        "user_id": db_user.user_id,
        "name": db_user.full_name,
        "email": db_user.email,
        "role": db_user.role.value
    }

    db.delete(db_user)
    db.commit()

    return {
        "message": "User deleted successfully",
        "deleted_user": deleted_info
    }