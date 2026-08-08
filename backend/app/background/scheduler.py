from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.postgres import SessionLocal
from app.models.sql_models import Post, PostStatusEnum
from app.services.publisher_service import publish_scheduled_post


scheduler = BackgroundScheduler()


def process_scheduled_posts():
    """
    Find scheduled posts whose scheduled time has arrived
    and publish them automatically.
    """

    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        # Find posts that are due for publishing
        posts = (
            db.query(Post)
            .filter(
                Post.status == PostStatusEnum.SCHEDULED,
                Post.scheduled_time.isnot(None),
                Post.scheduled_time <= now
            )
            .all()
        )

        print(
            f"[Scheduler] Found {len(posts)} post(s) "
            f"ready for publishing."
        )

        # Publish each post
        for post in posts:

            print(
                f"[Scheduler] Publishing post "
                f"ID: {post.post_id}"
            )

            result = publish_scheduled_post(
                db=db,
                post=post
            )

            if result.get("success"):
                print(
                    f"[Scheduler] Post "
                    f"{post.post_id} published successfully."
                )
            else:
                print(
                    f"[Scheduler] Post "
                    f"{post.post_id} failed: "
                    f"{result.get('message')}"
                )

    except Exception as e:

        db.rollback()

        print(
            f"[Scheduler] Error: {str(e)}"
        )

    finally:

        db.close()


def start_scheduler():
    """
    Start background scheduler.
    """

    if not scheduler.running:

        scheduler.add_job(
            process_scheduled_posts,
            trigger="interval",
            minutes=1,
            id="publish_scheduled_posts",
            replace_existing=True
        )

        scheduler.start()

        print(
            "[Scheduler] Background scheduler started."
        )


def stop_scheduler():
    """
    Stop background scheduler.
    """

    if scheduler.running:

        scheduler.shutdown()

        print(
            "[Scheduler] Background scheduler stopped."
        )