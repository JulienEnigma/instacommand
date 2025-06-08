import asyncio
from typing import Dict, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
from .logging_service import LoggingService

class TaskType(Enum):
    FOLLOW = "follow"
    DM = "dm"
    SCAN = "scan"
    COMMENT = "comment"
    LIKE = "like"

@dataclass
class QueuedTask:
    id: str
    task_type: TaskType
    target: str
    data: Dict[str, Any]
    scheduled_time: datetime
    priority: int = 1
    retries: int = 0
    max_retries: int = 3

class QueueService:
    def __init__(self, logging_service: LoggingService):
        self.logging_service = logging_service
        self.task_queue = asyncio.PriorityQueue()
        self.running_tasks = {}
        self.is_processing = False
        self.task_handlers: Dict[TaskType, Callable] = {}
        
        self.daily_limits = {
            TaskType.FOLLOW: 200,
            TaskType.DM: 50,
            TaskType.SCAN: 100,
            TaskType.COMMENT: 150,
            TaskType.LIKE: 500
        }
        
        self.hourly_limits = {
            TaskType.FOLLOW: 20,
            TaskType.DM: 5,
            TaskType.SCAN: 10,
            TaskType.COMMENT: 15,
            TaskType.LIKE: 50
        }
        
        self.daily_counts = {task_type: 0 for task_type in TaskType}
        self.hourly_counts = {task_type: 0 for task_type in TaskType}
        self.last_reset_hour = datetime.now().hour
        self.last_reset_day = datetime.now().date()
    
    def register_handler(self, task_type: TaskType, handler: Callable):
        """Register a handler function for a task type"""
        self.task_handlers[task_type] = handler
    
    async def add_task(self, task: QueuedTask) -> bool:
        """Add a task to the queue"""
        try:
            if not self._check_rate_limits(task.task_type):
                await self.logging_service.log_system_message(
                    f"Rate limit exceeded for {task.task_type.value}, task queued for later", 
                    "warning"
                )
                task.scheduled_time = datetime.now() + timedelta(hours=1)
            
            priority_score = (task.priority, task.scheduled_time.timestamp())
            await self.task_queue.put((priority_score, task))
            
            await self.logging_service.log_system_message(
                f"Task {task.id} ({task.task_type.value}) added to queue"
            )
            return True
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Failed to add task {task.id}: {str(e)}", "error"
            )
            return False
    
    async def start_processing(self):
        """Start processing tasks from the queue"""
        if self.is_processing:
            return
        
        self.is_processing = True
        await self.logging_service.log_system_message("Queue processing started")
        
        while self.is_processing:
            try:
                self._reset_counters_if_needed()
                
                try:
                    priority_score, task = await asyncio.wait_for(
                        self.task_queue.get(), timeout=60
                    )
                except asyncio.TimeoutError:
                    continue
                
                if datetime.now() < task.scheduled_time:
                    await self.task_queue.put((priority_score, task))
                    await asyncio.sleep(30)  # Wait before checking again
                    continue
                
                if not self._check_rate_limits(task.task_type):
                    task.scheduled_time = datetime.now() + timedelta(hours=1)
                    await self.task_queue.put((priority_score, task))
                    continue
                
                await self._execute_task(task)
                
                self.daily_counts[task.task_type] += 1
                self.hourly_counts[task.task_type] += 1
                
                await asyncio.sleep(30)  # 30 second delay between tasks
                
            except Exception as e:
                await self.logging_service.log_system_message(
                    f"Queue processing error: {str(e)}", "error"
                )
                await asyncio.sleep(60)  # Wait before retrying
    
    async def stop_processing(self):
        """Stop processing tasks"""
        self.is_processing = False
        await self.logging_service.log_system_message("Queue processing stopped")
    
    async def _execute_task(self, task: QueuedTask):
        """Execute a single task"""
        try:
            await self.logging_service.log_system_message(
                f"Executing task {task.id} ({task.task_type.value}) for {task.target}"
            )
            
            handler = self.task_handlers.get(task.task_type)
            if not handler:
                await self.logging_service.log_system_message(
                    f"No handler registered for task type {task.task_type.value}", "error"
                )
                return
            
            success = await handler(task.target, task.data)
            
            if success:
                await self.logging_service.log_system_message(
                    f"Task {task.id} completed successfully"
                )
            else:
                if task.retries < task.max_retries:
                    task.retries += 1
                    task.scheduled_time = datetime.now() + timedelta(minutes=30)
                    
                    priority_score = (task.priority, task.scheduled_time.timestamp())
                    await self.task_queue.put((priority_score, task))
                    
                    await self.logging_service.log_system_message(
                        f"Task {task.id} failed, retry {task.retries}/{task.max_retries} scheduled"
                    )
                else:
                    await self.logging_service.log_system_message(
                        f"Task {task.id} failed permanently after {task.max_retries} retries", "error"
                    )
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Error executing task {task.id}: {str(e)}", "error"
            )
    
    def _check_rate_limits(self, task_type: TaskType) -> bool:
        """Check if task type is within rate limits"""
        daily_limit = self.daily_limits.get(task_type, 0)
        hourly_limit = self.hourly_limits.get(task_type, 0)
        
        daily_count = self.daily_counts.get(task_type, 0)
        hourly_count = self.hourly_counts.get(task_type, 0)
        
        return daily_count < daily_limit and hourly_count < hourly_limit
    
    def _reset_counters_if_needed(self):
        """Reset hourly/daily counters if needed"""
        now = datetime.now()
        
        if now.hour != self.last_reset_hour:
            self.hourly_counts = {task_type: 0 for task_type in TaskType}
            self.last_reset_hour = now.hour
        
        if now.date() != self.last_reset_day:
            self.daily_counts = {task_type: 0 for task_type in TaskType}
            self.last_reset_day = now.date()
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status"""
        return {
            "is_processing": self.is_processing,
            "queue_size": self.task_queue.qsize(),
            "daily_counts": self.daily_counts.copy(),
            "hourly_counts": self.hourly_counts.copy(),
            "daily_limits": self.daily_limits.copy(),
            "hourly_limits": self.hourly_limits.copy()
        }
