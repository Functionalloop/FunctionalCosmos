from fastapi import FastAPI, Depends, HTTPException, Header
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

def verify_admin(x_admin_password: str = Header(None)):
    if x_admin_password != "tinyshreya101":
        raise HTTPException(status_code=401, detail="Invalid admin password")

# --- Health check ---
@app.get("/health", status_code=200)
def health_check():
    return {"status": "healthy"}

# --- Visitors Routes ---
@app.get("/api/visitors")
def read_visitors(db: Session = Depends(get_db)):
    count = crud.get_visitor_count(db)
    return {"count": count}

@app.post("/api/visitors/ping")
def ping_visitor(db: Session = Depends(get_db)):
    count = crud.increment_visitor(db)
    return {"count": count}

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

@app.post("/api/projects", response_model=schemas.Project, dependencies=[Depends(verify_admin)])
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.put("/api/projects/{project_id}", response_model=schemas.Project, dependencies=[Depends(verify_admin)])
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id=project_id, project=project)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.delete("/api/projects/{project_id}", dependencies=[Depends(verify_admin)])
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.delete_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# --- Tech Stack Routes ---
@app.get("/api/tech-stack", response_model=List[schemas.TechStack])
def read_tech_stack(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tech_stacks(db, skip=skip, limit=limit)

@app.post("/api/tech-stack", response_model=schemas.TechStack, dependencies=[Depends(verify_admin)])
def create_tech_stack(tech_stack: schemas.TechStackCreate, db: Session = Depends(get_db)):
    return crud.create_tech_stack(db=db, tech_stack=tech_stack)

@app.put("/api/tech-stack/{tech_id}", response_model=schemas.TechStack, dependencies=[Depends(verify_admin)])
def update_tech_stack(tech_id: int, tech_stack: schemas.TechStackCreate, db: Session = Depends(get_db)):
    db_tech = crud.update_tech_stack(db, tech_id=tech_id, tech=tech_stack)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack not found")
    return db_tech

@app.delete("/api/tech-stack/{tech_id}", dependencies=[Depends(verify_admin)])
def delete_tech_stack(tech_id: int, db: Session = Depends(get_db)):
    db_tech = crud.delete_tech_stack(db, tech_id=tech_id)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack not found")
    return {"message": "Tech stack deleted successfully"}

# --- Academics Routes ---
@app.get("/api/academics", response_model=List[schemas.Academic])
def read_academics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_academics(db, skip=skip, limit=limit)

@app.post("/api/academics", response_model=schemas.Academic, dependencies=[Depends(verify_admin)])
def create_academic(academic: schemas.AcademicCreate, db: Session = Depends(get_db)):
    return crud.create_academic(db=db, academic=academic)

@app.put("/api/academics/{academic_id}", response_model=schemas.Academic, dependencies=[Depends(verify_admin)])
def update_academic(academic_id: int, academic: schemas.AcademicCreate, db: Session = Depends(get_db)):
    db_academic = crud.update_academic(db, academic_id=academic_id, academic=academic)
    if not db_academic:
        raise HTTPException(status_code=404, detail="Academic not found")
    return db_academic

@app.delete("/api/academics/{academic_id}", dependencies=[Depends(verify_admin)])
def delete_academic(academic_id: int, db: Session = Depends(get_db)):
    db_academic = crud.delete_academic(db, academic_id=academic_id)
    if not db_academic:
        raise HTTPException(status_code=404, detail="Academic not found")
    return {"message": "Academic deleted successfully"}

# --- Socials Routes ---
@app.get("/api/socials", response_model=List[schemas.Social])
def read_socials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_socials(db, skip=skip, limit=limit)

@app.post("/api/socials", response_model=schemas.Social, dependencies=[Depends(verify_admin)])
def create_social(social: schemas.SocialCreate, db: Session = Depends(get_db)):
    return crud.create_social(db=db, social=social)

@app.put("/api/socials/{social_id}", response_model=schemas.Social, dependencies=[Depends(verify_admin)])
def update_social(social_id: int, social: schemas.SocialCreate, db: Session = Depends(get_db)):
    db_social = crud.update_social(db, social_id=social_id, social=social)
    if not db_social:
        raise HTTPException(status_code=404, detail="Social not found")
    return db_social

@app.delete("/api/socials/{social_id}", dependencies=[Depends(verify_admin)])
def delete_social(social_id: int, db: Session = Depends(get_db)):
    db_social = crud.delete_social(db, social_id=social_id)
    if not db_social:
        raise HTTPException(status_code=404, detail="Social not found")
    return {"message": "Social deleted successfully"}

# --- Resume Routes ---
@app.get("/api/resume/experience", response_model=List[schemas.ResumeExperience])
def read_resume_experience(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_experience(db, skip=skip, limit=limit)

@app.post("/api/resume/experience", response_model=schemas.ResumeExperience, dependencies=[Depends(verify_admin)])
def create_resume_experience(experience: schemas.ResumeExperienceCreate, db: Session = Depends(get_db)):
    return crud.create_resume_experience(db=db, exp=experience)

@app.put("/api/resume/experience/{exp_id}", response_model=schemas.ResumeExperience, dependencies=[Depends(verify_admin)])
def update_resume_experience(exp_id: int, experience: schemas.ResumeExperienceCreate, db: Session = Depends(get_db)):
    db_exp = crud.update_resume_experience(db, exp_id=exp_id, exp=experience)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp

@app.delete("/api/resume/experience/{exp_id}", dependencies=[Depends(verify_admin)])
def delete_resume_experience(exp_id: int, db: Session = Depends(get_db)):
    db_exp = crud.delete_resume_experience(db, exp_id=exp_id)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}

@app.get("/api/resume/skills", response_model=List[schemas.ResumeSkill])
def read_resume_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_skills(db, skip=skip, limit=limit)

@app.post("/api/resume/skills", response_model=schemas.ResumeSkill, dependencies=[Depends(verify_admin)])
def create_resume_skill(skill: schemas.ResumeSkillCreate, db: Session = Depends(get_db)):
    return crud.create_resume_skill(db=db, skill=skill)

@app.put("/api/resume/skills/{skill_id}", response_model=schemas.ResumeSkill, dependencies=[Depends(verify_admin)])
def update_resume_skill(skill_id: int, skill: schemas.ResumeSkillCreate, db: Session = Depends(get_db)):
    db_skill = crud.update_resume_skill(db, skill_id=skill_id, skill=skill)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@app.delete("/api/resume/skills/{skill_id}", dependencies=[Depends(verify_admin)])
def delete_resume_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = crud.delete_resume_skill(db, skill_id=skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}

@app.get("/api/resume/education", response_model=List[schemas.ResumeEducation])
def read_resume_education(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_education(db, skip=skip, limit=limit)

@app.post("/api/resume/education", response_model=schemas.ResumeEducation, dependencies=[Depends(verify_admin)])
def create_resume_education(education: schemas.ResumeEducationCreate, db: Session = Depends(get_db)):
    return crud.create_resume_education(db=db, edu=education)

@app.put("/api/resume/education/{edu_id}", response_model=schemas.ResumeEducation, dependencies=[Depends(verify_admin)])
def update_resume_education(edu_id: int, education: schemas.ResumeEducationCreate, db: Session = Depends(get_db)):
    db_edu = crud.update_resume_education(db, edu_id=edu_id, edu=education)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu

@app.delete("/api/resume/education/{edu_id}", dependencies=[Depends(verify_admin)])
def delete_resume_education(edu_id: int, db: Session = Depends(get_db)):
    db_edu = crud.delete_resume_education(db, edu_id=edu_id)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted successfully"}

@app.get("/api/resume/certifications", response_model=List[schemas.ResumeCertification])
def read_resume_certifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_certifications(db, skip=skip, limit=limit)

@app.post("/api/resume/certifications", response_model=schemas.ResumeCertification, dependencies=[Depends(verify_admin)])
def create_resume_certification(certification: schemas.ResumeCertificationCreate, db: Session = Depends(get_db)):
    return crud.create_resume_certification(db=db, cert=certification)

@app.put("/api/resume/certifications/{cert_id}", response_model=schemas.ResumeCertification, dependencies=[Depends(verify_admin)])
def update_resume_certification(cert_id: int, certification: schemas.ResumeCertificationCreate, db: Session = Depends(get_db)):
    db_cert = crud.update_resume_certification(db, cert_id=cert_id, cert=certification)
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return db_cert

@app.delete("/api/resume/certifications/{cert_id}", dependencies=[Depends(verify_admin)])
def delete_resume_certification(cert_id: int, db: Session = Depends(get_db)):
    db_cert = crud.delete_resume_certification(db, cert_id=cert_id)
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Certification deleted successfully"}
