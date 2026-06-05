from .projects import router as projects_router
from .tech_stack import router as tech_stack_router
from .academics import router as academics_router
from .socials import router as socials_router
from .resume import router as resume_router
from .visitors import router as visitors_router

__all__ = [
    "projects_router",
    "tech_stack_router",
    "academics_router",
    "socials_router",
    "resume_router",
    "visitors_router",
]
