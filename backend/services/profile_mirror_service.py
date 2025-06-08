import asyncio
import json
import os
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from backend.services.logging_service import LoggingService
from backend.services.instagram_service import InstagramService
from backend.config.settings import settings

class ProfileMirrorService:
    def __init__(self, logging_service: LoggingService, instagram_service: InstagramService):
        self.logging_service = logging_service
        self.instagram_service = instagram_service
        self.mirror_data_path = "/tmp/profile_mirror"
        self.daily_snapshot_path = "/tmp/daily_snapshots"
        self.last_daily_snapshot = None
        
        os.makedirs(self.mirror_data_path, exist_ok=True)
        os.makedirs(self.daily_snapshot_path, exist_ok=True)
    
    async def sync_profile_mirror(self, sync_type: str = "regular") -> Dict[str, Any]:
        """Sync profile mirror data every 30 seconds"""
        try:
            if not self.instagram_service.is_logged_in:
                return {"error": "Not logged in to Instagram"}
            
            profile_stats = await self.instagram_service.get_profile_stats()
            
            screenshot_path = await self._capture_mirror_screenshot()
            
            mirror_data = {
                "timestamp": datetime.now().isoformat(),
                "username": self.instagram_service.username,
                "followers": profile_stats.get("followers", 0),
                "following": profile_stats.get("following", 0),
                "posts": profile_stats.get("posts", 0),
                "screenshot_path": screenshot_path,
                "sync_type": sync_type
            }
            
            await self._save_mirror_data(mirror_data)
            
            if await self._should_create_daily_snapshot():
                await self._create_daily_snapshot(mirror_data)
            
            await self.logging_service.log_system_message(
                f"Profile mirror synced: {profile_stats.get('followers', 0)} followers, {profile_stats.get('following', 0)} following"
            )
            
            return mirror_data
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Profile mirror sync error: {str(e)}", "error"
            )
            return {"error": str(e)}
    
    async def _capture_mirror_screenshot(self) -> str:
        """Capture Instagram profile screenshot and save as mirror.jpg"""
        try:
            if settings.simulate:
                return "/tmp/simulated_mirror.jpg"
            
            if not self.instagram_service.page:
                return ""
            
            await self.instagram_service.page.goto(f'https://www.instagram.com/{self.instagram_service.username}/')
            await asyncio.sleep(2)
            
            mirror_screenshot_path = os.path.join(self.mirror_data_path, "mirror.jpg")
            await self.instagram_service.page.screenshot(path=mirror_screenshot_path, full_page=False)
            
            return mirror_screenshot_path
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Mirror screenshot error: {str(e)}", "warning"
            )
            return ""
    
    async def _save_mirror_data(self, mirror_data: Dict[str, Any]):
        """Save current mirror data to JSON file"""
        try:
            mirror_file_path = os.path.join(self.mirror_data_path, "current_mirror.json")
            
            with open(mirror_file_path, 'w') as f:
                json.dump(mirror_data, f, indent=2)
            
            history_file_path = os.path.join(self.mirror_data_path, "mirror_history.jsonl")
            with open(history_file_path, 'a') as f:
                f.write(json.dumps(mirror_data) + '\n')
                
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Error saving mirror data: {str(e)}", "error"
            )
    
    async def _should_create_daily_snapshot(self) -> bool:
        """Check if we should create a daily snapshot"""
        now = datetime.now()
        
        if self.last_daily_snapshot is None:
            return True
        
        if now.date() > self.last_daily_snapshot.date():
            return True
        
        return False
    
    async def _create_daily_snapshot(self, mirror_data: Dict[str, Any]):
        """Create daily profile snapshot"""
        try:
            now = datetime.now()
            snapshot_filename = f"snapshot_{now.strftime('%Y%m%d')}.json"
            snapshot_path = os.path.join(self.daily_snapshot_path, snapshot_filename)
            
            daily_snapshot = {
                "date": now.date().isoformat(),
                "timestamp": now.isoformat(),
                "profile_data": mirror_data,
                "daily_metrics": await self._calculate_daily_metrics(),
                "growth_analysis": await self._analyze_growth_trends()
            }
            
            with open(snapshot_path, 'w') as f:
                json.dump(daily_snapshot, f, indent=2)
            
            self.last_daily_snapshot = now
            
            await self.logging_service.log_system_message(
                f"Daily profile snapshot created: {snapshot_filename}"
            )
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Error creating daily snapshot: {str(e)}", "error"
            )
    
    async def _calculate_daily_metrics(self) -> Dict[str, Any]:
        """Calculate daily growth metrics"""
        try:
            history_file_path = os.path.join(self.mirror_data_path, "mirror_history.jsonl")
            
            if not os.path.exists(history_file_path):
                return {"followers_growth": 0, "following_growth": 0, "posts_growth": 0}
            
            today = datetime.now().date()
            yesterday = today - timedelta(days=1)
            
            today_data = []
            yesterday_data = []
            
            with open(history_file_path, 'r') as f:
                for line in f:
                    try:
                        data = json.loads(line.strip())
                        data_date = datetime.fromisoformat(data['timestamp']).date()
                        
                        if data_date == today:
                            today_data.append(data)
                        elif data_date == yesterday:
                            yesterday_data.append(data)
                    except:
                        continue
            
            if not today_data or not yesterday_data:
                return {"followers_growth": 0, "following_growth": 0, "posts_growth": 0}
            
            today_latest = today_data[-1]
            yesterday_latest = yesterday_data[-1]
            
            return {
                "followers_growth": today_latest.get('followers', 0) - yesterday_latest.get('followers', 0),
                "following_growth": today_latest.get('following', 0) - yesterday_latest.get('following', 0),
                "posts_growth": today_latest.get('posts', 0) - yesterday_latest.get('posts', 0),
                "data_points_today": len(today_data),
                "data_points_yesterday": len(yesterday_data)
            }
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Error calculating daily metrics: {str(e)}", "error"
            )
            return {"followers_growth": 0, "following_growth": 0, "posts_growth": 0}
    
    async def _analyze_growth_trends(self) -> Dict[str, Any]:
        """Analyze growth trends over the past week"""
        try:
            history_file_path = os.path.join(self.mirror_data_path, "mirror_history.jsonl")
            
            if not os.path.exists(history_file_path):
                return {"trend": "insufficient_data"}
            
            week_ago = datetime.now() - timedelta(days=7)
            recent_data = []
            
            with open(history_file_path, 'r') as f:
                for line in f:
                    try:
                        data = json.loads(line.strip())
                        data_time = datetime.fromisoformat(data['timestamp'])
                        
                        if data_time >= week_ago:
                            recent_data.append(data)
                    except:
                        continue
            
            if len(recent_data) < 2:
                return {"trend": "insufficient_data"}
            
            first_entry = recent_data[0]
            last_entry = recent_data[-1]
            
            followers_change = last_entry.get('followers', 0) - first_entry.get('followers', 0)
            following_change = last_entry.get('following', 0) - first_entry.get('following', 0)
            
            trend_analysis = {
                "period_days": 7,
                "followers_change": followers_change,
                "following_change": following_change,
                "average_daily_growth": followers_change / 7,
                "growth_rate": followers_change / max(first_entry.get('followers', 1), 1) * 100,
                "trend": "positive" if followers_change > 0 else "negative" if followers_change < 0 else "stable"
            }
            
            return trend_analysis
            
        except Exception as e:
            await self.logging_service.log_system_message(
                f"Error analyzing growth trends: {str(e)}", "error"
            )
            return {"trend": "error"}
    
    def get_current_mirror_data(self) -> Optional[Dict[str, Any]]:
        """Get current mirror data"""
        try:
            mirror_file_path = os.path.join(self.mirror_data_path, "current_mirror.json")
            
            if os.path.exists(mirror_file_path):
                with open(mirror_file_path, 'r') as f:
                    return json.load(f)
            
            return None
            
        except Exception as e:
            return {"error": str(e)}
    
    def get_daily_snapshots(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get recent daily snapshots"""
        try:
            snapshots = []
            
            for i in range(days):
                date = datetime.now().date() - timedelta(days=i)
                snapshot_filename = f"snapshot_{date.strftime('%Y%m%d')}.json"
                snapshot_path = os.path.join(self.daily_snapshot_path, snapshot_filename)
                
                if os.path.exists(snapshot_path):
                    with open(snapshot_path, 'r') as f:
                        snapshots.append(json.load(f))
            
            return snapshots
            
        except Exception as e:
            return [{"error": str(e)}]
    
    def get_mirror_screenshot_path(self) -> str:
        """Get path to current mirror screenshot"""
        mirror_screenshot_path = os.path.join(self.mirror_data_path, "mirror.jpg")
        
        if os.path.exists(mirror_screenshot_path):
            return mirror_screenshot_path
        
        return ""
