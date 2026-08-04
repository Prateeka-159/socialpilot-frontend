import asyncio
from datetime import datetime, date, timedelta
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from app.core.postgres import engine, SessionLocal
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

def verify_postgres():
    print("=" * 70)
    print("             POSTGRESQL DATABASE: socialpilot")
    print("=" * 70)

    db: Session = SessionLocal()
    try:
        inspector = inspect(engine)
        table_names = sorted(inspector.get_table_names())

        print("\n[1] PUBLIC TABLES & ROW COUNTS:")
        for t_name in table_names:
            cnt = db.execute(text(f"SELECT COUNT(*) FROM {t_name}")).scalar()
            print(f"   - {t_name:<28}: {cnt} rows")

        print("\n[2] USERS TABLE SAMPLE DATA (Includes bio, location, created_at, updated_at):")
        users = db.query(User).all()
        for u in users:
            print(f"   - User ID {u.user_id}: {u.full_name} ({u.role.value}) | {u.email}")
            print(f"     Bio: '{u.bio}' | Location: '{u.location}' | Created: {u.created_at}")

        print("\n[3] SOCIAL_ACCOUNTS TABLE SAMPLE DATA:")
        accounts = db.query(SocialAccount).all()
        for acc in accounts:
            print(f"   - Account ID {acc.social_account_id}: Platform: {acc.platform_name.value} | Username: {acc.username} | Status: {acc.status.value}")

        print("\n[4] CAMPAIGNS TABLE SAMPLE DATA:")
        campaigns = db.query(Campaign).all()
        for c in campaigns:
            print(f"   - Campaign ID {c.campaign_id}: '{c.campaign_name}' | Platform: {c.platform.value} | Budget: ${c.budget} | Status: {c.status.value}")

        print("\n[5] POSTS & POST_MEDIA SAMPLE DATA:")
        posts = db.query(Post).all()
        for p in posts:
            media_list = db.query(PostMedia).filter(PostMedia.post_id == p.post_id).all()
            media_urls = [m.media_url for m in media_list]
            print(f"   - Post ID {p.post_id}: '{p.title}' | Type: {p.post_type.value} | Status: {p.status.value}")
            print(f"     Media Attachments ({len(media_urls)}): {media_urls}")

        print("\n[6] POST_ANALYTICS (Historical Snapshots over time):")
        analytics = db.query(PostAnalytics).all()
        for a in analytics:
            print(f"   - Analytics ID {a.analytics_id} | Post ID: {a.post_id} | Date: {a.record_date} | Likes: {a.likes} | Comments: {a.comments} | Reach: {a.reach} | Rate: {a.engagement_rate}%")

        # -------------------------------------------------------------
        # Live CRUD Test
        # -------------------------------------------------------------
        print("\n[7] EXECUTING POSTGRESQL CRUD TEST...")

        # CREATE
        test_user = User(
            full_name="Test Developer",
            email="test.dev@socialpilot.com",
            password_hash=hash_password("TestPass123!"),
            bio="Automated Test Account",
            location="Chicago, IL",
            role=UserRoleEnum.CONTENT_CREATOR
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print(f"   [+] CREATE User Success: ID={test_user.user_id}")

        # READ & UPDATE
        fetched_user = db.query(User).filter(User.user_id == test_user.user_id).first()
        fetched_user.bio = "Updated Automated Test Bio"
        db.commit()
        print(f"   [+] UPDATE User Bio Success: '{fetched_user.bio}'")

        # DELETE
        db.delete(fetched_user)
        db.commit()
        print(f"   [+] DELETE User Success!")

        print("--> POSTGRESQL VERIFICATION & CRUD TESTS PASSED!\n")
    finally:
        db.close()

async def verify_mongodb():
    await init_mongodb()

    print("=" * 70)
    print("             MONGODB DATABASE: socialpilot_db")
    print("=" * 70)

    media_cnt = await MediaMetadata.count()
    raw_log_cnt = await RawAnalyticsLog.count()
    act_log_cnt = await PublishingActivityLog.count()
    draft_cnt = await ContentDraft.count()

    print("\n[1] MONGODB COLLECTIONS & DOCUMENT COUNTS:")
    print(f"   - media_metadata               : {media_cnt} documents")
    print(f"   - raw_analytics_logs           : {raw_log_cnt} documents")
    print(f"   - publishing_activity_logs     : {act_log_cnt} documents")
    print(f"   - content_drafts_library       : {draft_cnt} documents")

    print("\n[2] MEDIA_METADATA SAMPLE DOCUMENT:")
    media_doc = await MediaMetadata.find_one()
    if media_doc:
        print(f"   - FileName: {media_doc.file_name} | Type: {media_doc.file_type} | Provider: {media_doc.storage_provider} | Tags: {media_doc.tags}")

    print("\n[3] CONTENT_DRAFTS_LIBRARY SAMPLE DOCUMENT:")
    draft_doc = await ContentDraft.find_one()
    if draft_doc:
        print(f"   - Template: '{draft_doc.template_name}' | Blocks: {len(draft_doc.content_blocks)} | Tags: {draft_doc.tags}")

    print("\n[4] RAW_ANALYTICS_LOGS SAMPLE DOCUMENT:")
    raw_doc = await RawAnalyticsLog.find_one()
    if raw_doc:
        print(f"   - Post ID: {raw_doc.post_id} | Platform: {raw_doc.platform} | Payload Keys: {list(raw_doc.raw_response.keys())}")

    # -------------------------------------------------------------
    # Live MongoDB CRUD Test
    # -------------------------------------------------------------
    print("\n[5] EXECUTING MONGODB CRUD TEST...")
    test_draft = ContentDraft(
        user_id=999,
        template_name="Test Draft Template",
        content_blocks=[{"type": "text", "content": "Testing Mongo CRUD"}],
        tags=["test"]
    )
    await test_draft.insert()
    print(f"   [+] CREATE Mongo Document Success: ID={test_draft.id}")

    test_draft.tags.append("updated_tag")
    await test_draft.save()
    print(f"   [+] UPDATE Mongo Document Tags Success: {test_draft.tags}")

    await test_draft.delete()
    print(f"   [+] DELETE Mongo Document Success!")

    print("--> MONGODB VERIFICATION & CRUD TESTS PASSED!\n")

def main():
    verify_postgres()
    asyncio.run(verify_mongodb())

if __name__ == "__main__":
    main()
