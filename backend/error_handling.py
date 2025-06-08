import logging
import traceback
from typing import Any, Dict, Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from datetime import datetime

logger = logging.getLogger(__name__)

class SocialCommanderException(Exception):
    """Base exception for Social Commander application"""
    def __init__(self, message: str, error_code: str = "GENERAL_ERROR", details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)

class InstagramAuthException(SocialCommanderException):
    """Instagram authentication related errors"""
    def __init__(self, message: str = "Instagram authentication failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, "INSTAGRAM_AUTH_ERROR", details)

class InstagramRateLimitException(SocialCommanderException):
    """Instagram rate limiting errors"""
    def __init__(self, message: str = "Instagram rate limit exceeded", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, "INSTAGRAM_RATE_LIMIT", details)

class LLMException(SocialCommanderException):
    """LLM service related errors"""
    def __init__(self, message: str = "LLM service error", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, "LLM_ERROR", details)

class QueueException(SocialCommanderException):
    """Queue service related errors"""
    def __init__(self, message: str = "Queue service error", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, "QUEUE_ERROR", details)

async def social_commander_exception_handler(request: Request, exc: SocialCommanderException):
    """Handle custom Social Commander exceptions"""
    logger.error(f"Social Commander Error: {exc.error_code} - {exc.message}", extra={"details": exc.details})
    
    return JSONResponse(
        status_code=400,
        content={
            "error": True,
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details,
            "timestamp": datetime.now().isoformat()
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    error_id = f"error_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    logger.error(f"Unhandled exception [{error_id}]: {str(exc)}", extra={
        "traceback": traceback.format_exc(),
        "request_url": str(request.url),
        "request_method": request.method
    })
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An internal server error occurred",
            "error_id": error_id,
            "timestamp": datetime.now().isoformat()
        }
    )

def setup_error_handling(app):
    """Set up error handlers for the FastAPI app"""
    app.add_exception_handler(SocialCommanderException, social_commander_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
    
    return app

def log_operation_start(operation: str, target: str = "", details: Dict[str, Any] = None):
    """Log the start of an operation"""
    logger.info(f"Starting {operation}", extra={
        "operation": operation,
        "target": target,
        "details": details or {},
        "timestamp": datetime.now().isoformat()
    })

def log_operation_success(operation: str, target: str = "", details: Dict[str, Any] = None):
    """Log successful completion of an operation"""
    logger.info(f"Completed {operation} successfully", extra={
        "operation": operation,
        "target": target,
        "details": details or {},
        "timestamp": datetime.now().isoformat()
    })

def log_operation_error(operation: str, error: str, target: str = "", details: Dict[str, Any] = None):
    """Log operation error"""
    logger.error(f"Failed {operation}: {error}", extra={
        "operation": operation,
        "target": target,
        "error": error,
        "details": details or {},
        "timestamp": datetime.now().isoformat()
    })
