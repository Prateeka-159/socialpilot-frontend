from fastapi import APIRouter, Depends

from app.core.rbac import require_roles
from app.core.roles import UserRole

from app.database.fake_db import fake_users_db
from app.database.social_db import social_accounts_db


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
@router.get("/dashboard")
def admin_dashboard(
    current_user=Depends(require_roles(UserRole.ADMIN))
):
    return {
        "message": "Dashboard data fetched successfully",
        "dashboard": {
            "total_users": len(fake_users_db),
            "total_posts": 0,
            "total_campaigns": 0,
            "connected_accounts": len(social_accounts_db)
        }
    }