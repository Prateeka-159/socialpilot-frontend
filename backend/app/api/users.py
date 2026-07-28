from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.schemas.auth import UpdateProfileRequest
from app.database.fake_db import fake_users_db
from app.core.rbac import require_roles
from app.core.roles import UserRole

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user)):
    return {
        "message": "User Profile",
        "user": current_user
    }


@router.put("/me")
def update_profile(
    user_data: UpdateProfileRequest,
    current_user=Depends(get_current_user)
):
    email = current_user["sub"]

    db_user = fake_users_db.get(email)

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db_user["name"] = user_data.name

    return {
        "message": "Profile updated successfully",
        "user": db_user
    }


@router.get("/")
def get_all_users(
    current_user=Depends(require_roles(UserRole.ADMIN))
):
    users = []

    for user in fake_users_db.values():
        users.append({
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        })

    return {
        "total_users": len(users),
        "users": users
    }



@router.delete("/{email}")
def delete_user(
    email: str,
    current_user=Depends(require_roles(UserRole.ADMIN))
):
    if email not in fake_users_db:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    deleted_user = fake_users_db.pop(email)

    return {
        "message": "User deleted successfully",
        "deleted_user": {
            "name": deleted_user["name"],
            "email": deleted_user["email"],
            "role": deleted_user["role"]
        }
    }