from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import get_db
from . import crud, schemas, seed

app = FastAPI(
    title="FunctionalLoop Cosmos API",
    description="Backend API serving data to the interactive 3D solar system portfolio.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock down to Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to verify database and seed
@app.on_event("startup")
def startup_event():
    seed.seed_db()

# --- Health check ---
@app.get("/health", status_code=200)
def health_check():
    return {"status": "healthy"}

# --- Projects Routes ---
@app.get("/api/projects", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_projects(db, skip=skip, limit=limit)

@app.get("/api/projects/{slug}", response_model=schemas.Project)
def read_project(slug: str, db: Session = Depends(get_db)):
    project = crud.get_project_by_slug(db, slug=slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# --- Tech Stack Routes ---
@app.get("/api/tech-stack", response_model=List[schemas.TechStack])
def read_tech_stack(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tech_stacks(db, skip=skip, limit=limit)

# --- Academics Routes ---
@app.get("/api/academics", response_model=List[schemas.Academic])
def read_academics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_academics(db, skip=skip, limit=limit)

# --- Socials Routes ---
@app.get("/api/socials", response_model=List[schemas.Social])
def read_socials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_socials(db, skip=skip, limit=limit)

# --- Resume Routes ---
@app.get("/api/resume/experience", response_model=List[schemas.ResumeExperience])
def read_resume_experience(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_experience(db, skip=skip, limit=limit)

@app.get("/api/resume/skills", response_model=List[schemas.ResumeSkill])
def read_resume_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_skills(db, skip=skip, limit=limit)

@app.get("/api/resume/education", response_model=List[schemas.ResumeEducation])
def read_resume_education(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_education(db, skip=skip, limit=limit)

@app.get("/api/resume/certifications", response_model=List[schemas.ResumeCertification])
def read_resume_certifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_certifications(db, skip=skip, limit=limit)
