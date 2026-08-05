import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "Gavini123@"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "socialpilot"
    POSTGRES_URL: str = "postgresql+psycopg2://postgres:Gavini123%40@localhost:5432/socialpilot"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "socialpilot_db"

    SECRET_KEY: str = "socialpilot_secret_jwt_key_2026_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
