from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from backend.services.captcha_service import CaptchaService
from backend.services.logging_service import LoggingService

router = APIRouter(prefix="/captcha", tags=["captcha"])

class CaptchaTestRequest(BaseModel):
    test_type: str = "config"

@router.post("/test")
async def test_captcha_service(request: CaptchaTestRequest):
    """Test captcha service configuration"""
    try:
        from backend.main import logging_service
        captcha_service = CaptchaService(logging_service)
        result = await captcha_service.test_captcha_service()
        
        return {
            "test_type": request.test_type,
            "result": result,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Captcha test error: {str(e)}")

@router.get("/status")
async def get_captcha_status():
    """Get captcha solver status"""
    try:
        from backend.config.settings import settings
        
        status_info = {
            "solver_type": settings.captcha_solver,
            "api_key_configured": bool(settings.captcha_api_key),
            "api_key_length": len(settings.captcha_api_key) if settings.captcha_api_key else 0,
            "service_url": "https://api.2captcha.com"
        }
        
        return status_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Captcha status error: {str(e)}")

@router.post("/solve/demo")
async def solve_demo_captcha(logging_service = Depends()):
    """Solve a demo captcha for testing purposes"""
    try:
        captcha_service = CaptchaService(logging_service)
        
        demo_result = await captcha_service.test_captcha_service()
        
        return {
            "demo_test": True,
            "result": demo_result,
            "message": "Demo captcha test completed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo captcha error: {str(e)}")

@router.get("/config")
async def get_captcha_config():
    """Get captcha configuration (without sensitive data)"""
    try:
        from backend.config.settings import settings
        
        config = {
            "solver_enabled": settings.captcha_solver == "2CAPTCHA",
            "solver_type": settings.captcha_solver,
            "api_configured": bool(settings.captcha_api_key),
            "max_retries": 3,
            "poll_interval": 5,
            "max_wait_time": 300
        }
        
        return config
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Captcha config error: {str(e)}")
