from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None

db_mongo = MongoDB()

async def init_mongodb():
    from app.models.mongo_models import (
        MediaMetadata,
        RawAnalyticsLog,
        PublishingActivityLog,
        ContentDraft
    )
    
    db_mongo.client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = db_mongo.client[settings.MONGODB_DB]
    
    await init_beanie(
        database=database,
        document_models=[
            MediaMetadata,
            RawAnalyticsLog,
            PublishingActivityLog,
            ContentDraft
        ]
    )
    print(f"Connected to MongoDB database: {settings.MONGODB_DB}")

async def close_mongodb():
    if db_mongo.client:
        db_mongo.client.close()
        print("MongoDB connection closed.")
