from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.instagram_service import InstagramService
from services.queue_service import QueueService, QueuedTask, TaskType
from models import Target
from datetime import datetime
import uuid

router = APIRouter(prefix="/instagram", tags=["instagram"])

class ScanRequest(BaseModel):
    hashtag: str
    limit: int = 20

class FollowRequest(BaseModel):
    username: str

class DMRequest(BaseModel):
    username: str
    message: str

class CommentRequest(BaseModel):
    post_url: str
    comment: str

@router.post("/scan")
async def scan_hashtag(request: ScanRequest):
    """Scan hashtag for potential targets"""
    raise HTTPException(status_code=401, detail="Not logged in to Instagram")

@router.post("/follow")
async def follow_user(request: FollowRequest):
    """Follow a user"""
    raise HTTPException(status_code=401, detail="Not logged in to Instagram")

@router.post("/dm")
async def send_dm(
    request: DMRequest,
    queue_service = Depends(),
    instagram_service = Depends()
):
    """Send direct message"""
    if not instagram_service.is_logged_in:
        raise HTTPException(status_code=401, detail="Not logged in to Instagram")
    
    try:
        task = QueuedTask(
            id=str(uuid.uuid4()),
            task_type=TaskType.DM,
            target=request.username,
            data={"message": request.message},
            scheduled_time=datetime.now()
        )
        
        await queue_service.add_task(task)
        
        return {
            "success": True,
            "message": f"DM task for @{request.username} added to queue",
            "task_id": task.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DM error: {str(e)}")

@router.post("/comment")
async def add_comment(
    request: CommentRequest,
    queue_service = Depends(),
    instagram_service = Depends()
):
    """Add comment to post"""
    if not instagram_service.is_logged_in:
        raise HTTPException(status_code=401, detail="Not logged in to Instagram")
    
    try:
        task = QueuedTask(
            id=str(uuid.uuid4()),
            task_type=TaskType.COMMENT,
            target=request.post_url,
            data={"comment": request.comment},
            scheduled_time=datetime.now()
        )
        
        await queue_service.add_task(task)
        
        return {
            "success": True,
            "message": f"Comment task added to queue",
            "task_id": task.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comment error: {str(e)}")

@router.get("/profile/stats")
async def get_profile_stats():
    """Get current user's profile statistics"""
    raise HTTPException(status_code=401, detail="Not logged in to Instagram")

@router.get("/mirror/screenshot")
async def get_screenshot(instagram_service = Depends()):
    """Get current Instagram page screenshot"""
    if not instagram_service.is_logged_in:
        raise HTTPException(status_code=401, detail="Not logged in to Instagram")
    
    try:
        screenshot_path = await instagram_service.take_screenshot()
        if screenshot_path:
            return {"screenshot_url": f"/static/{screenshot_path.split('/')[-1]}"}
        else:
            raise HTTPException(status_code=500, detail="Failed to take screenshot")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Screenshot error: {str(e)}")

@router.get("/queue/status")
async def get_queue_status(queue_service = Depends()):
    """Get current queue status"""
    return queue_service.get_queue_status()

@router.post("/operations/pause")
async def pause_operations(queue_service = Depends()):
    """Pause all Instagram operations"""
    try:
        await queue_service.stop_processing()
        return {"success": True, "message": "Operations paused"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pause error: {str(e)}")

@router.post("/operations/resume")
async def resume_operations(queue_service = Depends()):
    """Resume Instagram operations"""
    try:
        await queue_service.start_processing()
        return {"success": True, "message": "Operations resumed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume error: {str(e)}")
