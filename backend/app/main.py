"""
FunctionalLoop Cosmos API
=========================
Main application entry point. Route logic lives in `routers/`.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import get_db  # noqa: F401 — imported to ensure DB init runs
from . import seed
from .routers import (
    projects_router,
    tech_stack_router,
    academics_router,
    socials_router,
    resume_router,
    visitors_router,
)

app = FastAPI(
    title="FunctionalLoop Cosmos API",
    description="Backend API serving data to the interactive 3D solar system portfolio.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, lock down to the Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ──────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    seed.seed_db()


# ── Health ───────────────────────────────────────────────────────────────────
@app.get("/health", status_code=200, tags=["Health"])
def health_check():
    return {"status": "healthy"}


# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(visitors_router)
app.include_router(projects_router)
app.include_router(tech_stack_router)
app.include_router(academics_router)
app.include_router(socials_router)
app.include_router(resume_router)
