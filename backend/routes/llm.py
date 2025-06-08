from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from backend.services.llm_service import LLMService, StanleyAI
from backend.models import StanleyMessage
from datetime import datetime

_llm_service = None
_stanley_ai = None

def set_llm_service(service):
    global _llm_service
    _llm_service = service

def set_stanley_ai(service):
    global _stanley_ai
    _stanley_ai = service

def get_llm_service():
    if _llm_service is None:
        raise HTTPException(status_code=503, detail="LLM service not initialized")
    return _llm_service

def get_stanley_ai():
    if _stanley_ai is None:
        raise HTTPException(status_code=503, detail="Stanley AI not initialized")
    return _stanley_ai

router = APIRouter(prefix="/llm", tags=["llm"])

class GenerateRequest(BaseModel):
    prompt: str
    max_length: int = 150
    temperature: float = 0.7

class AnalyzeLogsRequest(BaseModel):
    logs: List[Dict[str, Any]]

class SuggestTargetsRequest(BaseModel):
    hashtag: str
    current_targets: List[Dict[str, Any]]

class GenerateDMRequest(BaseModel):
    target_username: str
    target_bio: str
    context: str = ""

class CampaignAnalysisRequest(BaseModel):
    campaign_data: Dict[str, Any]

class CommandSuggestionRequest(BaseModel):
    user_input: str
    context: Dict[str, Any]

@router.post("/generate")
async def generate_text(request: GenerateRequest):
    """Generate text using the LLM"""
    try:
        llm_service = get_llm_service()
        response = await llm_service.generate_text(
            request.prompt, 
            max_length=request.max_length,
            temperature=request.temperature
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")

@router.post("/analyze/logs")
async def analyze_logs(
    request: AnalyzeLogsRequest,
    llm_service = Depends(get_llm_service)
):
    """Analyze logs and provide insights"""
    try:
        analysis = await llm_service.analyze_logs(request.logs)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@router.post("/suggest/targets")
async def suggest_targets(
    request: SuggestTargetsRequest,
    llm_service = Depends(get_llm_service)
):
    """Suggest targeting strategy"""
    try:
        suggestion = await llm_service.suggest_targets(
            request.hashtag,
            request.current_targets
        )
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestion error: {str(e)}")

@router.post("/generate/dm")
async def generate_dm(
    request: GenerateDMRequest,
    llm_service = Depends(get_llm_service)
):
    """Generate personalized DM message"""
    try:
        message = await llm_service.generate_dm_message(
            request.target_username,
            request.target_bio,
            request.context
        )
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DM generation error: {str(e)}")

@router.post("/analyze/campaign")
async def analyze_campaign(
    request: CampaignAnalysisRequest,
    llm_service = Depends(get_llm_service)
):
    """Analyze campaign performance"""
    try:
        analysis = await llm_service.analyze_campaign_performance(request.campaign_data)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign analysis error: {str(e)}")

@router.post("/suggest/command")
async def suggest_command(
    request: CommandSuggestionRequest,
    llm_service = Depends(get_llm_service)
):
    """Generate command suggestions"""
    try:
        suggestion = await llm_service.generate_command_suggestion(
            request.user_input,
            request.context
        )
        return {"suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Command suggestion error: {str(e)}")

@router.get("/status")
async def get_llm_status():
    """Get LLM model status"""
    try:
        llm_service = get_llm_service()
        return await llm_service.get_model_status()
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/debug/fallback")
async def test_fallback_model(llm_service = Depends(get_llm_service)):
    """Test fallback model functionality"""
    try:
        response = await llm_service.generate_text("Test fallback response", max_length=50)
        return {"fallback_test": "success", "response": response}
    except Exception as e:
        return {"fallback_test": "failed", "error": str(e)}

@router.post("/stanley/insight")
async def stanley_insight():
    """Get Stanley's insight"""
    return {
        "type": "insight", 
        "message": "System operational. All parameters within normal range.",
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "priority": "medium",
        "data": "Uptime: 4h 23m"
    }

@router.post("/stanley/recommendation")
async def stanley_recommendation(
    data: Dict[str, Any],
    stanley_ai = Depends(get_stanley_ai)
):
    """Get Stanley's recommendation"""
    try:
        recommendation = await stanley_ai.get_recommendation(data)
        return StanleyMessage(
            type="recommendation",
            message=recommendation,
            timestamp=datetime.now().strftime("%H:%M:%S"),
            priority="high",
            data=data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stanley recommendation error: {str(e)}")

@router.post("/stanley/alert")
async def stanley_alert(
    issue: str,
    stanley_ai = Depends(get_stanley_ai)
):
    """Get Stanley's alert"""
    try:
        alert = await stanley_ai.get_alert(issue)
        return StanleyMessage(
            type="alert",
            message=alert,
            timestamp=datetime.now().strftime("%H:%M:%S"),
            priority="high",
            data={"issue": issue}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stanley alert error: {str(e)}")
