from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.postgres import get_db
from app.core.security import get_current_user
from app.models.sql_models import (
    User,
    Post,
    SocialAccount,
    Campaign,
    PostStatusEnum,
    RecurringFrequencyEnum,
    RecurringPostRule,
    
)
from app.schemas.post import (
    CreatePostRequest,
    UpdatePostRequest,
    CreateDraftRequest,
    ScheduleDraftRequest,
    CreateRecurringRequest,
    UpdateRecurringRequest,
    ToggleRecurringRequest

)


router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


def get_db_user(db: Session, current_user):
    user = (
        db.query(User)
        .filter(User.email == current_user["sub"])
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


def get_post_or_404(
    db: Session,
    user_id: int,
    post_id: int
):
    post = (
        db.query(Post)
        .filter(
            Post.post_id == post_id,
            Post.user_id == user_id
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


@router.post("/", status_code=201)
def create_post(
    post: CreatePostRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db_user = get_db_user(db, current_user)

    if post.scheduled_time <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Scheduled time must be in the future"
        )

    social = (
        db.query(SocialAccount)
        .filter(
            SocialAccount.social_account_id == post.social_account_id,
            SocialAccount.user_id == db_user.user_id
        )
        .first()
    )

    if not social:
        raise HTTPException(
            status_code=404,
            detail="Social account not found"
        )

    if post.campaign_id:

        campaign = (
            db.query(Campaign)
            .filter(
                Campaign.campaign_id == post.campaign_id,
                Campaign.user_id == db_user.user_id
            )
            .first()
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found"
            )

    new_post = Post(
        user_id=db_user.user_id,
        social_account_id=post.social_account_id,
        campaign_id=post.campaign_id,
        title=post.title,
        caption=post.caption,
        media_url=post.media_url,
        scheduled_time=post.scheduled_time,
        status=PostStatusEnum.SCHEDULED
    )

    try:

        db.add(new_post)
        db.commit()
        db.refresh(new_post)

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create post"
        )

    return {
        "message": "Post scheduled successfully",
        "post": {
            "post_id": new_post.post_id,
            "title": new_post.title,
            "caption": new_post.caption,
            "media_url": new_post.media_url,
            "status": new_post.status.value,
            "scheduled_time": new_post.scheduled_time,
            "social_account_id": new_post.social_account_id,
            "campaign_id": new_post.campaign_id,
            "created_at": new_post.created_at
        }
    }


@router.get("/")
def get_posts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db_user = get_db_user(db, current_user)

    posts = (
        db.query(Post)
        .filter(Post.user_id == db_user.user_id)
        .order_by(Post.created_at.desc())
        .all()
    )

    return {
        "total_posts": len(posts),
        "posts": [
            {
                "post_id": post.post_id,
                "title": post.title,
                "caption": post.caption,
                "media_url": post.media_url,
                "status": post.status.value,
                "scheduled_time": post.scheduled_time,
                "published_time": post.published_time,
                "social_account_id": post.social_account_id,
                "campaign_id": post.campaign_id,
                "created_at": post.created_at,
                "updated_at": post.updated_at
            }
            for post in posts
        ]
    }



@router.get("/{post_id}")
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db_user = get_db_user(db, current_user)

    post = get_post_or_404(
        db,
        db_user.user_id,
        post_id
    )

    return {
        "message": "Post fetched successfully",
        "post": {
            "post_id": post.post_id,
            "title": post.title,
            "caption": post.caption,
            "media_url": post.media_url,
            "status": post.status.value,
            "scheduled_time": post.scheduled_time,
            "published_time": post.published_time,
            "social_account_id": post.social_account_id,
            "campaign_id": post.campaign_id,
            "created_at": post.created_at,
            "updated_at": post.updated_at
        }
    }


@router.put("/{post_id}")
def update_post(
    post_id: int,
    data: UpdatePostRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db_user = get_db_user(db, current_user)

    post = get_post_or_404(
        db,
        db_user.user_id,
        post_id
    )

    # Published posts cannot be edited
    if post.status == PostStatusEnum.PUBLISHED:
        raise HTTPException(
            status_code=400,
            detail="Published posts cannot be updated"
        )

    # Validate scheduled time
    if (
        data.scheduled_time is not None and
        data.scheduled_time <= datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400,
            detail="Scheduled time must be in the future"
        )

    # Validate campaign
    if data.campaign_id is not None:

        campaign = (
            db.query(Campaign)
            .filter(
                Campaign.campaign_id == data.campaign_id,
                Campaign.user_id == db_user.user_id
            )
            .first()
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found"
            )

    # Validate social account
    if data.social_account_id is not None:

        social = (
            db.query(SocialAccount)
            .filter(
                SocialAccount.social_account_id == data.social_account_id,
                SocialAccount.user_id == db_user.user_id
            )
            .first()
        )

        if not social:
            raise HTTPException(
                status_code=404,
                detail="Social account not found"
            )

    # Update fields
    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(post, key, value)

    try:

        db.commit()
        db.refresh(post)

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update post"
        )

    return {
        "message": "Post updated successfully",
        "post": {
            "post_id": post.post_id,
            "title": post.title,
            "caption": post.caption,
            "media_url": post.media_url,
            "status": post.status.value,
            "scheduled_time": post.scheduled_time,
            "published_time": post.published_time,
            "social_account_id": post.social_account_id,
            "campaign_id": post.campaign_id,
            "updated_at": post.updated_at
        }
    }

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)
    # Get post
    post = get_post_or_404(
        db,
        db_user.user_id,
        post_id
    )
    # Published posts cannot be deleted
    if post.status == PostStatusEnum.PUBLISHED:
        raise HTTPException(
            status_code=400,
            detail="Published posts cannot be deleted"
        )
    try:
        db.delete(post)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete post"
        )
    return {
        "message": "Post deleted successfully",
        "deleted_post": {
            "post_id": post.post_id,
            "title": post.title,
            "status": post.status.value
        }
    }


@router.post("/draft", status_code=201)
def create_draft(
    draft: CreateDraftRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    # Validate Social Account
    social = (
        db.query(SocialAccount)
        .filter(
            SocialAccount.social_account_id == draft.social_account_id,
            SocialAccount.user_id == db_user.user_id
        )
        .first()
    )

    if not social:
        raise HTTPException(
            status_code=404,
            detail="Social account not found"
        )

    # Validate Campaign
    if draft.campaign_id:

        campaign = (
            db.query(Campaign)
            .filter(
                Campaign.campaign_id == draft.campaign_id,
                Campaign.user_id == db_user.user_id
            )
            .first()
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found"
            )

    new_draft = Post(
        user_id=db_user.user_id,
        social_account_id=draft.social_account_id,
        campaign_id=draft.campaign_id,
        title=draft.title,
        caption=draft.caption,
        media_url=draft.media_url,
        status=PostStatusEnum.DRAFT
    )

    try:
        db.add(new_draft)
        db.commit()
        db.refresh(new_draft)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to save draft"
        )

    return {
        "message": "Draft saved successfully",
        "draft": {
            "post_id": new_draft.post_id,
            "title": new_draft.title,
            "caption": new_draft.caption,
            "status": new_draft.status.value,
            "created_at": new_draft.created_at
        }
    }

@router.get("/drafts")
def get_all_drafts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    drafts = (
        db.query(Post)
        .filter(
            Post.user_id == db_user.user_id,
            Post.status == PostStatusEnum.DRAFT
        )
        .order_by(Post.created_at.desc())
        .all()
    )

    return {
        "total_drafts": len(drafts),
        "drafts": [
            {
                "post_id": draft.post_id,
                "title": draft.title,
                "caption": draft.caption,
                "media_url": draft.media_url,
                "status": draft.status.value,
                "social_account_id": draft.social_account_id,
                "campaign_id": draft.campaign_id,
                "created_at": draft.created_at,
                "updated_at": draft.updated_at
            }
            for draft in drafts
        ]
    }

@router.get("/drafts/{draft_id}")
def get_single_draft(
    draft_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    draft = (
        db.query(Post)
        .filter(
            Post.post_id == draft_id,
            Post.user_id == db_user.user_id,
            Post.status == PostStatusEnum.DRAFT
        )
        .first()
    )

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    return {
        "message": "Draft fetched successfully",
        "draft": {
            "post_id": draft.post_id,
            "title": draft.title,
            "caption": draft.caption,
            "media_url": draft.media_url,
            "status": draft.status.value,
            "social_account_id": draft.social_account_id,
            "campaign_id": draft.campaign_id,
            "created_at": draft.created_at,
            "updated_at": draft.updated_at
        }
    }

@router.put("/drafts/{draft_id}")
def update_draft(
    draft_id: int,
    data: UpdatePostRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    draft = (
        db.query(Post)
        .filter(
            Post.post_id == draft_id,
            Post.user_id == db_user.user_id,
            Post.status == PostStatusEnum.DRAFT
        )
        .first()
    )

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    # Validate Social Account
    if data.social_account_id is not None:

        social = (
            db.query(SocialAccount)
            .filter(
                SocialAccount.social_account_id == data.social_account_id,
                SocialAccount.user_id == db_user.user_id
            )
            .first()
        )

        if not social:
            raise HTTPException(
                status_code=404,
                detail="Social account not found"
            )

    # Validate Campaign
    if data.campaign_id is not None:

        campaign = (
            db.query(Campaign)
            .filter(
                Campaign.campaign_id == data.campaign_id,
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

    for key, value in update_data.items():
        setattr(draft, key, value)

    try:
        db.commit()
        db.refresh(draft)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update draft"
        )

    return {
        "message": "Draft updated successfully",
        "draft": {
            "post_id": draft.post_id,
            "title": draft.title,
            "caption": draft.caption,
            "media_url": draft.media_url,
            "status": draft.status.value,
            "social_account_id": draft.social_account_id,
            "campaign_id": draft.campaign_id,
            "updated_at": draft.updated_at
        }
    }

@router.delete("/drafts/{draft_id}")
def delete_draft(
    draft_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    draft = (
        db.query(Post)
        .filter(
            Post.post_id == draft_id,
            Post.user_id == db_user.user_id,
            Post.status == PostStatusEnum.DRAFT
        )
        .first()
    )

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    try:
        db.delete(draft)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete draft"
        )

    return {
        "message": "Draft deleted successfully",
        "deleted_draft": {
            "post_id": draft.post_id,
            "title": draft.title,
            "status": draft.status.value
        }
    }

@router.post("/drafts/{draft_id}/schedule")
def schedule_draft(
    draft_id: int,
    request: ScheduleDraftRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_user = get_db_user(db, current_user)

    draft = (
        db.query(Post)
        .filter(
            Post.post_id == draft_id,
            Post.user_id == db_user.user_id,
            Post.status == PostStatusEnum.DRAFT
        )
        .first()
    )

    if not draft:
        raise HTTPException(
            status_code=404,
            detail="Draft not found"
        )

    # Validate scheduled time
    if request.scheduled_time <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="Scheduled time must be in the future"
        )

    draft.scheduled_time = request.scheduled_time
    draft.status = PostStatusEnum.SCHEDULED

    try:
        db.commit()
        db.refresh(draft)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to schedule draft"
        )

    return {
        "message": "Draft scheduled successfully",
        "post": {
            "post_id": draft.post_id,
            "title": draft.title,
            "caption": draft.caption,
            "status": draft.status.value,
            "scheduled_time": draft.scheduled_time
        }
    }

@router.post("/{post_id}/recurring", status_code=201)
def create_recurring_post(
    post_id: int,
    request: CreateRecurringRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Check whether post exists and belongs to current user
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

    # Optional: Only Draft or Scheduled posts can have recurring rules
    if post.status not in [
        PostStatusEnum.DRAFT,
        PostStatusEnum.SCHEDULED
    ]:
        raise HTTPException(
            status_code=400,
            detail="Recurring rule can only be created for Draft or Scheduled posts"
        )

    # Validate dates
    if request.end_date:

        if request.end_date <= request.start_date:

            raise HTTPException(
                status_code=400,
                detail="End date must be greater than start date"
            )

    # Check duplicate recurring rule
    existing_rule = (
        db.query(RecurringPostRule)
        .filter(
            RecurringPostRule.post_id == post.post_id
        )
        .first()
    )

    if existing_rule:
        raise HTTPException(
            status_code=400,
            detail="Recurring rule already exists for this post"
        )

    # Create recurring rule
    recurring_rule = RecurringPostRule(
        post_id=post.post_id,
        frequency=request.frequency,
        cron_expression=request.cron_expression,
        start_date=request.start_date,
        end_date=request.end_date,
        is_active=True
    )

    try:
        db.add(recurring_rule)
        db.commit()
        db.refresh(recurring_rule)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create recurring rule"
        )

    return {
        "message": "Recurring rule created successfully",
        "rule": {
            "rule_id": recurring_rule.rule_id,
            "post_id": recurring_rule.post_id,
            "frequency": recurring_rule.frequency.value,
            "cron_expression": recurring_rule.cron_expression,
            "start_date": recurring_rule.start_date,
            "end_date": recurring_rule.end_date,
            "is_active": recurring_rule.is_active,
            "created_at": recurring_rule.created_at
        }
    }

@router.get("/recurring")
def get_all_recurring_posts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Fetch all recurring rules for user's posts
    recurring_rules = (
        db.query(RecurringPostRule)
        .join(Post, Post.post_id == RecurringPostRule.post_id)
        .filter(Post.user_id == db_user.user_id)
        .order_by(RecurringPostRule.created_at.desc())
        .all()
    )

    return {
        "total_rules": len(recurring_rules),
        "rules": [
            {
                "rule_id": rule.rule_id,
                "post_id": rule.post_id,
                "frequency": rule.frequency.value,
                "cron_expression": rule.cron_expression,
                "start_date": rule.start_date,
                "end_date": rule.end_date,
                "is_active": rule.is_active,
                "created_at": rule.created_at,
                "updated_at": rule.updated_at
            }
            for rule in recurring_rules
        ]
    }

@router.get("/recurring/{rule_id}")
def get_recurring_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Fetch recurring rule
    rule = (
        db.query(RecurringPostRule)
        .join(Post, Post.post_id == RecurringPostRule.post_id)
        .filter(
            RecurringPostRule.rule_id == rule_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Recurring rule not found"
        )

    return {
        "message": "Recurring rule fetched successfully",
        "rule": {
            "rule_id": rule.rule_id,
            "post_id": rule.post_id,
            "frequency": rule.frequency.value,
            "cron_expression": rule.cron_expression,
            "start_date": rule.start_date,
            "end_date": rule.end_date,
            "is_active": rule.is_active,
            "created_at": rule.created_at,
            "updated_at": rule.updated_at
        }
    } 


@router.put("/recurring/{rule_id}")
def update_recurring_rule(
    rule_id: int,
    request: UpdateRecurringRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Find recurring rule
    rule = (
        db.query(RecurringPostRule)
        .join(Post, Post.post_id == RecurringPostRule.post_id)
        .filter(
            RecurringPostRule.rule_id == rule_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Recurring rule not found"
        )

    # Validate dates
    start_date = request.start_date if request.start_date else rule.start_date
    end_date = request.end_date if request.end_date else rule.end_date

    if end_date and end_date <= start_date:
        raise HTTPException(
            status_code=400,
            detail="End date must be greater than start date"
        )

    # Update only provided fields
    update_data = request.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(rule, key, value)

    try:
        db.commit()
        db.refresh(rule)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update recurring rule"
        )

    return {
        "message": "Recurring rule updated successfully",
        "rule": {
            "rule_id": rule.rule_id,
            "post_id": rule.post_id,
            "frequency": rule.frequency.value,
            "cron_expression": rule.cron_expression,
            "start_date": rule.start_date,
            "end_date": rule.end_date,
            "is_active": rule.is_active,
            "updated_at": rule.updated_at
        }
    }

@router.delete("/recurring/{rule_id}")
def delete_recurring_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Find recurring rule
    rule = (
        db.query(RecurringPostRule)
        .join(Post, Post.post_id == RecurringPostRule.post_id)
        .filter(
            RecurringPostRule.rule_id == rule_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Recurring rule not found"
        )

    try:
        db.delete(rule)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete recurring rule"
        )

    return {
        "message": "Recurring rule deleted successfully",
        "deleted_rule": {
            "rule_id": rule.rule_id,
            "post_id": rule.post_id,
            "frequency": rule.frequency.value
        }
    }

@router.patch("/recurring/{rule_id}/toggle")
def toggle_recurring_rule(
    rule_id: int,
    request: ToggleRecurringRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get logged-in user
    db_user = get_db_user(db, current_user)

    # Find recurring rule
    rule = (
        db.query(RecurringPostRule)
        .join(Post, Post.post_id == RecurringPostRule.post_id)
        .filter(
            RecurringPostRule.rule_id == rule_id,
            Post.user_id == db_user.user_id
        )
        .first()
    )

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Recurring rule not found"
        )

    rule.is_active = request.is_active

    try:
        db.commit()
        db.refresh(rule)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update recurring rule"
        )

    return {
        "message": (
            "Recurring rule enabled successfully"
            if rule.is_active
            else "Recurring rule disabled successfully"
        ),
        "rule": {
            "rule_id": rule.rule_id,
            "post_id": rule.post_id,
            "frequency": rule.frequency.value,
            "is_active": rule.is_active,
            "updated_at": rule.updated_at
        }
    }