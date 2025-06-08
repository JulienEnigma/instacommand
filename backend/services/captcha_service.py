import asyncio
import aiohttp
import json
import time
from typing import Optional, Dict, Any
from playwright.async_api import Page
from backend.services.logging_service import LoggingService
from backend.config.settings import settings

class CaptchaService:
    def __init__(self, logging_service: LoggingService):
        self.logging_service = logging_service
        self.api_key = settings.captcha_api_key
        self.solver_type = settings.captcha_solver
        self.base_url = "https://api.2captcha.com"
        self.max_retries = 3
        self.poll_interval = 5
        self.max_wait_time = 300
        
    async def detect_captcha(self, page: Page) -> bool:
        """Detect if a captcha is present on the page"""
        try:
            current_url = page.url
            
            if "instagram.com/challenge/" in current_url:
                await self.logging_service.log_system_message("CAPTCHA DETECTED - Challenge URL detected")
                return True
            
            recaptcha_elements = await page.query_selector_all("iframe[src*='recaptcha']")
            if recaptcha_elements:
                await self.logging_service.log_system_message("CAPTCHA DETECTED - reCAPTCHA iframe found")
                return True
            
            challenge_elements = await page.query_selector_all("[class*='challenge'], [id*='captcha'], .g-recaptcha")
            if challenge_elements:
                await self.logging_service.log_system_message("CAPTCHA DETECTED - Challenge elements found")
                return True
                
            return False
            
        except Exception as e:
            await self.logging_service.log_system_message(f"Error detecting captcha: {str(e)}", "error")
            return False
    
    async def solve_captcha(self, page: Page) -> bool:
        """Solve captcha using 2Captcha service"""
        if not self.api_key:
            await self.logging_service.log_system_message("No captcha API key configured", "warning")
            return False
            
        try:
            await self.logging_service.log_system_message("CAPTCHA DETECTED - Pausing operations")
            
            screenshot_path = await self._take_captcha_screenshot(page)
            
            site_key = await self._extract_site_key(page)
            if not site_key:
                await self.logging_service.log_system_message("Could not extract reCAPTCHA site key", "error")
                return False
            
            task_id = await self._submit_captcha_task(page.url, site_key)
            if not task_id:
                return False
            
            solution = await self._poll_captcha_solution(task_id)
            if not solution:
                return False
            
            success = await self._inject_captcha_solution(page, solution)
            if success:
                await self.logging_service.log_system_message("CAPTCHA SOLVED - Resuming operations")
                return True
            else:
                await self.logging_service.log_system_message("CAPTCHA SOLVER FAILED - Halting operations")
                return False
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Captcha solving error: {str(e)}", "error")
            return False
    
    async def _take_captcha_screenshot(self, page: Page) -> str:
        """Take screenshot of captcha page"""
        try:
            screenshot_path = "/tmp/captcha.jpg"
            await page.screenshot(path=screenshot_path)
            await self.logging_service.log_system_message(f"Captcha screenshot saved: {screenshot_path}")
            return screenshot_path
        except Exception as e:
            await self.logging_service.log_system_message(f"Screenshot error: {str(e)}", "error")
            return ""
    
    async def _extract_site_key(self, page: Page) -> Optional[str]:
        """Extract reCAPTCHA site key from page"""
        try:
            site_key = await page.evaluate("""
                () => {
                    const recaptcha = document.querySelector('.g-recaptcha');
                    if (recaptcha) {
                        return recaptcha.getAttribute('data-sitekey');
                    }
                    
                    const scripts = document.querySelectorAll('script');
                    for (let script of scripts) {
                        const content = script.textContent || script.innerText;
                        const match = content.match(/sitekey['"]\s*:\s*['"]([^'"]+)['"]/);
                        if (match) {
                            return match[1];
                        }
                    }
                    
                    return null;
                }
            """)
            
            if site_key:
                await self.logging_service.log_system_message(f"Extracted site key: {site_key[:20]}...")
                return site_key
            else:
                await self.logging_service.log_system_message("Could not extract site key", "warning")
                return None
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Site key extraction error: {str(e)}", "error")
            return None
    
    async def _submit_captcha_task(self, website_url: str, site_key: str) -> Optional[str]:
        """Submit captcha task to 2Captcha"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "clientKey": self.api_key,
                    "task": {
                        "type": "NoCaptchaTaskProxyless",
                        "websiteURL": website_url,
                        "websiteKey": site_key
                    }
                }
                
                async with session.post(f"{self.base_url}/createTask", json=payload) as response:
                    result = await response.json()
                    
                    if result.get("errorId") == 0:
                        task_id = result.get("taskId")
                        await self.logging_service.log_system_message(f"Captcha task submitted: {task_id}")
                        return str(task_id)
                    else:
                        error_code = result.get("errorCode", "unknown")
                        await self.logging_service.log_system_message(f"2Captcha submission error: {error_code}", "error")
                        return None
                        
        except Exception as e:
            await self.logging_service.log_system_message(f"Task submission error: {str(e)}", "error")
            return None
    
    async def _poll_captcha_solution(self, task_id: str) -> Optional[str]:
        """Poll 2Captcha for solution"""
        try:
            start_time = time.time()
            
            async with aiohttp.ClientSession() as session:
                while time.time() - start_time < self.max_wait_time:
                    payload = {
                        "clientKey": self.api_key,
                        "taskId": task_id
                    }
                    
                    async with session.post(f"{self.base_url}/getTaskResult", json=payload) as response:
                        result = await response.json()
                        
                        if result.get("errorId") == 0:
                            status = result.get("status")
                            
                            if status == "ready":
                                solution = result.get("solution", {}).get("gRecaptchaResponse")
                                if solution:
                                    await self.logging_service.log_system_message("Captcha solution received")
                                    return solution
                            elif status == "processing":
                                await asyncio.sleep(self.poll_interval)
                                continue
                            else:
                                await self.logging_service.log_system_message(f"Unexpected status: {status}", "warning")
                                break
                        else:
                            error_code = result.get("errorCode", "unknown")
                            await self.logging_service.log_system_message(f"2Captcha polling error: {error_code}", "error")
                            break
                
                await self.logging_service.log_system_message("Captcha solving timeout", "error")
                return None
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Solution polling error: {str(e)}", "error")
            return None
    
    async def _inject_captcha_solution(self, page: Page, solution: str) -> bool:
        """Inject captcha solution into page"""
        try:
            await page.evaluate(f"""
                () => {{
                    const responseElement = document.getElementById('g-recaptcha-response');
                    if (responseElement) {{
                        responseElement.innerHTML = '{solution}';
                        responseElement.style.display = 'block';
                    }}
                    
                    if (window.grecaptcha && window.grecaptcha.getResponse) {{
                        window.grecaptcha.getResponse = () => '{solution}';
                    }}
                    
                    const callback = window.recaptchaCallback || window.onRecaptchaSuccess;
                    if (callback && typeof callback === 'function') {{
                        callback('{solution}');
                    }}
                }}
            """)
            
            submit_button = await page.query_selector("#submit-button, [type='submit'], .submit-btn, button[type='submit']")
            if submit_button:
                await submit_button.click()
                await page.wait_for_timeout(2000)
                
            current_url = page.url
            if "challenge" not in current_url:
                await self.logging_service.log_system_message("Captcha solution successful - challenge passed")
                return True
            else:
                await self.logging_service.log_system_message("Captcha solution may have failed - still on challenge page", "warning")
                return False
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Solution injection error: {str(e)}", "error")
            return False
    
    async def test_captcha_service(self) -> Dict[str, Any]:
        """Test captcha service configuration"""
        if not self.api_key:
            return {
                "status": "error",
                "message": "No API key configured"
            }
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "clientKey": self.api_key,
                    "task": {
                        "type": "NoCaptchaTaskProxyless",
                        "websiteURL": "https://www.google.com/recaptcha/api2/demo",
                        "websiteKey": "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-"
                    }
                }
                
                async with session.post(f"{self.base_url}/createTask", json=payload) as response:
                    result = await response.json()
                    
                    if result.get("errorId") == 0:
                        return {
                            "status": "success",
                            "message": "2Captcha service is working",
                            "task_id": result.get("taskId")
                        }
                    else:
                        return {
                            "status": "error",
                            "message": f"2Captcha error: {result.get('errorCode', 'unknown')}"
                        }
                        
        except Exception as e:
            return {
                "status": "error",
                "message": f"Connection error: {str(e)}"
            }
