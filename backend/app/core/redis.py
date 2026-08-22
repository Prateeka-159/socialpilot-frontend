import redis.asyncio as redis

from app.core.config import settings


redis_client = redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    max_connections=50,
    socket_connect_timeout=5,
    socket_timeout=5,
    health_check_interval=30,
)


async def init_redis():
    await redis_client.ping()
    print("[Redis] Connected successfully.")


async def close_redis():
    await redis_client.aclose()
    print("[Redis] Connection closed.")