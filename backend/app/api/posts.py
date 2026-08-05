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
    PostStatusEnum
)

from app.schemas.post import (
    CreatePostRequest,
    UpdatePostRequest
)

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


# -------------------------
# Helper Functions
# -------------------------

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


# -------------------------
# Create Post
# -------------------------

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


# -------------------------
# Get All Posts
# -------------------------

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


# -------------------------
# Get Single Post
# -------------------------

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


# -------------------------
# Update Post
# -------------------------

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


# -------------------------
# Delete Post
# -------------------------

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