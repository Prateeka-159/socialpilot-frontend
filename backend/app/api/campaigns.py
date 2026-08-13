from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.postgres import get_db
from app.core.security import get_current_user

from app.models.sql_models import (
    Campaign,
    CampaignStatusEnum,
    User
)

from app.schemas.campaign import (
    CampaignCreateRequest,
    CampaignUpdateRequest
)


router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"]
)

@router.post("/")
def create_campaign(
    data: CampaignCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if data.end_date <= data.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be greater than start date"
        )

    campaign = Campaign(
        user_id=db_user.user_id,
        campaign_name=data.campaign_name,
        objective=data.objective,
        budget=data.budget,
        platform=data.platform,
        start_date=data.start_date,
        end_date=data.end_date,
        status=CampaignStatusEnum.ACTIVE
    )

    try:
        db.add(campaign)
        db.commit()
        db.refresh(campaign)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create campaign"
        )

    return {
        "message": "Campaign created successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "objective": campaign.objective,
            "budget": campaign.budget,
            "platform": campaign.platform.value,
            "start_date": campaign.start_date,
            "end_date": campaign.end_date,
            "status": campaign.status.value,
            "created_at": campaign.created_at,
            "updated_at": campaign.updated_at
        }
    }

@router.get("/")
def get_all_campaigns(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    campaigns = (
        db.query(Campaign)
        .filter(
            Campaign.user_id == db_user.user_id
        )
        .order_by(Campaign.created_at.desc())
        .all()
    )

    return {
        "total_campaigns": len(campaigns),
        "campaigns": [
            {
                "campaign_id": campaign.campaign_id,
                "campaign_name": campaign.campaign_name,
                "objective": campaign.objective,
                "budget": campaign.budget,
                "platform": campaign.platform.value,
                "start_date": campaign.start_date,
                "end_date": campaign.end_date,
                "status": campaign.status.value,
                "created_at": campaign.created_at,
                "updated_at": campaign.updated_at
            }
            for campaign in campaigns
        ]
    }

@router.get("/{campaign_id}")
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    campaign = (
        db.query(Campaign)
        .filter(
            Campaign.campaign_id == campaign_id,
            Campaign.user_id == db_user.user_id
        )
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    return {
        "message": "Campaign fetched successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "objective": campaign.objective,
            "budget": campaign.budget,
            "platform": campaign.platform.value,
            "start_date": campaign.start_date,
            "end_date": campaign.end_date,
            "status": campaign.status.value,
            "created_at": campaign.created_at,
            "updated_at": campaign.updated_at
        }
    }

@router.put("/{campaign_id}")
def update_campaign(
    campaign_id: int,
    data: CampaignUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    campaign = (
        db.query(Campaign)
        .filter(
            Campaign.campaign_id == campaign_id,
            Campaign.user_id == db_user.user_id
        )
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    update_data = data.model_dump(exclude_unset=True)

    start_date = update_data.get(
        "start_date",
        campaign.start_date
    )

    end_date = update_data.get(
        "end_date",
        campaign.end_date
    )

    if end_date and start_date and end_date <= start_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be greater than start date"
        )

    for key, value in update_data.items():
        setattr(campaign, key, value)

    try:
        db.commit()
        db.refresh(campaign)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to update campaign"
        )

    return {
        "message": "Campaign updated successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "objective": campaign.objective,
            "budget": campaign.budget,
            "platform": campaign.platform.value,
            "start_date": campaign.start_date,
            "end_date": campaign.end_date,
            "status": campaign.status.value,
            "created_at": campaign.created_at,
            "updated_at": campaign.updated_at
        }
    }

@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    campaign = (
        db.query(Campaign)
        .filter(
            Campaign.campaign_id == campaign_id,
            Campaign.user_id == db_user.user_id
        )
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    try:
        db.delete(campaign)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete campaign"
        )

    return {
        "message": "Campaign deleted successfully",
        "deleted_campaign_id": campaign_id
    }