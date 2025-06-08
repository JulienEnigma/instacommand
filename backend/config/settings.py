from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    database_url: str = "social_commander.db"
    
    llm_model_name: str = "microsoft/DialoGPT-medium"
    llm_max_length: int = 150
    llm_temperature: float = 0.7
    
    instagram_rate_limit_delay: int = 5
    instagram_daily_follow_limit: int = 200
    instagram_daily_dm_limit: int = 50
    instagram_daily_scan_limit: int = 100
    
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    browser_headless: bool = True
    browser_timeout: int = 30000
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
