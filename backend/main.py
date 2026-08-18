from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.users import router as users_router
from app.api.social_accounts import router as social_router
from app.core.postgres import Base, engine
import app.models.sql_models  # noqa: F401  # Register SQLAlchemy models for table creation
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
import time
from app.api.posts import router as posts_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(social_router)
app.include_router(posts_router)

@app.on_event("startup")
def startup_event():
    max_attempts = 10
    delay_seconds = 2

    for attempt in range(1, max_attempts + 1):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError as exc:
            if attempt == max_attempts:
                raise exc

            print(
                f"PostgreSQL not ready yet (attempt {attempt}/{max_attempts}). "
                f"Retrying in {delay_seconds} seconds..."
            )
            time.sleep(delay_seconds)

@app.get("/")
def root():
    return {
        "message": "Welcome to Social Media Scheduler API"
    }