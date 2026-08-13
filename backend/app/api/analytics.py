from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.postgres import get_db
from app.core.security import get_current_user
from app.models.sql_models import (
    User,
    Post,
    Campaign,
    PostAnalytics,
    AudienceGrowth,
    SocialAccount,
    CampaignPerformance
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# Frontend: Get historical analytics for one post across all recorded dates.
@router.get("/posts/{post_id}")
def get_post_analytics(
    post_id: int,
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

    post = (
        db.query(Post)
        .filter(
            Post.post_id == post_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    analytics = (
        db.query(PostAnalytics)
        .filter(
            PostAnalytics.post_id == post_id
        )
        .order_by(
            PostAnalytics.record_date.desc()
        )
        .all()
    )

    return {
        "message": "Post analytics fetched successfully",
        "post": {
            "post_id": post.post_id,
            "title": post.title,
            "status": post.status.value
        },
        "total_records": len(analytics),
        "analytics": [
            {
                "analytics_id": item.analytics_id,
                "likes": item.likes,
                "comments": item.comments,
                "shares": item.shares,
                "clicks": item.clicks,
                "reach": item.reach,
                "impressions": item.impressions,
                "saves": item.saves,
                "engagement_rate": item.engagement_rate,
                "video_views": item.video_views,
                "followers_gained": item.followers_gained,
                "record_date": item.record_date
            }
            for item in analytics
        ]
    }


# Frontend: Get total engagement metrics and engagement rate for one post.
@router.get("/posts/{post_id}/engagement")
def get_post_engagement(
    post_id: int,
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

    post = (
        db.query(Post)
        .filter(
            Post.post_id == post_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    analytics = (
        db.query(PostAnalytics)
        .filter(
            PostAnalytics.post_id == post_id
        )
        .all()
    )

    total_likes = sum(item.likes or 0 for item in analytics)
    total_comments = sum(item.comments or 0 for item in analytics)
    total_shares = sum(item.shares or 0 for item in analytics)
    total_clicks = sum(item.clicks or 0 for item in analytics)
    total_saves = sum(item.saves or 0 for item in analytics)

    total_engagements = (
        total_likes
        + total_comments
        + total_shares
        + total_clicks
        + total_saves
    )

    average_engagement_rate = (
        sum(
            float(item.engagement_rate or 0)
            for item in analytics
        ) / len(analytics)
        if analytics
        else 0
    )

    return {
        "message": "Post engagement analytics fetched successfully",
        "post": {
            "post_id": post.post_id,
            "title": post.title,
            "status": post.status.value
        },
        "engagement": {
            "likes": total_likes,
            "comments": total_comments,
            "shares": total_shares,
            "clicks": total_clicks,
            "saves": total_saves,
            "total_engagements": total_engagements,
            "average_engagement_rate": round(
                average_engagement_rate,
                2
            )
        }
    }

# Frontend: Get aggregated campaign engagement metrics across all linked posts.
@router.get("/campaigns/{campaign_id}/engagement")
def get_campaign_engagement(
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

    analytics = (
        db.query(PostAnalytics)
        .join(Post, Post.post_id == PostAnalytics.post_id)
        .filter(
            Post.campaign_id == campaign_id,
            Post.user_id == db_user.user_id
        )
        .all()
    )

    total_likes = sum(item.likes or 0 for item in analytics)
    total_comments = sum(item.comments or 0 for item in analytics)
    total_shares = sum(item.shares or 0 for item in analytics)
    total_clicks = sum(item.clicks or 0 for item in analytics)
    total_saves = sum(item.saves or 0 for item in analytics)

    total_reach = sum(item.reach or 0 for item in analytics)
    total_impressions = sum(item.impressions or 0 for item in analytics)
    total_video_views = sum(item.video_views or 0 for item in analytics)
    total_followers_gained = sum(
        item.followers_gained or 0
        for item in analytics
    )

    total_engagements = (
        total_likes
        + total_comments
        + total_shares
        + total_clicks
        + total_saves
    )

    average_engagement_rate = (
        sum(
            float(item.engagement_rate or 0)
            for item in analytics
        ) / len(analytics)
        if analytics
        else 0
    )

    return {
        "message": "Campaign engagement analytics fetched successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "platform": campaign.platform.value,
            "status": campaign.status.value
        },
        "engagement": {
            "likes": total_likes,
            "comments": total_comments,
            "shares": total_shares,
            "clicks": total_clicks,
            "saves": total_saves,
            "total_engagements": total_engagements,
            "reach": total_reach,
            "impressions": total_impressions,
            "video_views": total_video_views,
            "followers_gained": total_followers_gained,
            "average_engagement_rate": round(
                average_engagement_rate,
                2
            )
        },
        "total_analytics_records": len(analytics)
    }


# Frontend: Get follower growth history for a connected social account.
@router.get("/social-accounts/{social_account_id}/audience-growth")
def get_audience_growth(
    social_account_id: int,
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

    social_account = (
        db.query(SocialAccount)
        .filter(
            SocialAccount.social_account_id == social_account_id,
            SocialAccount.user_id == db_user.user_id
        )
        .first()
    )

    if not social_account:
        raise HTTPException(
            status_code=404,
            detail="Social account not found"
        )

    growth_records = (
        db.query(AudienceGrowth)
        .filter(
            AudienceGrowth.social_account_id == social_account_id
        )
        .order_by(
            AudienceGrowth.record_date.desc()
        )
        .all()
    )

    return {
        "message": "Audience growth fetched successfully",
        "social_account": {
            "social_account_id": social_account.social_account_id
        },
        "total_records": len(growth_records),
        "audience_growth": [
            {
                "audience_growth_id": item.audience_growth_id,
                "record_date": item.record_date,
                "followers_count": item.followers_count,
                "followers_gained": item.followers_gained,
                "followers_lost": item.followers_lost,
                "net_growth": item.net_growth
            }
            for item in growth_records
        ]
    }

# Frontend: Get performance records for a campaign over time.
@router.get("/campaigns/{campaign_id}/performance")
def get_campaign_performance(
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

    performance_records = (
        db.query(CampaignPerformance)
        .filter(
            CampaignPerformance.campaign_id == campaign_id
        )
        .order_by(
            CampaignPerformance.record_date.desc()
        )
        .all()
    )

    return {
        "message": "Campaign performance fetched successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "platform": campaign.platform.value,
            "status": campaign.status.value
        },
        "total_records": len(performance_records),
        "performance": [
            {
                "performance_id": item.performance_id,
                "platform": item.platform.value,
                "impressions": item.impressions,
                "reach": item.reach,
                "likes": item.likes,
                "comments": item.comments,
                "shares": item.shares,
                "clicks": item.clicks,
                "saves": item.saves,
                "video_views": item.video_views,
                "engagement_rate": item.engagement_rate,
                "conversions": item.conversions,
                "record_date": item.record_date
            }
            for item in performance_records
        ]
    }