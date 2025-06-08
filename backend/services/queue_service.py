import asyncio
from typing import Dict, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass
from backend.services.logging_service import LoggingService
from backend.config.settings import settings

class TaskType(Enum):
    FOLLOW = "follow"
    DM = "dm"
    SCAN = "scan"
    COMMENT = "comment"
    LIKE = "like"
    PROFILE_MIRROR = "profile_mirror"

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
            TaskType.FOLLOW: settings.max_follows,
            TaskType.DM: settings.max_dms,
            TaskType.SCAN: 100,
            TaskType.COMMENT: 150,
            TaskType.LIKE: settings.max_likes,
            TaskType.PROFILE_MIRROR: 2880  # Every 30 seconds = 2880 per day
        }
        
        self.hourly_limits = {
            TaskType.FOLLOW: max(1, settings.max_follows // 24),
            TaskType.DM: max(1, settings.max_dms // 24),
            TaskType.SCAN: 10,
            TaskType.COMMENT: 15,
            TaskType.LIKE: max(1, settings.max_likes // 24),
            TaskType.PROFILE_MIRROR: 120  # Every 30 seconds = 120 per hour
        }
        
        self.daily_counts = {task_type: 0 for task_type in TaskType}
        self.hourly_counts = {task_type: 0 for task_type in TaskType}
        self.last_reset_hour = datetime.now().hour
        self.last_reset_day = datetime.now().date()
        
        self.last_action_type = None
        self.last_action_time = None
        self.failure_count = 0
        self.last_failure_time = None
        self.profile_mirror_task = None
    
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
        
        self.profile_mirror_task = asyncio.create_task(self._profile_mirror_loop())
        
        while self.is_processing:
            try:
                self._reset_counters_if_needed()
                
                if await self._should_pause_for_failures():
                    await asyncio.sleep(60)
                    continue
                
                try:
                    priority_score, task = await asyncio.wait_for(
                        self.task_queue.get(), timeout=60
                    )
                except asyncio.TimeoutError:
                    continue
                
                if datetime.now() < task.scheduled_time:
                    await self.task_queue.put((priority_score, task))
                    await asyncio.sleep(30)
                    continue
                
                if not self._check_rate_limits(task.task_type):
                    task.scheduled_time = datetime.now() + timedelta(hours=1)
                    await self.task_queue.put((priority_score, task))
                    continue
                
                if await self._should_skip_consecutive_action(task.task_type):
                    task.scheduled_time = datetime.now() + timedelta(minutes=5)
                    await self.task_queue.put((priority_score, task))
                    continue
                
                await self._execute_task_with_human_timing(task)
                
                self.daily_counts[task.task_type] += 1
                self.hourly_counts[task.task_type] += 1
                self.last_action_type = task.task_type
                self.last_action_time = datetime.now()
                
            except Exception as e:
                await self.logging_service.log_system_message(
                    f"Queue processing error: {str(e)}", "error"
                )
                await self._handle_failure()
                await asyncio.sleep(60)
    
    async def stop_processing(self):
        """Stop processing tasks"""
        self.is_processing = False
        if self.profile_mirror_task:
            self.profile_mirror_task.cancel()
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
    
    async def _profile_mirror_loop(self):
        """Run profile mirror sync every 30 seconds"""
        while self.is_processing:
            try:
                if self._check_rate_limits(TaskType.PROFILE_MIRROR):
                    handler = self.task_handlers.get(TaskType.PROFILE_MIRROR)
                    if handler:
                        await handler("profile_sync", {"sync_type": "regular"})
                        self.daily_counts[TaskType.PROFILE_MIRROR] += 1
                        self.hourly_counts[TaskType.PROFILE_MIRROR] += 1
                
                await asyncio.sleep(30)
                
            except Exception as e:
                await self.logging_service.log_system_message(
                    f"Profile mirror error: {str(e)}", "error"
                )
                await asyncio.sleep(30)
    
    async def _execute_task_with_human_timing(self, task: QueuedTask):
        """Execute task with human-like timing"""
        import random
        
        delay = random.uniform(settings.min_action_delay, settings.max_action_delay)
        await asyncio.sleep(delay)
        
        await self._execute_task(task)
    
    async def _should_skip_consecutive_action(self, task_type: TaskType) -> bool:
        """Check if we should skip consecutive actions of same type"""
        if self.last_action_type == task_type and self.last_action_time:
            time_since_last = datetime.now() - self.last_action_time
            if time_since_last < timedelta(minutes=2):
                return True
        return False
    
    async def _handle_failure(self):
        """Handle task failure with exponential backoff"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= 5:
            await self.logging_service.log_system_message(
                f"5 consecutive failures detected - pausing operations for {settings.failure_pause_minutes} minutes", 
                "warning"
            )
    
    def _reset_failure_count(self):
        """Reset failure count after successful operation"""
        self.failure_count = 0
        self.last_failure_time = None
    
    async def _should_pause_for_failures(self) -> bool:
        """Check if operations should be paused due to failures"""
        if self.failure_count >= 5 and self.last_failure_time:
            pause_duration = timedelta(minutes=settings.failure_pause_minutes)
            if datetime.now() - self.last_failure_time < pause_duration:
                remaining = pause_duration - (datetime.now() - self.last_failure_time)
                await self.logging_service.log_system_message(
                    f"Operations paused due to failures - {remaining.seconds} seconds remaining", 
                    "warning"
                )
                return True
            else:
                self._reset_failure_count()
        return False
    
    def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status"""
        return {
            "is_processing": self.is_processing,
            "queue_size": self.task_queue.qsize(),
            "daily_counts": self.daily_counts.copy(),
            "hourly_counts": self.hourly_counts.copy(),
            "daily_limits": self.daily_limits.copy(),
            "hourly_limits": self.hourly_limits.copy(),
            "failure_count": self.failure_count,
            "last_action_type": self.last_action_type.value if self.last_action_type else None
        }
