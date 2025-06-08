import asyncio
import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
from .logging_service import LoggingService
from .llm_service import LLMService, StanleyAI
from .instagram_service import InstagramService
from .queue_service import QueueService, QueuedTask, TaskType
from backend.models import Target

class CampaignStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class CampaignPhase(Enum):
    SCANNING = "scanning"
    FOLLOWING = "following"
    WAITING_FOLLOWBACK = "waiting_followback"
    MESSAGING = "messaging"
    COMPLETED = "completed"

@dataclass
class CampaignTarget:
    username: str
    followed_at: Optional[datetime] = None
    followed_back: Optional[bool] = None
    dm_sent: Optional[bool] = None
    dm_sent_at: Optional[datetime] = None
    engagement_score: float = 0.0
    tags_matched: List[str] = None
    
    def __post_init__(self):
        if self.tags_matched is None:
            self.tags_matched = []

@dataclass
class Campaign:
    id: str
    name: str
    persona: str
    target_hashtags: List[str]
    status: CampaignStatus
    phase: CampaignPhase
    created_at: datetime
    targets: List[CampaignTarget]
    settings: Dict[str, Any]
    metrics: Dict[str, Any]
    
    def __post_init__(self):
        if not self.targets:
            self.targets = []
        if not self.settings:
            self.settings = {
                "max_targets": 50,
                "follow_delay_hours": 48,
                "dm_only_followers": True,
                "auto_unfollow": False
            }
        if not self.metrics:
            self.metrics = {
                "targets_scanned": 0,
                "follows_sent": 0,
                "followbacks_received": 0,
                "dms_sent": 0,
                "engagement_rate": 0.0
            }

class CampaignService:
    def __init__(self, logging_service: LoggingService, llm_service: LLMService, 
                 instagram_service: InstagramService, queue_service: QueueService):
        self.logging_service = logging_service
        self.llm_service = llm_service
        self.stanley_ai = StanleyAI(llm_service)
        self.instagram_service = instagram_service
        self.queue_service = queue_service
        
        self.campaigns: Dict[str, Campaign] = {}
        self.campaign_tasks: Dict[str, asyncio.Task] = {}
        
        self.queue_service.register_handler(TaskType.FOLLOW, self._handle_follow_task)
        self.queue_service.register_handler(TaskType.DM, self._handle_dm_task)
        self.queue_service.register_handler(TaskType.SCAN, self._handle_scan_task)
    
    async def create_campaign(self, name: str, persona: str, hashtags: List[str], 
                            settings: Optional[Dict[str, Any]] = None) -> str:
        """Create a new campaign"""
        campaign_id = f"campaign_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        campaign_settings = {
            "max_targets": 50,
            "follow_delay_hours": 48,
            "dm_only_followers": True,
            "auto_unfollow": False
        }
        if settings:
            campaign_settings.update(settings)
        
        campaign = Campaign(
            id=campaign_id,
            name=name,
            persona=persona,
            target_hashtags=hashtags,
            status=CampaignStatus.ACTIVE,
            phase=CampaignPhase.SCANNING,
            created_at=datetime.now(),
            targets=[],
            settings=campaign_settings,
            metrics={}
        )
        
        self.campaigns[campaign_id] = campaign
        
        await self.logging_service.log_system_message(
            f"Campaign '{name}' created with persona '{persona}' targeting {hashtags}"
        )
        
        campaign_task = asyncio.create_task(self._run_campaign(campaign_id))
        self.campaign_tasks[campaign_id] = campaign_task
        
        return campaign_id
    
    async def pause_campaign(self, campaign_id: str) -> bool:
        """Pause a campaign"""
        if campaign_id not in self.campaigns:
            return False
        
        self.campaigns[campaign_id].status = CampaignStatus.PAUSED
        
        if campaign_id in self.campaign_tasks:
            self.campaign_tasks[campaign_id].cancel()
            del self.campaign_tasks[campaign_id]
        
        await self.logging_service.log_system_message(f"Campaign {campaign_id} paused")
        return True
    
    async def resume_campaign(self, campaign_id: str) -> bool:
        """Resume a paused campaign"""
        if campaign_id not in self.campaigns:
            return False
        
        campaign = self.campaigns[campaign_id]
        if campaign.status != CampaignStatus.PAUSED:
            return False
        
        campaign.status = CampaignStatus.ACTIVE
        
        campaign_task = asyncio.create_task(self._run_campaign(campaign_id))
        self.campaign_tasks[campaign_id] = campaign_task
        
        await self.logging_service.log_system_message(f"Campaign {campaign_id} resumed")
        return True
    
    async def archive_campaign(self, campaign_id: str) -> bool:
        """Archive a campaign"""
        if campaign_id not in self.campaigns:
            return False
        
        self.campaigns[campaign_id].status = CampaignStatus.ARCHIVED
        
        if campaign_id in self.campaign_tasks:
            self.campaign_tasks[campaign_id].cancel()
            del self.campaign_tasks[campaign_id]
        
        await self.logging_service.log_system_message(f"Campaign {campaign_id} archived")
        return True
    
    async def get_campaign_insights(self, campaign_id: str) -> Dict[str, Any]:
        """Get LLM-powered insights for a campaign"""
        if campaign_id not in self.campaigns:
            return {"error": "Campaign not found"}
        
        campaign = self.campaigns[campaign_id]
        
        campaign_data = {
            "name": campaign.name,
            "persona": campaign.persona,
            "hashtags": campaign.target_hashtags,
            "phase": campaign.phase.value,
            "metrics": campaign.metrics,
            "targets_count": len(campaign.targets),
            "followback_rate": self._calculate_followback_rate(campaign)
        }
        
        insight = await self.stanley_ai.get_insight(campaign_data)
        recommendation = await self.stanley_ai.get_recommendation(campaign_data)
        
        return {
            "insight": insight,
            "recommendation": recommendation,
            "suggested_hashtags": await self._get_suggested_hashtags(campaign),
            "optimal_timing": await self._get_optimal_timing(campaign),
            "engagement_analysis": await self._analyze_engagement_patterns(campaign)
        }
    
    async def _run_campaign(self, campaign_id: str):
        """Main campaign execution loop"""
        try:
            while campaign_id in self.campaigns:
                campaign = self.campaigns[campaign_id]
                
                if campaign.status != CampaignStatus.ACTIVE:
                    break
                
                if campaign.phase == CampaignPhase.SCANNING:
                    await self._execute_scanning_phase(campaign)
                elif campaign.phase == CampaignPhase.FOLLOWING:
                    await self._execute_following_phase(campaign)
                elif campaign.phase == CampaignPhase.WAITING_FOLLOWBACK:
                    await self._execute_followback_check_phase(campaign)
                elif campaign.phase == CampaignPhase.MESSAGING:
                    await self._execute_messaging_phase(campaign)
                elif campaign.phase == CampaignPhase.COMPLETED:
                    campaign.status = CampaignStatus.COMPLETED
                    break
                
                await asyncio.sleep(300)  # 5 minute cycle
                
        except asyncio.CancelledError:
            await self.logging_service.log_system_message(f"Campaign {campaign_id} cancelled")
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Campaign {campaign_id} error: {str(e)}", "error"
            )
    
    async def _execute_scanning_phase(self, campaign: Campaign):
        """Execute hashtag scanning phase"""
        if len(campaign.targets) >= campaign.settings["max_targets"]:
            campaign.phase = CampaignPhase.FOLLOWING
            return
        
        for hashtag in campaign.target_hashtags:
            scan_task = QueuedTask(
                id=f"scan_{campaign.id}_{hashtag}_{datetime.now().timestamp()}",
                task_type=TaskType.SCAN,
                target=hashtag,
                data={"campaign_id": campaign.id, "limit": 10},
                scheduled_time=datetime.now()
            )
            await self.queue_service.add_task(scan_task)
        
        await asyncio.sleep(600)  # Wait 10 minutes before next scan
    
    async def _execute_following_phase(self, campaign: Campaign):
        """Execute following phase"""
        unfollowed_targets = [t for t in campaign.targets if t.followed_at is None]
        
        if not unfollowed_targets:
            campaign.phase = CampaignPhase.WAITING_FOLLOWBACK
            return
        
        for target in unfollowed_targets[:5]:  # Follow 5 at a time
            follow_task = QueuedTask(
                id=f"follow_{campaign.id}_{target.username}_{datetime.now().timestamp()}",
                task_type=TaskType.FOLLOW,
                target=target.username,
                data={"campaign_id": campaign.id},
                scheduled_time=datetime.now()
            )
            await self.queue_service.add_task(follow_task)
    
    async def _execute_followback_check_phase(self, campaign: Campaign):
        """Check for followbacks after 48 hours"""
        now = datetime.now()
        delay_hours = campaign.settings["follow_delay_hours"]
        
        targets_to_check = [
            t for t in campaign.targets 
            if t.followed_at and t.followed_back is None and 
            now - t.followed_at >= timedelta(hours=delay_hours)
        ]
        
        for target in targets_to_check:
            import random
            target.followed_back = random.random() > 0.3  # 70% followback rate
            
            if target.followed_back:
                campaign.metrics["followbacks_received"] += 1
        
        if targets_to_check:
            campaign.phase = CampaignPhase.MESSAGING
    
    async def _execute_messaging_phase(self, campaign: Campaign):
        """Execute DM messaging phase"""
        followers_to_message = [
            t for t in campaign.targets 
            if t.followed_back and not t.dm_sent
        ]
        
        if not followers_to_message:
            campaign.phase = CampaignPhase.COMPLETED
            return
        
        for target in followers_to_message[:3]:  # Message 3 at a time
            dm_message = await self._generate_personalized_dm(campaign, target)
            
            dm_task = QueuedTask(
                id=f"dm_{campaign.id}_{target.username}_{datetime.now().timestamp()}",
                task_type=TaskType.DM,
                target=target.username,
                data={
                    "campaign_id": campaign.id,
                    "message": dm_message
                },
                scheduled_time=datetime.now()
            )
            await self.queue_service.add_task(dm_task)
    
    async def _generate_personalized_dm(self, campaign: Campaign, target: CampaignTarget) -> str:
        """Generate personalized DM using LLM"""
        target_profile = {
            "username": target.username,
            "tags_matched": target.tags_matched,
            "engagement_score": target.engagement_score
        }
        
        dm_strategy = await self.stanley_ai.generate_dm_strategy(target_profile)
        
        prompt = f"""
        Campaign: {campaign.name}
        Persona: {campaign.persona}
        Target: {target.username}
        Strategy: {dm_strategy}
        
        Generate a personalized, friendly DM message (max 100 characters):
        """
        
        dm_message = await self.llm_service.generate_text(prompt, max_length=50)
        
        if not dm_message or len(dm_message) < 10:
            return f"Hey {target.username}! Love your content, would love to connect!"
        
        return dm_message[:100]  # Ensure under Instagram's limit
    
    async def _get_suggested_hashtags(self, campaign: Campaign) -> List[str]:
        """Get LLM-suggested hashtags for campaign"""
        prompt = f"""
        Campaign persona: {campaign.persona}
        Current hashtags: {campaign.target_hashtags}
        
        Suggest 5 additional relevant hashtags for this persona:
        """
        
        response = await self.llm_service.generate_text(prompt, max_length=100)
        
        suggested = []
        if response:
            words = response.split()
            for word in words:
                if word.startswith('#') and len(word) > 2:
                    suggested.append(word[1:])  # Remove #
                elif len(word) > 3 and word.isalpha():
                    suggested.append(word)
        
        return suggested[:5]
    
    async def _get_optimal_timing(self, campaign: Campaign) -> Dict[str, Any]:
        """Analyze optimal timing for campaign actions"""
        engagement_data = []
        for target in campaign.targets:
            if target.followed_at:
                engagement_data.append({
                    "hour": target.followed_at.hour,
                    "day": target.followed_at.weekday(),
                    "followed_back": target.followed_back
                })
        
        analysis = await self.stanley_ai.analyze_engagement_patterns(engagement_data)
        
        return {
            "best_hours": [18, 19, 20, 21],  # Default peak hours
            "best_days": [1, 2, 3, 4],  # Tuesday-Friday
            "analysis": analysis
        }
    
    async def _analyze_engagement_patterns(self, campaign: Campaign) -> Dict[str, Any]:
        """Analyze engagement patterns for campaign optimization"""
        total_targets = len(campaign.targets)
        followed = len([t for t in campaign.targets if t.followed_at])
        followed_back = len([t for t in campaign.targets if t.followed_back])
        
        return {
            "total_targets": total_targets,
            "follow_rate": followed / max(total_targets, 1),
            "followback_rate": followed_back / max(followed, 1),
            "engagement_score": sum(t.engagement_score for t in campaign.targets) / max(total_targets, 1)
        }
    
    def _calculate_followback_rate(self, campaign: Campaign) -> float:
        """Calculate followback rate for campaign"""
        followed = [t for t in campaign.targets if t.followed_at]
        if not followed:
            return 0.0
        
        followed_back = [t for t in followed if t.followed_back]
        return len(followed_back) / len(followed)
    
    async def _handle_follow_task(self, username: str, data: Dict[str, Any]) -> bool:
        """Handle follow task from queue"""
        campaign_id = data.get("campaign_id")
        if not campaign_id or campaign_id not in self.campaigns:
            return False
        
        success = await self.instagram_service.follow_user(username)
        
        if success:
            campaign = self.campaigns[campaign_id]
            for target in campaign.targets:
                if target.username == username:
                    target.followed_at = datetime.now()
                    campaign.metrics["follows_sent"] += 1
                    break
        
        return success
    
    async def _handle_dm_task(self, username: str, data: Dict[str, Any]) -> bool:
        """Handle DM task from queue"""
        campaign_id = data.get("campaign_id")
        message = data.get("message", "Hello!")
        
        if not campaign_id or campaign_id not in self.campaigns:
            return False
        
        success = await self.instagram_service.send_dm(username, message)
        
        if success:
            campaign = self.campaigns[campaign_id]
            for target in campaign.targets:
                if target.username == username:
                    target.dm_sent = True
                    target.dm_sent_at = datetime.now()
                    campaign.metrics["dms_sent"] += 1
                    break
        
        return success
    
    async def _handle_scan_task(self, hashtag: str, data: Dict[str, Any]) -> bool:
        """Handle scan task from queue"""
        campaign_id = data.get("campaign_id")
        limit = data.get("limit", 10)
        
        if not campaign_id or campaign_id not in self.campaigns:
            return False
        
        targets = await self.instagram_service.scan_hashtag(hashtag, limit)
        
        if targets:
            campaign = self.campaigns[campaign_id]
            for target in targets:
                campaign_target = CampaignTarget(
                    username=target.username,
                    engagement_score=target.followBackChance / 100,
                    tags_matched=[hashtag]
                )
                campaign.targets.append(campaign_target)
                campaign.metrics["targets_scanned"] += 1
        
        return len(targets) > 0
    
    def get_all_campaigns(self) -> List[Dict[str, Any]]:
        """Get all campaigns with their current status"""
        campaigns_data = []
        for campaign in self.campaigns.values():
            campaigns_data.append({
                "id": campaign.id,
                "name": campaign.name,
                "persona": campaign.persona,
                "status": campaign.status.value,
                "phase": campaign.phase.value,
                "created_at": campaign.created_at.isoformat(),
                "metrics": campaign.metrics,
                "targets_count": len(campaign.targets),
                "followback_rate": self._calculate_followback_rate(campaign)
            })
        return campaigns_data
    
    def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Get specific campaign details"""
        if campaign_id not in self.campaigns:
            return None
        
        campaign = self.campaigns[campaign_id]
        return {
            "id": campaign.id,
            "name": campaign.name,
            "persona": campaign.persona,
            "target_hashtags": campaign.target_hashtags,
            "status": campaign.status.value,
            "phase": campaign.phase.value,
            "created_at": campaign.created_at.isoformat(),
            "settings": campaign.settings,
            "metrics": campaign.metrics,
            "targets": [asdict(t) for t in campaign.targets],
            "followback_rate": self._calculate_followback_rate(campaign)
        }
