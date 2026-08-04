from fastapi import APIRouter, Depends, HTTPException

from app.database.social_db import social_accounts_db
from app.schemas.social import SocialAccountRequest
from app.core.security import get_current_user

router = APIRouter(
    prefix="/social-accounts",
    tags=["Social Accounts"]
)

@router.post("/connect")
def connect_account(
    account: SocialAccountRequest,
    current_user=Depends(get_current_user)
):

    new_account = {
        "id": len(social_accounts_db) + 1,
        "platform": account.platform,
        "username": account.username,
        "owner": current_user["sub"]
    }

    social_accounts_db.append(new_account)

    return {
        "message": "Social account connected successfully",
        "account": new_account
    }

@router.get("/")
def get_accounts(
    current_user=Depends(get_current_user)
):

    accounts = [
        account
        for account in social_accounts_db
        if account["owner"] == current_user["sub"]
    ]

    return {
        "total_accounts": len(accounts),
        "accounts": accounts
    }

@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    current_user=Depends(get_current_user)
):

    for account in social_accounts_db:

        if (
            account["id"] == account_id
            and account["owner"] == current_user["sub"]
        ):
            social_accounts_db.remove(account)

            return {
                "message": "Social account deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Account not found"
    )