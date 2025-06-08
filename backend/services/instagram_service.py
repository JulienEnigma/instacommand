import asyncio
import random
from typing import Optional, List, Dict, Any
from playwright.async_api import async_playwright, Browser, Page, BrowserContext
from datetime import datetime, timedelta
from models import LogEntry, Target
from .logging_service import LoggingService

class InstagramService:
    def __init__(self, logging_service: LoggingService):
        self.logging_service = logging_service
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.is_logged_in = False
        self.username = None
        self.action_queue = asyncio.Queue()
        self.is_running = False
        self.rate_limiter = RateLimiter()
        
    async def start_browser(self):
        """Start Playwright browser in headless mode"""
        try:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            )
            self.context = await self.browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            )
            self.page = await self.context.new_page()
            await self.logging_service.log_system_message("Browser started successfully")
            return True
        except Exception as e:
            await self.logging_service.log_system_message(f"Failed to start browser: {str(e)}", "error")
            return False
    
    async def login(self, username: str, password: str) -> bool:
        """Login to Instagram"""
        try:
            if not self.page:
                await self.start_browser()
            
            await self.logging_service.log_system_message(f"Attempting login for {username}")
            
            await self.page.goto('https://www.instagram.com/accounts/login/')
            await self.page.wait_for_load_state('networkidle')
            
            await self.page.wait_for_selector('input[name="username"]', timeout=10000)
            
            await self.page.fill('input[name="username"]', username)
            await self.page.fill('input[name="password"]', password)
            
            await self.page.click('button[type="submit"]')
            
            try:
                await self.page.wait_for_url('https://www.instagram.com/', timeout=15000)
                self.is_logged_in = True
                self.username = username
                await self.logging_service.log_system_message(f"Successfully logged in as {username}")
                return True
            except:
                error_elements = await self.page.query_selector_all('[role="alert"]')
                if error_elements:
                    error_text = await error_elements[0].inner_text()
                    await self.logging_service.log_system_message(f"Login failed: {error_text}", "error")
                else:
                    await self.logging_service.log_system_message("Login failed: Unknown error", "error")
                return False
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Login error: {str(e)}", "error")
            return False
    
    async def scan_hashtag(self, hashtag: str, limit: int = 20) -> List[Target]:
        """Scan hashtag for potential targets"""
        if not self.is_logged_in:
            await self.logging_service.log_system_message("Not logged in", "error")
            return []
        
        try:
            await self.rate_limiter.wait()
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scanning #{hashtag} for targets", "success")
            
            await self.page.goto(f'https://www.instagram.com/explore/tags/{hashtag}/')
            await self.page.wait_for_load_state('networkidle')
            
            post_links = await self.page.query_selector_all('article a[href*="/p/"]')
            targets = []
            
            for i, link in enumerate(post_links[:limit]):
                if i >= limit:
                    break
                    
                try:
                    href = await link.get_attribute('href')
                    if href:
                        await self.page.goto(f'https://www.instagram.com{href}')
                        await self.page.wait_for_load_state('networkidle')
                        
                        username_element = await self.page.query_selector('header a[role="link"]')
                        if username_element:
                            username = await username_element.inner_text()
                            
                            target = Target(
                                username=username,
                                bio="Film enthusiast",  # Mock data for now
                                location="Los Angeles, CA",
                                country="USA",
                                continent="North America",
                                strategy="hashtag_engagement",
                                status="queued",
                                followBackChance=random.randint(60, 90),
                                storyDMOpen="Medium",
                                tagsMatched=random.randint(3, 7),
                                totalTags=10,
                                userTags=[hashtag, "photography", "creative"]
                            )
                            targets.append(target)
                            
                            await self.logging_service.log_instagram_action(
                                "scan", username, f"Found potential target: {username}", "success", 
                                probability=target.followBackChance/100
                            )
                        
                        await asyncio.sleep(random.uniform(2, 4))  # Rate limiting
                        
                except Exception as e:
                    await self.logging_service.log_system_message(f"Error scanning post: {str(e)}", "warning")
                    continue
            
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scan complete: {len(targets)} targets found", "success")
            return targets
            
        except Exception as e:
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scan failed: {str(e)}", "error")
            return []
    
    async def follow_user(self, username: str) -> bool:
        """Follow a user"""
        if not self.is_logged_in:
            return False
        
        try:
            await self.rate_limiter.wait()
            
            await self.page.goto(f'https://www.instagram.com/{username}/')
            await self.page.wait_for_load_state('networkidle')
            
            follow_button = await self.page.query_selector('button:has-text("Follow")')
            if follow_button:
                await follow_button.click()
                await asyncio.sleep(random.uniform(1, 3))
                
                following_button = await self.page.query_selector('button:has-text("Following")')
                if following_button:
                    await self.logging_service.log_instagram_action(
                        "follow", username, f"Successfully followed @{username}", "success",
                        followback_chance=random.uniform(0.6, 0.9)
                    )
                    return True
                else:
                    await self.logging_service.log_instagram_action(
                        "follow", username, f"Follow attempt failed for @{username}", "error"
                    )
                    return False
            else:
                await self.logging_service.log_instagram_action(
                    "follow", username, f"Already following @{username} or profile private", "warning"
                )
                return False
                
        except Exception as e:
            await self.logging_service.log_instagram_action(
                "follow", username, f"Follow error: {str(e)}", "error"
            )
            return False
    
    async def send_dm(self, username: str, message: str) -> bool:
        """Send direct message to user"""
        if not self.is_logged_in:
            return False
        
        try:
            await self.rate_limiter.wait()
            
            await self.page.goto(f'https://www.instagram.com/{username}/')
            await self.page.wait_for_load_state('networkidle')
            
            message_button = await self.page.query_selector('button:has-text("Message")')
            if message_button:
                await message_button.click()
                await self.page.wait_for_selector('textarea[placeholder*="Message"]', timeout=5000)
                
                await self.page.fill('textarea[placeholder*="Message"]', message)
                await self.page.press('textarea[placeholder*="Message"]', 'Enter')
                
                await self.logging_service.log_instagram_action(
                    "dm", username, f"Sent DM to @{username}: {message[:50]}...", "success"
                )
                return True
            else:
                await self.logging_service.log_instagram_action(
                    "dm", username, f"Cannot send DM to @{username} - messaging not available", "warning"
                )
                return False
                
        except Exception as e:
            await self.logging_service.log_instagram_action(
                "dm", username, f"DM error: {str(e)}", "error"
            )
            return False
    
    async def get_profile_stats(self) -> Dict[str, Any]:
        """Get current user's profile statistics"""
        if not self.is_logged_in or not self.username:
            return {"followers": 0, "following": 0, "posts": 0}
        
        try:
            await self.page.goto(f'https://www.instagram.com/{self.username}/')
            await self.page.wait_for_load_state('networkidle')
            
            stats_elements = await self.page.query_selector_all('header section ul li')
            stats = {"followers": 0, "following": 0, "posts": 0}
            
            if len(stats_elements) >= 3:
                posts_text = await stats_elements[0].inner_text()
                followers_text = await stats_elements[1].inner_text()
                following_text = await stats_elements[2].inner_text()
                
                stats["posts"] = self._parse_stat_number(posts_text)
                stats["followers"] = self._parse_stat_number(followers_text)
                stats["following"] = self._parse_stat_number(following_text)
            
            return stats
            
        except Exception as e:
            await self.logging_service.log_system_message(f"Error getting profile stats: {str(e)}", "warning")
            return {"followers": 0, "following": 0, "posts": 0}
    
    def _parse_stat_number(self, text: str) -> int:
        """Parse Instagram stat numbers (handles K, M suffixes)"""
        try:
            import re
            number_match = re.search(r'([\d,]+\.?\d*)\s*([KM]?)', text.replace(',', ''))
            if number_match:
                number = float(number_match.group(1))
                suffix = number_match.group(2)
                
                if suffix == 'K':
                    return int(number * 1000)
                elif suffix == 'M':
                    return int(number * 1000000)
                else:
                    return int(number)
            return 0
        except:
            return 0
    
    async def take_screenshot(self) -> str:
        """Take screenshot of current page"""
        if not self.page:
            return ""
        
        try:
            screenshot_path = f"/tmp/instagram_screenshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await self.page.screenshot(path=screenshot_path, full_page=True)
            return screenshot_path
        except Exception as e:
            await self.logging_service.log_system_message(f"Screenshot error: {str(e)}", "warning")
            return ""
    
    async def close(self):
        """Close browser and cleanup"""
        try:
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            await self.logging_service.log_system_message("Browser closed")
        except Exception as e:
            await self.logging_service.log_system_message(f"Error closing browser: {str(e)}", "warning")

class RateLimiter:
    def __init__(self):
        self.last_action_time = None
        self.min_delay = 3  # Minimum 3 seconds between actions
        self.max_delay = 8  # Maximum 8 seconds between actions
    
    async def wait(self):
        """Wait appropriate time before next action"""
        if self.last_action_time:
            elapsed = datetime.now() - self.last_action_time
            min_wait = timedelta(seconds=self.min_delay)
            
            if elapsed < min_wait:
                wait_time = (min_wait - elapsed).total_seconds()
                await asyncio.sleep(wait_time)
        
        random_delay = random.uniform(self.min_delay, self.max_delay)
        await asyncio.sleep(random_delay)
        
        self.last_action_time = datetime.now()
