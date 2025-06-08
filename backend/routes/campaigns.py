from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from backend.services.campaign_service import CampaignService
from datetime import datetime

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

class CreateCampaignRequest(BaseModel):
    name: str
    persona: str
    hashtags: List[str]
    settings: Optional[Dict[str, Any]] = None

class CampaignActionRequest(BaseModel):
    campaign_id: str

@router.post("/create")
async def create_campaign(
    request: CreateCampaignRequest,
    campaign_service = Depends()
):
    """Create a new campaign"""
    try:
        campaign_id = await campaign_service.create_campaign(
            request.name,
            request.persona,
            request.hashtags,
            request.settings
        )
        
        return {
            "success": True,
            "campaign_id": campaign_id,
            "message": f"Campaign '{request.name}' created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign creation error: {str(e)}")

@router.get("/list")
async def list_campaigns(campaign_service = Depends()):
    """Get all campaigns"""
    try:
        campaigns = campaign_service.get_all_campaigns()
        return {"campaigns": campaigns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign list error: {str(e)}")

@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str, campaign_service = Depends()):
    """Get specific campaign details"""
    try:
        campaign = campaign_service.get_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign get error: {str(e)}")

@router.post("/{campaign_id}/pause")
async def pause_campaign(campaign_id: str, campaign_service = Depends()):
    """Pause a campaign"""
    try:
        success = await campaign_service.pause_campaign(campaign_id)
        if not success:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        return {
            "success": True,
            "message": f"Campaign {campaign_id} paused"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign pause error: {str(e)}")

@router.post("/{campaign_id}/resume")
async def resume_campaign(campaign_id: str, campaign_service = Depends()):
    """Resume a paused campaign"""
    try:
        success = await campaign_service.resume_campaign(campaign_id)
        if not success:
            raise HTTPException(status_code=404, detail="Campaign not found or not paused")
        
        return {
            "success": True,
            "message": f"Campaign {campaign_id} resumed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign resume error: {str(e)}")

@router.post("/{campaign_id}/archive")
async def archive_campaign(campaign_id: str, campaign_service = Depends()):
    """Archive a campaign"""
    try:
        success = await campaign_service.archive_campaign(campaign_id)
        if not success:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        return {
            "success": True,
            "message": f"Campaign {campaign_id} archived"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign archive error: {str(e)}")

@router.get("/{campaign_id}/insights")
async def get_campaign_insights(campaign_id: str, campaign_service = Depends()):
    """Get LLM-powered insights for a campaign"""
    try:
        insights = await campaign_service.get_campaign_insights(campaign_id)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign insights error: {str(e)}")

@router.get("/{campaign_id}/metrics")
async def get_campaign_metrics(campaign_id: str, campaign_service = Depends()):
    """Get campaign performance metrics"""
    try:
        campaign = campaign_service.get_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        return {
            "campaign_id": campaign_id,
            "metrics": campaign.get("metrics", {}),
            "targets_count": campaign.get("targets_count", 0),
            "followback_rate": campaign.get("followback_rate", 0.0),
            "phase": campaign.get("phase", "unknown"),
            "status": campaign.get("status", "unknown")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign metrics error: {str(e)}")
