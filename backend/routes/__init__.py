from backend.routes.auth import router as auth_router
from backend.routes.instagram import router as instagram_router
from backend.routes.logs import router as logs_router
from backend.routes.llm import router as llm_router
from backend.routes.status import router as status_router

__all__ = ["auth_router", "instagram_router", "logs_router", "llm_router", "status_router"]
