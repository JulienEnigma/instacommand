from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    database_url: str = "/home/ubuntu/instacommand/backend/social_commander.db"
    
    ig_username: str = ""
    ig_password: str = ""
    
    captcha_solver: str = "2CAPTCHA"
    captcha_api_key: str = ""
    
    llm_model_name: str = "meta-llama/Llama-2-8b-chat-hf"
    llm_fallback_model: str = "deepseek-ai/deepseek-coder-7b-base"
    llm_max_length: int = 150
    llm_temperature: float = 0.7
    
    max_follows: int = 102
    max_dms: int = 8
    max_likes: int = 40
    
    min_action_delay: int = 7
    max_action_delay: int = 22
    page_load_cooldown: int = 20
    failure_pause_minutes: int = 15
    
    simulate: bool = True
    
    instagram_rate_limit_delay: int = 5
    instagram_daily_follow_limit: int = 200
    instagram_daily_dm_limit: int = 50
    instagram_daily_scan_limit: int = 100
    
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    browser_headless: bool = True
    browser_timeout: int = 30000
    
    follow_delay: int = 60
    dm_delay: int = 120
    scan_delay: int = 30
    comment_delay: int = 90
    
    headless_browser: bool = True
    
    log_level: str = "INFO"
    log_file: str = "/tmp/social_commander.log"
    
    runpod_pod_id: str = ""
    runpod_api_key: str = ""
    
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
