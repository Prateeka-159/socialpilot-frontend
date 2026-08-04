from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.users import router as users_router
from app.api.social_accounts import router as social_router
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def root():
    return {
        "message": "Welcome to Social Media Scheduler API"
    }