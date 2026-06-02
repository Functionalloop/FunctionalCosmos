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

def update_project(db: Session, project_id: int, project: schemas.ProjectCreate):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        for key, value in project.model_dump().items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
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

def update_tech_stack(db: Session, tech_id: int, tech: schemas.TechStackCreate):
    db_tech = db.query(models.TechStack).filter(models.TechStack.id == tech_id).first()
    if db_tech:
        for key, value in tech.model_dump().items():
            setattr(db_tech, key, value)
        db.commit()
        db.refresh(db_tech)
    return db_tech

def delete_tech_stack(db: Session, tech_id: int):
    db_tech = db.query(models.TechStack).filter(models.TechStack.id == tech_id).first()
    if db_tech:
        db.delete(db_tech)
        db.commit()
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

def update_academic(db: Session, academic_id: int, academic: schemas.AcademicCreate):
    db_academic = db.query(models.Academic).filter(models.Academic.id == academic_id).first()
    if db_academic:
        for key, value in academic.model_dump().items():
            setattr(db_academic, key, value)
        db.commit()
        db.refresh(db_academic)
    return db_academic

def delete_academic(db: Session, academic_id: int):
    db_academic = db.query(models.Academic).filter(models.Academic.id == academic_id).first()
    if db_academic:
        db.delete(db_academic)
        db.commit()
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

def update_social(db: Session, social_id: int, social: schemas.SocialCreate):
    db_social = db.query(models.Social).filter(models.Social.id == social_id).first()
    if db_social:
        for key, value in social.model_dump().items():
            setattr(db_social, key, value)
        db.commit()
        db.refresh(db_social)
    return db_social

def delete_social(db: Session, social_id: int):
    db_social = db.query(models.Social).filter(models.Social.id == social_id).first()
    if db_social:
        db.delete(db_social)
        db.commit()
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

def create_resume_experience(db: Session, exp: schemas.ResumeExperienceCreate):
    db_exp = models.ResumeExperience(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

def update_resume_experience(db: Session, exp_id: int, exp: schemas.ResumeExperienceCreate):
    db_exp = db.query(models.ResumeExperience).filter(models.ResumeExperience.id == exp_id).first()
    if db_exp:
        for key, value in exp.model_dump().items():
            setattr(db_exp, key, value)
        db.commit()
        db.refresh(db_exp)
    return db_exp

def delete_resume_experience(db: Session, exp_id: int):
    db_exp = db.query(models.ResumeExperience).filter(models.ResumeExperience.id == exp_id).first()
    if db_exp:
        db.delete(db_exp)
        db.commit()
    return db_exp

def create_resume_skill(db: Session, skill: schemas.ResumeSkillCreate):
    db_skill = models.ResumeSkill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def update_resume_skill(db: Session, skill_id: int, skill: schemas.ResumeSkillCreate):
    db_skill = db.query(models.ResumeSkill).filter(models.ResumeSkill.id == skill_id).first()
    if db_skill:
        for key, value in skill.model_dump().items():
            setattr(db_skill, key, value)
        db.commit()
        db.refresh(db_skill)
    return db_skill

def delete_resume_skill(db: Session, skill_id: int):
    db_skill = db.query(models.ResumeSkill).filter(models.ResumeSkill.id == skill_id).first()
    if db_skill:
        db.delete(db_skill)
        db.commit()
    return db_skill

def create_resume_education(db: Session, edu: schemas.ResumeEducationCreate):
    db_edu = models.ResumeEducation(**edu.model_dump())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

def update_resume_education(db: Session, edu_id: int, edu: schemas.ResumeEducationCreate):
    db_edu = db.query(models.ResumeEducation).filter(models.ResumeEducation.id == edu_id).first()
    if db_edu:
        for key, value in edu.model_dump().items():
            setattr(db_edu, key, value)
        db.commit()
        db.refresh(db_edu)
    return db_edu

def delete_resume_education(db: Session, edu_id: int):
    db_edu = db.query(models.ResumeEducation).filter(models.ResumeEducation.id == edu_id).first()
    if db_edu:
        db.delete(db_edu)
        db.commit()
    return db_edu

def create_resume_certification(db: Session, cert: schemas.ResumeCertificationCreate):
    db_cert = models.ResumeCertification(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

def update_resume_certification(db: Session, cert_id: int, cert: schemas.ResumeCertificationCreate):
    db_cert = db.query(models.ResumeCertification).filter(models.ResumeCertification.id == cert_id).first()
    if db_cert:
        for key, value in cert.model_dump().items():
            setattr(db_cert, key, value)
        db.commit()
        db.refresh(db_cert)
    return db_cert

def delete_resume_certification(db: Session, cert_id: int):
    db_cert = db.query(models.ResumeCertification).filter(models.ResumeCertification.id == cert_id).first()
    if db_cert:
        db.delete(db_cert)
        db.commit()
    return db_cert

def get_visitor_count(db: Session):
    visitor = db.query(models.VisitorCount).filter(models.VisitorCount.id == 1).first()
    if not visitor:
        visitor = models.VisitorCount(id=1, count=0)
        db.add(visitor)
        db.commit()
        db.refresh(visitor)
    return visitor.count

def increment_visitor(db: Session):
    visitor = db.query(models.VisitorCount).filter(models.VisitorCount.id == 1).first()
    if not visitor:
        visitor = models.VisitorCount(id=1, count=1)
        db.add(visitor)
    else:
        visitor.count += 1
    db.commit()
    db.refresh(visitor)
    return visitor.count
