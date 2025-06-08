from fastapi import APIRouter, Depends
from typing import Dict, Any
from backend.services.instagram_service import InstagramService
from backend.services.queue_service import QueueService
from backend.services.llm_service import LLMService
from backend.database.sqlite_db import DatabaseManager
from datetime import datetime

router = APIRouter(prefix="/status", tags=["status"])

@router.get("/")
async def get_system_status() -> Dict[str, Any]:
    """Get overall system status"""
    return {
        "timestamp": datetime.now().isoformat(),
        "instagram": {
            "is_logged_in": False,
            "username": None,
            "browser_active": False
        },
        "queue": {
            "pending": 0,
            "running": 0,
            "completed": 0
        },
        "llm": {
            "status": "ready",
            "model": "microsoft/DialoGPT-medium"
        },
        "database": {
            "connected": True,
            "recent_activity": {}
        },
        "system": {
            "uptime": "Running",
            "version": "1.0.0",
            "environment": "development"
        }
    }

@router.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "social-commander-backend"
    }

@router.get("/metrics")
async def get_metrics():
    """Get system metrics"""
    return {
        "overall": {
            "total_actions": 0,
            "success_rate": 100.0,
            "successful_actions": 0,
            "failed_actions": 0
        },
        "by_action_type": {},
        "timestamp": datetime.now().isoformat()
    }
