from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import asyncio
import os
import logging

from backend.database.sqlite_db import DatabaseManager, init_database
from backend.services.logging_service import LoggingService
from backend.services.instagram_service import InstagramService
from backend.services.queue_service import QueueService, TaskType
from backend.services.llm_service import LLMService, StanleyAI
from backend.services.campaign_service import CampaignService
from backend.services.profile_mirror_service import ProfileMirrorService
from backend.config.settings import settings
from backend.routes import auth_router, instagram_router, logs_router, llm_router, status_router
from backend.routes.campaigns import router as campaigns_router
from backend.routes.captcha import router as captcha_router
from backend.error_handling import setup_error_handling

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/social_commander.log'),
        logging.StreamHandler()
    ]
)

db_manager = None
logging_service = None
instagram_service = None
queue_service = None
llm_service = None
stanley_ai = None
campaign_service = None
profile_mirror_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_manager, logging_service, instagram_service, queue_service, llm_service, stanley_ai, campaign_service, profile_mirror_service
    
    db_manager = init_database(settings.database_url)
    
    logging_service = LoggingService(db_manager)
    
    instagram_service = InstagramService(logging_service)
    
    queue_service = QueueService(logging_service)
    
    llm_service = LLMService(logging_service, settings.llm_model_name)
    stanley_ai = StanleyAI(llm_service)
    
    from backend.routes.llm import set_llm_service, set_stanley_ai
    set_llm_service(llm_service)
    set_stanley_ai(stanley_ai)
    
    profile_mirror_service = ProfileMirrorService(logging_service, instagram_service)
    campaign_service = CampaignService(logging_service, llm_service, instagram_service, queue_service)
    
    queue_service.register_handler(TaskType.SCAN, instagram_service.scan_hashtag)
    queue_service.register_handler(TaskType.FOLLOW, instagram_service.follow_user)
    queue_service.register_handler(TaskType.DM, instagram_service.send_dm)
    queue_service.register_handler(TaskType.PROFILE_MIRROR, profile_mirror_service.sync_profile_mirror)
    
    await logging_service.log_system_message("Social Commander Backend starting up...")
    
    asyncio.create_task(llm_service.initialize())
    
    asyncio.create_task(queue_service.start_processing())
    
    os.makedirs("/tmp/static", exist_ok=True)
    
    yield
    
    await logging_service.log_system_message("Social Commander Backend shutting down...")
    await queue_service.stop_processing()
    await instagram_service.close()

app = FastAPI(
    title="Social Commander Backend", 
    version="1.0.0",
    description="AI-powered Instagram automation platform",
    lifespan=lifespan
)

setup_error_handling(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="/tmp/static"), name="static")

def get_db_manager():
    return db_manager

def get_logging_service():
    return logging_service

def get_instagram_service():
    return instagram_service

def get_queue_service():
    return queue_service

def get_llm_service():
    return llm_service

def get_stanley_ai():
    return stanley_ai

def get_campaign_service():
    return campaign_service

def get_profile_mirror_service():
    return profile_mirror_service

from fastapi import Depends

def get_dependencies():
    return {
        "db_manager": db_manager,
        "logging_service": logging_service,
        "instagram_service": instagram_service,
        "queue_service": queue_service,
        "llm_service": llm_service,
        "stanley_ai": stanley_ai,
        "campaign_service": campaign_service,
        "profile_mirror_service": profile_mirror_service
    }


app.include_router(auth_router)
app.include_router(instagram_router)
app.include_router(logs_router)
app.include_router(llm_router)
app.include_router(status_router)
app.include_router(campaigns_router)
app.include_router(captcha_router)

@app.get("/")
async def root():
    return {
        "message": "Social Commander Backend API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "auth": "/auth",
            "instagram": "/instagram", 
            "logs": "/logs",
            "llm": "/llm",
            "status": "/status",
            "campaigns": "/campaigns",
            "captcha": "/captcha"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "social-commander-backend"}

if __name__ == "__main__":
    uvicorn.run(app, host=settings.api_host, port=settings.api_port, reload=settings.debug)
