from .auth import router as auth_router
from .instagram import router as instagram_router
from .logs import router as logs_router
from .llm import router as llm_router
from .status import router as status_router

__all__ = ["auth_router", "instagram_router", "logs_router", "llm_router", "status_router"]
