from app.core.postgres import engine, Base
from app.core.mongodb import init_mongodb
from app.models import sql_models

def init_postgres():
    """Create all SQL tables in PostgreSQL."""
    Base.metadata.create_all(bind=engine)
    print("PostgreSQL tables created successfully.")

async def init_databases():
    """Initialize both PostgreSQL tables and MongoDB collections."""
    init_postgres()
    await init_mongodb()
    print("All databases initialized successfully.")
