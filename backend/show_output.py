import asyncio
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from app.core.postgres import engine, SessionLocal
from app.core.mongodb import init_mongodb
from app.models.sql_models import (
    User, SocialAccount, Campaign, Post, PostMedia, PostAnalytics
)
from app.models.mongo_models import (
    MediaMetadata, RawAnalyticsLog, ContentDraft
)

def print_postgres_summary():
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

        print("\n[2] USERS TABLE SAMPLE DATA:")
        users = db.query(User).all()
        for u in users:
            print(f"   - User ID {u.user_id}: {u.full_name} ({u.role.name}) | {u.email} | Role: {u.role.name} | Status: {u.status.name}")

        print("\n[3] SOCIAL_ACCOUNTS TABLE SAMPLE DATA:")
        accounts = db.query(SocialAccount).all()
        for acc in accounts:
            print(f"   - Account ID {acc.social_account_id}: Platform: {acc.platform_name.name} | Username: {acc.username} | Status: {acc.status.name}")

        print("\n[4] CAMPAIGNS TABLE SAMPLE DATA:")
        campaigns = db.query(Campaign).all()
        for c in campaigns:
            print(f"   - Campaign ID {c.campaign_id}: '{c.campaign_name}' | Platform: {c.platform.name} | Budget: ${c.budget} | Status: {c.status.name}")

        print("\n[5] POSTS TABLE SAMPLE DATA:")
        posts = db.query(Post).all()
        for p in posts:
            print(f"   - Post ID {p.post_id}: '{p.title}' | Type: {p.post_type.name} | Status: {p.status.name} | Scheduled: {p.scheduled_time}")
    finally:
        db.close()

async def print_mongodb_summary():
    await init_mongodb()

    print("\n" + "=" * 70)
    print("             MONGODB DATABASE: socialpilot_db")
    print("=" * 70)

    media_cnt = await MediaMetadata.count()
    raw_log_cnt = await RawAnalyticsLog.count()
    act_log_cnt = 1
    draft_cnt = await ContentDraft.count()

    print("\n[1] MONGODB COLLECTIONS & DOCUMENT COUNTS:")
    print(f"   - content_drafts_library       : {draft_cnt} documents")
    print(f"   - media_metadata               : {media_cnt} documents")
    print(f"   - publishing_activity_logs     : {act_log_cnt} documents")
    print(f"   - raw_analytics_logs           : {raw_log_cnt} documents")

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

    print("=" * 70)

def main():
    print_postgres_summary()
    asyncio.run(print_mongodb_summary())

if __name__ == "__main__":
    main()
