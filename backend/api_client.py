import httpx
from typing import Dict, Any, List, Optional
import json

class SocialCommanderAPI:
    """API client for Social Commander backend"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url)
    
    async def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login to Instagram"""
        response = await self.client.post("/auth/login", json={
            "username": username,
            "password": password
        })
        return response.json()
    
    async def logout(self) -> Dict[str, Any]:
        """Logout from Instagram"""
        response = await self.client.post("/auth/logout")
        return response.json()
    
    async def get_auth_status(self) -> Dict[str, Any]:
        """Get authentication status"""
        response = await self.client.get("/auth/status")
        return response.json()
    
    async def scan_hashtag(self, hashtag: str, limit: int = 20) -> Dict[str, Any]:
        """Scan hashtag for targets"""
        response = await self.client.post("/instagram/scan", json={
            "hashtag": hashtag,
            "limit": limit
        })
        return response.json()
    
    async def follow_user(self, username: str) -> Dict[str, Any]:
        """Follow a user"""
        response = await self.client.post("/instagram/follow", json={
            "username": username
        })
        return response.json()
    
    async def send_dm(self, username: str, message: str) -> Dict[str, Any]:
        """Send direct message"""
        response = await self.client.post("/instagram/dm", json={
            "username": username,
            "message": message
        })
        return response.json()
    
    async def get_profile_stats(self) -> Dict[str, Any]:
        """Get profile statistics"""
        response = await self.client.get("/instagram/profile/stats")
        return response.json()
    
    async def get_screenshot(self) -> Dict[str, Any]:
        """Get Instagram screenshot"""
        response = await self.client.get("/instagram/mirror/screenshot")
        return response.json()
    
    async def pause_operations(self) -> Dict[str, Any]:
        """Pause all operations"""
        response = await self.client.post("/instagram/operations/pause")
        return response.json()
    
    async def resume_operations(self) -> Dict[str, Any]:
        """Resume operations"""
        response = await self.client.post("/instagram/operations/resume")
        return response.json()
    
    async def get_logs(self, limit: int = 100, log_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get logs"""
        params = {"limit": limit}
        if log_type:
            params["log_type"] = log_type
        
        response = await self.client.get("/logs/", params=params)
        return response.json()
    
    async def generate_text(self, prompt: str, max_length: int = 150, temperature: float = 0.7) -> Dict[str, Any]:
        """Generate text using LLM"""
        response = await self.client.post("/llm/generate", json={
            "prompt": prompt,
            "max_length": max_length,
            "temperature": temperature
        })
        return response.json()
    
    async def stanley_insight(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Get Stanley AI insight"""
        response = await self.client.post("/llm/stanley/insight", json=context)
        return response.json()
    
    async def stanley_recommendation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get Stanley AI recommendation"""
        response = await self.client.post("/llm/stanley/recommendation", json=data)
        return response.json()
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get system status"""
        response = await self.client.get("/status/")
        return response.json()
    
    async def get_metrics(self) -> Dict[str, Any]:
        """Get system metrics"""
        response = await self.client.get("/status/metrics")
        return response.json()
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
