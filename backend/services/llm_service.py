import asyncio
import json
import torch
from typing import Optional, Dict, Any, List
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from datetime import datetime
from .logging_service import LoggingService

class LLMService:
    def __init__(self, logging_service: LoggingService, model_name: str = "microsoft/DialoGPT-medium"):
        self.logging_service = logging_service
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.pipeline = None
        self.is_loaded = False
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    async def initialize(self):
        """Initialize the LLM model"""
        try:
            await self.logging_service.log_system_message(f"Loading LLM model: {self.model_name}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None
            )
            
            self.pipeline = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if self.device == "cuda" else -1,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
            )
            
            self.is_loaded = True
            await self.logging_service.log_system_message(f"LLM model loaded successfully on {self.device}")
            return True
            
        except Exception as e:
            await self.logging_service.log_system_message(f"Failed to load LLM model: {str(e)}", "error")
            return False
    
    async def generate_response(self, prompt: str, max_length: int = 150, temperature: float = 0.7) -> str:
        """Generate text response from prompt"""
        if not self.is_loaded:
            return "LLM model not loaded"
        
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                self._generate_sync, 
                prompt, 
                max_length, 
                temperature
            )
            return response
            
        except Exception as e:
            await self.logging_service.log_system_message(f"LLM generation error: {str(e)}", "error")
            return f"Error generating response: {str(e)}"
    
    def _generate_sync(self, prompt: str, max_length: int, temperature: float) -> str:
        """Synchronous text generation"""
        try:
            outputs = self.pipeline(
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                num_return_sequences=1
            )
            
            generated_text = outputs[0]['generated_text']
            response = generated_text[len(prompt):].strip()
            return response if response else "I understand your request."
            
        except Exception as e:
            return f"Generation error: {str(e)}"
    
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
            "device": self.device,
            "cuda_available": torch.cuda.is_available(),
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
    """Stanley AI personality wrapper for LLM responses"""
    
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self.personality_prompt = """
You are Stanley, an AI assistant for Instagram automation. You are:
- Strategic and analytical
- Focused on growth and engagement
- Risk-aware but opportunistic
- Concise and actionable
- Slightly military/tactical in tone

Always respond as Stanley would, with confidence and expertise.
"""
    
    async def get_insight(self, context: Dict[str, Any]) -> str:
        """Get Stanley's insight on current situation"""
        prompt = f"{self.personality_prompt}\n\nCurrent situation: {json.dumps(context, indent=2)}\n\nStanley's insight:"
        
        response = await self.llm_service.generate_response(prompt, max_length=150)
        return self._format_stanley_response(response)
    
    async def get_recommendation(self, data: Dict[str, Any]) -> str:
        """Get Stanley's recommendation"""
        prompt = f"{self.personality_prompt}\n\nData analysis: {json.dumps(data, indent=2)}\n\nStanley's recommendation:"
        
        response = await self.llm_service.generate_response(prompt, max_length=120)
        return self._format_stanley_response(response)
    
    async def get_alert(self, issue: str) -> str:
        """Get Stanley's alert message"""
        prompt = f"{self.personality_prompt}\n\nIssue detected: {issue}\n\nStanley's alert:"
        
        response = await self.llm_service.generate_response(prompt, max_length=100)
        return self._format_stanley_response(response)
    
    def _format_stanley_response(self, response: str) -> str:
        """Format response to match Stanley's personality"""
        if not response or response.startswith("Error"):
            return "System optimized. Ready for operations."
        
        if not any(word in response.lower() for word in ['recommend', 'suggest', 'advise', 'analyze', 'detect']):
            response = f"Analysis complete. {response}"
        
        return response.strip()
