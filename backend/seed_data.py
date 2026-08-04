import asyncio
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from app.core.postgres import SessionLocal, engine, Base
from app.core.mongodb import init_mongodb
from app.models.sql_models import (
    User, UserRoleEnum, UserStatusEnum,
    NotificationPreference, DashboardStatistic,
    SocialAccount, PlatformEnum,
    Campaign, CampaignPlatformEnum, CampaignStatusEnum,
    Post, PostTypeEnum, PostStatusEnum,
    PostMedia, PostAnalytics, PublishingQueue, PublishingLog, RecurringPostRule
)
from app.models.mongo_models import (
    MediaMetadata, RawAnalyticsLog, PublishingActivityLog, ContentDraft
)
from app.utils.hashing import hash_password

def seed_postgres():
    db: Session = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).first():
            print("PostgreSQL database already has seed data.")
            return

        print("Seeding PostgreSQL database...")

        # 1. Create Users
        admin_user = User(
            full_name="Sarah Jenkins",
            email="admin@socialpilot.com",
            password_hash=hash_password("Gavini123@"),
            phone="+1-555-0192",
            bio="Lead Platform Architect & Administrator",
            location="San Francisco, CA",
            role=UserRoleEnum.ADMINISTRATOR,
            status=UserStatusEnum.ACTIVE
        )
        creator_user = User(
            full_name="Alex Rivera",
            email="alex.creator@socialpilot.com",
            password_hash=hash_password("Gavini123@"),
            phone="+1-555-0193",
            bio="Digital Content Creator & Storyteller",
            location="Austin, TX",
            role=UserRoleEnum.CONTENT_CREATOR,
            status=UserStatusEnum.ACTIVE
        )
        marketing_user = User(
            full_name="Elena Vance",
            email="elena.marketing@socialpilot.com",
            password_hash=hash_password("Gavini123@"),
            phone="+1-555-0194",
            bio="Growth Marketing Strategist",
            location="New York, NY",
            role=UserRoleEnum.MARKETING_TEAM,
            status=UserStatusEnum.ACTIVE
        )
        db.add_all([admin_user, creator_user, marketing_user])
        db.commit()

        # 2. Preferences & Stats
        for u in [admin_user, creator_user, marketing_user]:
            db.add(NotificationPreference(user_id=u.user_id))
            db.add(DashboardStatistic(
                user_id=u.user_id,
                total_posts=10,
                published_posts=6,
                scheduled_posts=3,
                failed_posts=1,
                total_followers=15400,
                total_reach=45000,
                total_impressions=89000,
                total_engagement=6200
            ))
        db.commit()

        # 3. Social Accounts
        acc1 = SocialAccount(
            user_id=creator_user.user_id,
            platform_name=PlatformEnum.FACEBOOK,
            platform_user_id="fb_1029384",
            username="@AlexRiveraOfficial",
            access_token="eaag_fb_mock_access_token_123",
            status=UserStatusEnum.ACTIVE
        )
        acc2 = SocialAccount(
            user_id=creator_user.user_id,
            platform_name=PlatformEnum.INSTAGRAM,
            platform_user_id="ig_9876543",
            username="@alex_creates",
            access_token="ig_mock_access_token_456",
            status=UserStatusEnum.ACTIVE
        )
        acc3 = SocialAccount(
            user_id=marketing_user.user_id,
            platform_name=PlatformEnum.LINKEDIN,
            platform_user_id="li_5544332",
            username="@SocialPilot_Marketing",
            access_token="li_mock_access_token_789",
            status=UserStatusEnum.ACTIVE
        )
        db.add_all([acc1, acc2, acc3])
        db.commit()

        # 4. Campaigns
        camp1 = Campaign(
            user_id=creator_user.user_id,
            campaign_name="Summer Product Launch 2026",
            objective="Drive brand awareness and feature adoption",
            budget=5000.00,
            platform=CampaignPlatformEnum.ALL,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            status=CampaignStatusEnum.ACTIVE
        )
        camp2 = Campaign(
            user_id=marketing_user.user_id,
            campaign_name="Q3 Leadership Thought Series",
            objective="Establish B2B authority on LinkedIn",
            budget=2500.00,
            platform=CampaignPlatformEnum.LINKEDIN,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=60),
            status=CampaignStatusEnum.ACTIVE
        )
        db.add_all([camp1, camp2])
        db.commit()

        # 5. Posts
        post1 = Post(
            user_id=creator_user.user_id,
            social_account_id=acc2.social_account_id,
            campaign_id=camp1.campaign_id,
            title="Exciting Summer Announcement",
            caption="We are thrilled to reveal our brand new product features! Stay tuned for more updates. #SummerLaunch #ProductUpdate",
            media_url="https://storage.socialpilot.com/uploads/2026/08/summer_launch.jpg",
            post_type=PostTypeEnum.IMAGE,
            scheduled_time=datetime.utcnow() - timedelta(hours=5),
            published_time=datetime.utcnow() - timedelta(hours=4),
            status=PostStatusEnum.PUBLISHED
        )
        post2 = Post(
            user_id=creator_user.user_id,
            social_account_id=acc2.social_account_id,
            campaign_id=camp1.campaign_id,
            title="Behind The Scenes Reel",
            caption="A sneak peek into how our engineering and design teams build social media management tools! 🚀",
            media_url="https://storage.socialpilot.com/uploads/2026/08/bts_reel.mp4",
            post_type=PostTypeEnum.REEL,
            scheduled_time=datetime.utcnow() + timedelta(days=2),
            status=PostStatusEnum.SCHEDULED
        )
        post3 = Post(
            user_id=marketing_user.user_id,
            social_account_id=acc3.social_account_id,
            campaign_id=camp2.campaign_id,
            title="Future of AI in Marketing",
            caption="Here are 5 key strategies to leverage AI tools for campaign automation in 2026.",
            post_type=PostTypeEnum.TEXT,
            status=PostStatusEnum.DRAFT
        )
        db.add_all([post1, post2, post3])
        db.commit()

        # 6. Post Media (Multiple media attachments)
        pm1 = PostMedia(
            post_id=post1.post_id,
            media_url="https://storage.socialpilot.com/uploads/2026/08/summer_launch_banner_1.jpg",
            media_type="Image",
            display_order=1
        )
        pm2 = PostMedia(
            post_id=post1.post_id,
            media_url="https://storage.socialpilot.com/uploads/2026/08/summer_launch_banner_2.jpg",
            media_type="Image",
            display_order=2
        )
        pm3 = PostMedia(
            post_id=post2.post_id,
            media_url="https://storage.socialpilot.com/uploads/2026/08/bts_reel.mp4",
            media_type="Video",
            display_order=1
        )
        db.add_all([pm1, pm2, pm3])
        db.commit()

        # 7. Post Analytics (Historical records over time)
        pa1 = PostAnalytics(
            post_id=post1.post_id,
            likes=320,
            comments=45,
            shares=18,
            clicks=120,
            reach=4500,
            impressions=6200,
            saves=35,
            engagement_rate=8.50,
            video_views=0,
            followers_gained=12,
            record_date=date.today() - timedelta(days=1)
        )
        pa2 = PostAnalytics(
            post_id=post1.post_id,
            likes=580,
            comments=82,
            shares=35,
            clicks=240,
            reach=8900,
            impressions=12400,
            saves=68,
            engagement_rate=9.10,
            video_views=0,
            followers_gained=25,
            record_date=date.today()
        )
        db.add_all([pa1, pa2])
        db.commit()

        # 8. Queue, Logs, Recurring Rules
        pq = PublishingQueue(
            post_id=post2.post_id,
            priority=1,
            attempts=0,
            scheduled_at=datetime.utcnow() + timedelta(days=2),
            status="QUEUED"
        )
        pl = PublishingLog(
            post_id=post1.post_id,
            status="SUCCESS",
            message="Post successfully published to Instagram Graph API",
            platform_response='{"id": "ig_17841405", "post_url": "https://instagram.com/p/C_sample123"}'
        )
        rr = RecurringPostRule(
            post_id=post2.post_id,
            frequency="WEEKLY",
            cron_expression="0 14 * * 4",
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=90),
            is_active=True
        )
        db.add_all([pq, pl, rr])
        db.commit()

        print("PostgreSQL database seeded successfully!")
    finally:
        db.close()

async def seed_mongodb():
    await init_mongodb()

    if await MediaMetadata.find_one():
        print("MongoDB database already has seed data.")
        return

    print("Seeding MongoDB database...")

    # 1. Media Metadata
    media_doc = MediaMetadata(
        user_id=2,
        file_name="summer_launch.jpg",
        file_type="image/jpeg",
        file_size=2048500,
        storage_provider="AWS_S3",
        storage_path="uploads/2026/08/summer_launch.jpg",
        dimensions={"width": 1920, "height": 1080},
        tags=["summer", "product_launch", "banner"]
    )
    await media_doc.insert()

    # 2. Raw Analytics Log
    raw_log = RawAnalyticsLog(
        post_id=1,
        platform="Instagram",
        raw_response={
            "media_id": "ig_17841405",
            "like_count": 580,
            "comments_count": 82,
            "insights": {
                "impressions": 12400,
                "reach": 8900,
                "saved": 68
            }
        }
    )
    await raw_log.insert()

    # 3. Publishing Activity Log
    act_log = PublishingActivityLog(
        post_id=1,
        user_id=2,
        action="PUBLISH_ATTEMPT",
        status="SUCCESS",
        details={
            "response_time_ms": 320,
            "api_version": "v18.0",
            "endpoint": "graph.instagram.com/v18.0/media_publish"
        }
    )
    await act_log.insert()

    # 4. Content Draft
    draft_doc = ContentDraft(
        user_id=3,
        template_name="Weekly Thought Leadership Template",
        content_blocks=[
            {"type": "header", "text": "🚀 Industry Insight of the Week"},
            {"type": "body", "text": "Automation simplifies key scheduling workflows for content teams."},
            {"type": "call_to_action", "text": "What tools are you using this quarter?"}
        ],
        tags=["template", "b2b", "linkedin"]
    )
    await draft_doc.insert()

    print("MongoDB database seeded successfully!")

def main():
    seed_postgres()
    asyncio.run(seed_mongodb())

if __name__ == "__main__":
    main()
