import asyncio
import json
from typing import List, Set, Optional
from datetime import datetime
from fastapi import WebSocket
from backend.database.sqlite_db import DatabaseManager
from backend.models import LogEntry

class LoggingService:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.active_connections: Set[WebSocket] = set()
        self.log_queue = asyncio.Queue()
        
    async def connect(self, websocket: WebSocket):
        """Connect a new WebSocket client"""
        await websocket.accept()
        self.active_connections.add(websocket)
        
        recent_logs = self.db_manager.get_logs(limit=50)
        for log in reversed(recent_logs):
            await websocket.send_text(json.dumps(log.dict()))
    
    def disconnect(self, websocket: WebSocket):
        """Disconnect a WebSocket client"""
        self.active_connections.discard(websocket)
    
    async def log_action(self, log_entry: LogEntry):
        """Log an action and broadcast to all connected clients"""
        if not log_entry.timestamp:
            log_entry.timestamp = datetime.now().strftime("%H:%M:%S")
        
        self.db_manager.add_log_entry(log_entry)
        
        if self.active_connections:
            message = json.dumps(log_entry.dict())
            disconnected = set()
            
            for connection in self.active_connections:
                try:
                    await connection.send_text(message)
                except Exception:
                    disconnected.add(connection)
            
            self.active_connections -= disconnected
    
    async def log_system_message(self, message: str, outcome: str = "success"):
        """Log a system message"""
        log_entry = LogEntry(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            action="system",
            details=message,
            type="system",
            outcome=outcome
        )
        await self.log_action(log_entry)
    
    async def log_instagram_action(self, action: str, target: Optional[str], details: str, outcome: str, probability: Optional[float] = None, followback_chance: Optional[float] = None):
        """Log an Instagram automation action"""
        log_entry = LogEntry(
            timestamp=datetime.now().strftime("%H:%M:%S"),
            action=action,
            target=target,
            details=details,
            type=self._get_action_type(action),
            outcome=outcome,
            probability=probability,
            followbackChance=followback_chance
        )
        await self.log_action(log_entry)
    
    def _get_action_type(self, action: str) -> str:
        """Determine log type based on action"""
        action_lower = action.lower()
        if "follow" in action_lower:
            return "follow"
        elif "story" in action_lower:
            return "story"
        elif "dm" in action_lower or "message" in action_lower:
            return "dm"
        elif "comment" in action_lower or "like" in action_lower:
            return "engage"
        elif "scan" in action_lower:
            return "scan"
        else:
            return "system"
    
    def get_logs(self, limit: int = 100, log_type: Optional[str] = None) -> List[LogEntry]:
        """Get logs from database"""
        return self.db_manager.get_logs(limit=limit, log_type=log_type)
