from fastapi import APIRouter, Depends
from app.core.rbac import require_roles
from app.core.roles import UserRole

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/dashboard")
def admin_dashboard(
    current_user=Depends(require_roles(UserRole.ADMIN))
):
    return {
        "message": "Welcome Admin",
        "user": current_user
    }