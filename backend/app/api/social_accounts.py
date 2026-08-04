from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.postgres import get_db
from app.models.sql_models import User, SocialAccount, PlatformEnum, UserStatusEnum
from app.schemas.social import SocialAccountRequest
from app.core.security import get_current_user

router = APIRouter(
    prefix="/social-accounts",
    tags=["Social Accounts"]
)

@router.post("/connect")
def connect_account(
    account: SocialAccountRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email = current_user.get("sub") if isinstance(current_user, dict) else current_user
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Map platform string to Enum
    platform_enum = PlatformEnum.FACEBOOK
    for p in PlatformEnum:
        if p.value.lower() == account.platform.lower() or p.name.lower() == account.platform.lower():
            platform_enum = p
            break

    new_account = SocialAccount(
        user_id=db_user.user_id,
        platform_name=platform_enum,
        platform_user_id=f"pid_{account.username}",
        username=account.username,
        access_token="mock_access_token_token_12345",
        status=UserStatusEnum.ACTIVE
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return {
        "message": "Social account connected successfully",
        "account": {
            "id": new_account.social_account_id,
            "platform": new_account.platform_name.value,
            "username": new_account.username,
            "owner": db_user.email,
            "status": new_account.status.value
        }
    }

@router.get("/")
def get_accounts(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email = current_user.get("sub") if isinstance(current_user, dict) else current_user
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        return {"total_accounts": 0, "accounts": []}

    accounts = db.query(SocialAccount).filter(SocialAccount.user_id == db_user.user_id).all()
    accounts_data = [
        {
            "id": acc.social_account_id,
            "platform": acc.platform_name.value,
            "username": acc.username,
            "owner": db_user.email,
            "status": acc.status.value
        }
        for acc in accounts
    ]

    return {
        "total_accounts": len(accounts_data),
        "accounts": accounts_data
    }

@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email = current_user.get("sub") if isinstance(current_user, dict) else current_user
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    account = db.query(SocialAccount).filter(
        SocialAccount.social_account_id == account_id,
        SocialAccount.user_id == db_user.user_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    db.delete(account)
    db.commit()

    return {
        "message": "Social account deleted successfully"
    }