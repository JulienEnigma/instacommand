import asyncio
import json
import torch
from typing import Optional, Dict, Any, List
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from datetime import datetime
from backend.services.logging_service import LoggingService
from backend.config.settings import settings

try:
    from vllm import LLM, SamplingParams
    VLLM_AVAILABLE = True
except ImportError:
    VLLM_AVAILABLE = False

class LLMService:
    def __init__(self, logging_service: LoggingService, model_name: Optional[str] = None):
        self.logging_service = logging_service
        self.model_name = model_name or settings.llm_model_name
        self.fallback_model = settings.llm_fallback_model
        self.tokenizer = None
        self.model = None
        self.vllm_model = None
        self.pipeline = None
        self.is_loaded = False
        self.use_vllm = VLLM_AVAILABLE
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.fallback_mode = False
        
    async def initialize(self):
        """Initialize the LLM model with fallback support"""
        try:
            await self.logging_service.log_system_message(f"Loading LLM model: {self.model_name}")
            
            if self.use_vllm and self.device == "cuda":
                success = await self._try_load_vllm()
                if success:
                    return
            
            success = await self._try_load_transformers(self.model_name)
            if not success:
                await self.logging_service.log_system_message(f"Primary model failed, trying fallback: {self.fallback_model}")
                success = await self._try_load_transformers(self.fallback_model)
                if success:
                    self.fallback_mode = True
                    
            if not success:
                await self.logging_service.log_system_message("All models failed, using dummy responses", "warning")
                self.is_loaded = True
                self.fallback_mode = True
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Failed to initialize LLM: {str(e)}", "error")
            self.is_loaded = True
            self.fallback_mode = True
    
    async def _try_load_vllm(self) -> bool:
        """Try to load model with vLLM"""
        try:
            self.vllm_model = LLM(
                model=self.model_name,
                tensor_parallel_size=1,
                gpu_memory_utilization=0.8,
                quantization="awq" if "awq" in self.model_name.lower() else None
            )
            self.is_loaded = True
            await self.logging_service.log_system_message(f"vLLM model loaded successfully: {self.model_name}")
            return True
        except Exception as e:
            await self.logging_service.log_system_message(f"vLLM loading failed: {str(e)}", "warning")
            return False
    
    async def _try_load_transformers(self, model_name: str) -> bool:
        """Try to load model with transformers"""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                load_in_8bit=True if self.device == "cuda" else False
            )
            
            self.pipeline = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if self.device == "cuda" else -1,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
            )
            
            self.is_loaded = True
            await self.logging_service.log_system_message(f"Transformers model loaded successfully: {model_name}")
            return True
        except Exception as e:
            await self.logging_service.log_system_message(f"Transformers loading failed for {model_name}: {str(e)}", "warning")
            return False
    
    async def generate_text(self, prompt: str, max_length: int = 150, temperature: float = 0.7) -> str:
        """Generate text using the LLM"""
        if not self.is_loaded:
            return "LLM not loaded"
        
        if self.fallback_mode and not self.model:
            return self._get_dummy_response(prompt)
        
        try:
            if self.vllm_model:
                return await self._generate_vllm(prompt, max_length, temperature)
            elif self.pipeline:
                return await self._generate_transformers(prompt, max_length, temperature)
            else:
                return self._get_dummy_response(prompt)
                
        except Exception as e:
            await self.logging_service.log_system_message(f"Text generation error: {str(e)}", "error")
            return self._get_dummy_response(prompt)
    
    async def _generate_vllm(self, prompt: str, max_length: int, temperature: float) -> str:
        """Generate text using vLLM"""
        sampling_params = SamplingParams(
            temperature=temperature,
            max_tokens=max_length,
            top_p=0.9
        )
        
        outputs = self.vllm_model.generate([prompt], sampling_params)
        return outputs[0].outputs[0].text.strip()
    
    async def _generate_transformers(self, prompt: str, max_length: int, temperature: float) -> str:
        """Generate text using transformers pipeline"""
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            self._generate_sync, 
            prompt, 
            max_length, 
            temperature
        )
        return response
    
    def _generate_sync(self, prompt: str, max_length: int, temperature: float) -> str:
        """Synchronous text generation"""
        try:
            outputs = self.pipeline(
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                return_full_text=False
            )
            
            return outputs[0]['generated_text'].strip()
            
        except Exception as e:
            return f"Generation error: {str(e)}"
    
    def _get_dummy_response(self, prompt: str) -> str:
        """Generate dummy responses for fallback mode"""
        if "dm" in prompt.lower() or "message" in prompt.lower():
            return "Hey! I noticed we have similar interests. Would love to connect and share ideas!"
        elif "caption" in prompt.lower():
            return "Living the dream ✨ #inspiration #creativity #lifestyle"
        elif "hashtag" in prompt.lower():
            return "#photography #art #creative #inspiration #lifestyle #motivation"
        elif "analyze" in prompt.lower():
            return "Analysis shows positive engagement patterns with peak activity during evening hours."
        else:
            return "I'm here to help with your Instagram strategy and content creation!"
    
    async def generate_response(self, prompt: str, max_length: int = 150, temperature: float = 0.7) -> str:
        """Legacy method for backward compatibility"""
        return await self.generate_text(prompt, max_length, temperature)
    
    async def analyze_logs(self, logs: List[Dict[str, Any]]) -> str:
        """Analyze recent logs and provide insights"""
        if not logs:
            return "No recent activity to analyze."
        
        log_summary = self._create_log_summary(logs)
        prompt = f"""
Analyze the following Instagram automation activity and provide strategic insights:

{log_summary}

Based on this data, provide:
1. Performance assessment
2. Optimization recommendations
3. Risk analysis
4. Next action suggestions

Analysis:"""
        
        response = await self.generate_response(prompt, max_length=200)
        return response
    
    async def suggest_targets(self, hashtag: str, current_targets: List[Dict[str, Any]]) -> str:
        """Suggest targeting strategy for hashtag"""
        prompt = f"""
Instagram targeting strategy for #{hashtag}:

Current targets: {len(current_targets)} users identified
Success rate: {self._calculate_success_rate(current_targets)}%

Suggest:
1. Optimal posting times
2. Content strategy
3. Engagement tactics
4. Risk mitigation

Strategy:"""
        
        response = await self.generate_response(prompt, max_length=180)
        return response
    
    async def generate_dm_message(self, target_username: str, target_bio: str, context: str = "") -> str:
        """Generate personalized DM message"""
        prompt = f"""
Create a personalized Instagram DM for @{target_username}:

Bio: {target_bio}
Context: {context}

Requirements:
- Natural and engaging
- Not spammy
- Relevant to their interests
- Under 100 characters

Message:"""
        
        response = await self.generate_response(prompt, max_length=100)
        return response.strip()
    
    async def analyze_campaign_performance(self, campaign_data: Dict[str, Any]) -> str:
        """Analyze campaign performance and suggest improvements"""
        prompt = f"""
Campaign Performance Analysis:

Name: {campaign_data.get('name', 'Unknown')}
Progress: {campaign_data.get('progress', 0)}%
Target: {campaign_data.get('target', 0)}
Current: {campaign_data.get('current', 0)}
Status: {campaign_data.get('status', 'unknown')}

Provide:
1. Performance evaluation
2. Bottleneck identification
3. Optimization strategies
4. Timeline adjustments

Analysis:"""
        
        response = await self.generate_response(prompt, max_length=200)
        return response
    
    async def generate_command_suggestion(self, user_input: str, context: Dict[str, Any]) -> str:
        """Generate command suggestions based on user input"""
        prompt = f"""
User wants to: {user_input}

Available commands:
- scan #hashtag - Find new targets
- follow @username - Follow a user
- dm @username "message" - Send direct message
- pause ops - Pause all operations
- reflex update - Update automation settings

Current status: {context.get('status', 'unknown')}
Active campaigns: {context.get('campaigns', 0)}

Suggest the best command and explain why:

Suggestion:"""
        
        response = await self.generate_response(prompt, max_length=120)
        return response
    
    def _create_log_summary(self, logs: List[Dict[str, Any]]) -> str:
        """Create a summary of recent logs"""
        if not logs:
            return "No recent activity"
        
        summary_lines = []
        for log in logs[-10:]:  # Last 10 logs
            action = log.get('action', 'unknown')
            target = log.get('target', '')
            outcome = log.get('outcome', 'unknown')
            summary_lines.append(f"- {action} {target}: {outcome}")
        
        return "\n".join(summary_lines)
    
    def _calculate_success_rate(self, targets: List[Dict[str, Any]]) -> int:
        """Calculate success rate from targets"""
        if not targets:
            return 0
        
        successful = sum(1 for t in targets if t.get('status') == 'completed')
        return int((successful / len(targets)) * 100)
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get current model status"""
        return {
            "is_loaded": self.is_loaded,
            "model_name": self.model_name,
            "fallback_model": self.fallback_model,
            "fallback_mode": self.fallback_mode,
            "use_vllm": self.use_vllm and self.vllm_model is not None,
            "device": self.device,
            "cuda_available": torch.cuda.is_available(),
            "vllm_available": VLLM_AVAILABLE,
            "memory_usage": self._get_memory_usage()
        }
    
    def _get_memory_usage(self) -> Dict[str, Any]:
        """Get memory usage information"""
        if torch.cuda.is_available():
            return {
                "gpu_memory_allocated": torch.cuda.memory_allocated(),
                "gpu_memory_cached": torch.cuda.memory_reserved(),
                "gpu_memory_total": torch.cuda.get_device_properties(0).total_memory
            }
        else:
            return {"cpu_only": True}

class StanleyAI:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self.personality_prompt = """
        You are Stanley, the AI brain of Social Commander - an elite Instagram operations system.
        
        PERSONALITY:
        - Strategic and analytical, like a military intelligence officer
        - Focused on growth, engagement, and tactical advantage
        - Speaks with authority and precision
        - Uses tactical language: "targets", "operations", "campaigns", "intel"
        - Provides actionable insights, not generic advice
        
        CAPABILITIES:
        - Analyze engagement patterns and predict optimal timing
        - Identify high-value targets based on behavior patterns
        - Generate personalized DM strategies for different personas
        - Recommend hashtag combinations for maximum reach
        - Detect anomalies in follower behavior and engagement
        
        Keep responses under 100 words. Be direct and actionable.
        """
    
    async def get_insight(self, data: Dict[str, Any] = None) -> str:
        """Generate Stanley's strategic insight"""
        prompt = f"{self.personality_prompt}\n\nMISSION: Provide tactical insight on current Instagram operations."
        if data:
            prompt += f"\n\nINTEL: {json.dumps(data, indent=2)}"
        prompt += "\n\nSTANLEY INSIGHT:"
        
        response = await self.llm_service.generate_text(prompt, max_length=80)
        return response or "Operations nominal. All systems green. Engagement patterns within expected parameters."
    
    async def get_recommendation(self, data: Dict[str, Any]) -> str:
        """Generate Stanley's tactical recommendation"""
        prompt = f"{self.personality_prompt}\n\nMISSION: Analyze intel and provide tactical recommendation.\n\nINTEL: {json.dumps(data, indent=2)}\n\nSTANLEY RECOMMENDATION:"
        
        response = await self.llm_service.generate_text(prompt, max_length=100)
        return response or "Recommend adjusting target acquisition parameters. Focus on high-engagement profiles during peak hours."
    
    async def get_alert(self, issue: str) -> str:
        """Generate Stanley's tactical alert"""
        prompt = f"{self.personality_prompt}\n\nMISSION: Generate tactical alert for operational issue.\n\nISSUE: {issue}\n\nSTANLEY ALERT:"
        
        response = await self.llm_service.generate_text(prompt, max_length=60)
        return response or f"ALERT: {issue} detected. Immediate tactical response required."
    
    async def generate_dm_strategy(self, target_profile: Dict[str, Any]) -> str:
        """Generate personalized DM strategy"""
        prompt = f"{self.personality_prompt}\n\nMISSION: Create personalized DM strategy for target.\n\nTARGET PROFILE: {json.dumps(target_profile, indent=2)}\n\nDM STRATEGY:"
        
        response = await self.llm_service.generate_text(prompt, max_length=120)
        return response or "Approach with shared interest angle. Reference recent content. Keep initial contact brief and genuine."
    
    async def analyze_engagement_patterns(self, engagement_data: List[Dict[str, Any]]) -> str:
        """Analyze engagement patterns for optimization"""
        prompt = f"{self.personality_prompt}\n\nMISSION: Analyze engagement patterns and identify optimization opportunities.\n\nENGAGEMENT DATA: {json.dumps(engagement_data, indent=2)}\n\nPATTERN ANALYSIS:"
        
        response = await self.llm_service.generate_text(prompt, max_length=150)
        return response or "Peak engagement detected 7-9 PM. Recommend increasing activity during these windows for maximum impact."
