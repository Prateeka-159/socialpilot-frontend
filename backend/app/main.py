# FastAPI Entry Point


from fastapi import FastAPI

app = FastAPI(
    title="Social Media Scheduler API",
    description="Backend API for Social Media Scheduler & Campaign Management Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Social Media Scheduler API"
    }