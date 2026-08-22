from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.core.config import settings


class MongoDB:
    client: AsyncMongoClient | None = None


db_mongo = MongoDB()


async def init_mongodb():
    from app.models.mongo_models import (
        MediaMetadata,
        RawAnalyticsLog,
        PublishingActivityLog,
        ContentDraft,
    )

    db_mongo.client = AsyncMongoClient(
        settings.MONGODB_URI,
        maxPoolSize=50,
        minPoolSize=5,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
        retryWrites=True,
    )

    database = db_mongo.client[settings.MONGODB_DB]

    # Verify MongoDB connection
    await db_mongo.client.admin.command("ping")

    await init_beanie(
        database=database,
        document_models=[
            MediaMetadata,
            RawAnalyticsLog,
            PublishingActivityLog,
            ContentDraft,
        ],
    )

    print(
        f"Connected to MongoDB database: "
        f"{settings.MONGODB_DB}"
    )


async def close_mongodb():
    if db_mongo.client:
        await db_mongo.client.close()
        db_mongo.client = None
        print("MongoDB connection closed.")