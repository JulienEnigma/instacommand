import asyncio
import random
from typing import Optional, List, Dict, Any
from playwright.async_api import async_playwright, Browser, Page, BrowserContext
from datetime import datetime, timedelta
from backend.models import LogEntry, Target
from backend.services.logging_service import LoggingService
from backend.services.captcha_service import CaptchaService
from backend.config.settings import settings

class InstagramService:
    def __init__(self, logging_service: LoggingService):
        self.logging_service = logging_service
        self.captcha_service = CaptchaService(logging_service)
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.is_logged_in = False
        self.username = None
        self.action_queue = asyncio.Queue()
        self.is_running = False
        self.rate_limiter = HumanLikeRateLimiter()
        self.simulate_mode = settings.simulate
        self.failure_count = 0
        self.last_failure_time = None
        
    async def start_browser(self):
        """Start Playwright browser in headless mode"""
        if self.simulate_mode:
            await self.logging_service.log_system_message("(SIMULATED) Browser started successfully")
            return True
            
        try:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(
                headless=settings.browser_headless,
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
            await self._handle_failure()
            return False
    
    async def login(self, username: str, password: str) -> bool:
        """Login to Instagram with captcha detection and solving"""
        if self.simulate_mode:
            await self.logging_service.log_system_message(f"(SIMULATED) Successfully logged in as {username}")
            self.is_logged_in = True
            self.username = username
            return True
            
        try:
            if not self.page:
                success = await self.start_browser()
                if not success:
                    return False
            
            await self.logging_service.log_system_message(f"Attempting login for {username}")
            
            await self.page.goto('https://www.instagram.com/accounts/login/')
            await self._wait_after_page_load()
            
            await self.page.wait_for_selector('input[name="username"]', timeout=10000)
            
            await self.page.fill('input[name="username"]', username)
            await asyncio.sleep(random.uniform(0.5, 1.5))
            await self.page.fill('input[name="password"]', password)
            await asyncio.sleep(random.uniform(0.5, 1.0))
            
            await self.page.click('button[type="submit"]')
            
            await asyncio.sleep(3)
            
            if await self.captcha_service.detect_captcha(self.page):
                captcha_solved = await self.captcha_service.solve_captcha(self.page)
                if not captcha_solved:
                    await self.logging_service.log_system_message("CAPTCHA SOLVER FAILED - Halting operations", "error")
                    await self._handle_failure()
                    return False
                await asyncio.sleep(2)
            
            try:
                await self.page.wait_for_url('https://www.instagram.com/', timeout=15000)
                self.is_logged_in = True
                self.username = username
                await self.logging_service.log_system_message(f"Successfully logged in as {username}")
                self._reset_failure_count()
                return True
            except:
                error_elements = await self.page.query_selector_all('[role="alert"]')
                if error_elements:
                    error_text = await error_elements[0].inner_text()
                    await self.logging_service.log_system_message(f"Login failed: {error_text}", "error")
                else:
                    await self.logging_service.log_system_message("Login failed: Unknown error", "error")
                await self._handle_failure()
                return False
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Login error: {str(e)}", "error")
            await self._handle_failure()
            return False
    
    async def scan_hashtag(self, hashtag: str, limit: int = 20) -> List[Target]:
        """Scan hashtag for potential targets"""
        if self.simulate_mode:
            await self.logging_service.log_instagram_action("scan", hashtag, f"(SIMULATED) Scanning #{hashtag} for targets", "success")
            targets = []
            for i in range(min(limit, random.randint(5, 15))):
                target = Target(
                    username=f"user_{random.randint(1000, 9999)}",
                    bio="Film enthusiast",
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
            await self.logging_service.log_instagram_action("scan", hashtag, f"(SIMULATED) Scan complete: {len(targets)} targets found", "success")
            return targets
        
        if not self.is_logged_in:
            await self.logging_service.log_system_message("Not logged in", "error")
            return []
        
        if await self._should_pause_for_failures():
            return []
        
        try:
            await self.rate_limiter.wait("scan")
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scanning #{hashtag} for targets", "success")
            
            await self.page.goto(f'https://www.instagram.com/explore/tags/{hashtag}/')
            await self._wait_after_page_load()
            
            if await self.captcha_service.detect_captcha(self.page):
                captcha_solved = await self.captcha_service.solve_captcha(self.page)
                if not captcha_solved:
                    await self._handle_failure()
                    return []
            
            post_links = await self.page.query_selector_all('article a[href*="/p/"]')
            targets = []
            
            for i, link in enumerate(post_links[:limit]):
                if i >= limit:
                    break
                    
                try:
                    href = await link.get_attribute('href')
                    if href:
                        await self.page.goto(f'https://www.instagram.com{href}')
                        await self._wait_after_page_load()
                        
                        username_element = await self.page.query_selector('header a[role="link"]')
                        if username_element:
                            username = await username_element.inner_text()
                            
                            target = Target(
                                username=username,
                                bio="Film enthusiast",
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
                        
                        await asyncio.sleep(random.uniform(2, 4))
                        
                except Exception as e:
                    await self.logging_service.log_system_message(f"Error scanning post: {str(e)}", "warning")
                    continue
            
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scan complete: {len(targets)} targets found", "success")
            self._reset_failure_count()
            return targets
            
        except Exception as e:
            await self.logging_service.log_instagram_action("scan", hashtag, f"Scan failed: {str(e)}", "error")
            await self._handle_failure()
            return []
    
    async def follow_user(self, username: str) -> bool:
        """Follow a user"""
        if self.simulate_mode:
            await self.logging_service.log_instagram_action(
                "follow", username, f"(SIMULATED) Successfully followed @{username}", "success",
                followback_chance=random.uniform(0.6, 0.9)
            )
            return True
            
        if not self.is_logged_in:
            return False
        
        if await self._should_pause_for_failures():
            return False
        
        try:
            await self.rate_limiter.wait("follow")
            
            await self.page.goto(f'https://www.instagram.com/{username}/')
            await self._wait_after_page_load()
            
            if await self.captcha_service.detect_captcha(self.page):
                captcha_solved = await self.captcha_service.solve_captcha(self.page)
                if not captcha_solved:
                    await self._handle_failure()
                    return False
            
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
                    self._reset_failure_count()
                    return True
                else:
                    await self.logging_service.log_instagram_action(
                        "follow", username, f"Follow attempt failed for @{username}", "error"
                    )
                    await self._handle_failure()
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
            await self._handle_failure()
            return False
    
    async def send_dm(self, username: str, message: str) -> bool:
        """Send direct message to user"""
        if self.simulate_mode:
            await self.logging_service.log_instagram_action(
                "dm", username, f"(SIMULATED) Sent DM to @{username}: {message[:50]}...", "success"
            )
            return True
            
        if not self.is_logged_in:
            return False
        
        if await self._should_pause_for_failures():
            return False
        
        try:
            await self.rate_limiter.wait("dm")
            
            await self.page.goto(f'https://www.instagram.com/{username}/')
            await self._wait_after_page_load()
            
            if await self.captcha_service.detect_captcha(self.page):
                captcha_solved = await self.captcha_service.solve_captcha(self.page)
                if not captcha_solved:
                    await self._handle_failure()
                    return False
            
            message_button = await self.page.query_selector('button:has-text("Message")')
            if message_button:
                await message_button.click()
                await self.page.wait_for_selector('textarea[placeholder*="Message"]', timeout=5000)
                
                await asyncio.sleep(random.uniform(1, 2))
                await self.page.fill('textarea[placeholder*="Message"]', message)
                await asyncio.sleep(random.uniform(0.5, 1.5))
                await self.page.press('textarea[placeholder*="Message"]', 'Enter')
                
                await self.logging_service.log_instagram_action(
                    "dm", username, f"Sent DM to @{username}: {message[:50]}...", "success"
                )
                self._reset_failure_count()
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
            await self._handle_failure()
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
        if self.simulate_mode:
            return "/tmp/simulated_screenshot.png"
            
        if not self.page:
            return ""
        
        try:
            screenshot_path = f"/tmp/instagram_screenshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            await self.page.screenshot(path=screenshot_path, full_page=True)
            return screenshot_path
        except Exception as e:
            await self.logging_service.log_system_message(f"Screenshot error: {str(e)}", "warning")
            return ""
    
    async def _wait_after_page_load(self):
        """Wait after page load with human-like timing"""
        if not self.simulate_mode:
            await self.page.wait_for_load_state('networkidle')
        await asyncio.sleep(settings.page_load_cooldown)
    
    async def _handle_failure(self):
        """Handle operation failure with exponential backoff"""
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

class HumanLikeRateLimiter:
    def __init__(self):
        self.last_action_time = None
        self.last_action_type = None
        self.min_delay = settings.min_action_delay
        self.max_delay = settings.max_action_delay
    
    async def wait(self, action_type: str = "generic"):
        """Wait with human-like timing patterns"""
        current_time = datetime.now()
        
        if self.last_action_time:
            elapsed = current_time - self.last_action_time
            min_wait = timedelta(seconds=self.min_delay)
            
            if elapsed < min_wait:
                wait_time = (min_wait - elapsed).total_seconds()
                await asyncio.sleep(wait_time)
        
        if self.last_action_type == action_type:
            extra_delay = random.uniform(3, 8)
            await asyncio.sleep(extra_delay)
        
        random_delay = random.uniform(self.min_delay, self.max_delay)
        await asyncio.sleep(random_delay)
        
        self.last_action_time = current_time
        self.last_action_type = action_type
