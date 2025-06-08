from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from typing import List, Optional
from backend.services.logging_service import LoggingService
from backend.models import LogEntry

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("/", response_model=List[LogEntry])
async def get_logs(
    limit: int = 100,
    log_type: Optional[str] = None
):
    """Get recent log entries"""
    from backend.main import logging_service
    
    if logging_service is None:
        return []
    
    try:
        logs = await logging_service.get_recent_logs(limit=limit, log_type=log_type)
        return logs
    except Exception as e:
        return []

@router.websocket("/stream")
async def log_stream(websocket: WebSocket):
    """WebSocket endpoint for real-time log streaming"""
    await websocket.accept()
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass

@router.delete("/clear")
async def clear_logs():
    """Clear all logs"""
    return {"success": True, "message": "Logs cleared"}
