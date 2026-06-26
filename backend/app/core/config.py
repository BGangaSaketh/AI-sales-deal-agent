from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI Sales Deal Intelligence Agent"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Supabase / Postgres Database URL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"

    # Supabase Settings (Placeholder for integration)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
