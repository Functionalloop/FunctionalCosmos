from sqlalchemy.orm import Session
from . import models, schemas

# --- Project CRUD ---
def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def get_project_by_slug(db: Session, slug: str):
    return db.query(models.Project).filter(models.Project.slug == slug).first()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# --- TechStack CRUD ---
def get_tech_stacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TechStack).offset(skip).limit(limit).all()

def create_tech_stack(db: Session, tech_stack: schemas.TechStackCreate):
    db_tech = models.TechStack(**tech_stack.model_dump())
    db.add(db_tech)
    db.commit()
    db.refresh(db_tech)
    return db_tech

# --- Academic CRUD ---
def get_academics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Academic).offset(skip).limit(limit).all()

def create_academic(db: Session, academic: schemas.AcademicCreate):
    db_academic = models.Academic(**academic.model_dump())
    db.add(db_academic)
    db.commit()
    db.refresh(db_academic)
    return db_academic

# --- Social CRUD ---
def get_socials(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Social).offset(skip).limit(limit).all()

def create_social(db: Session, social: schemas.SocialCreate):
    db_social = models.Social(**social.model_dump())
    db.add(db_social)
    db.commit()
    db.refresh(db_social)
    return db_social

# --- Resume CRUD ---
def get_resume_experience(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ResumeExperience).order_by(models.ResumeExperience.order).offset(skip).limit(limit).all()

def get_resume_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ResumeSkill).offset(skip).limit(limit).all()

def get_resume_education(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ResumeEducation).order_by(models.ResumeEducation.order).offset(skip).limit(limit).all()

def get_resume_certifications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ResumeCertification).order_by(models.ResumeCertification.order).offset(skip).limit(limit).all()
