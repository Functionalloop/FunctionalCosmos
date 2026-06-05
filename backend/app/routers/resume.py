from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db
from ..dependencies import verify_admin

router = APIRouter(prefix="/api/resume", tags=["Resume"])


# ── Experience ──────────────────────────────────────────────────────────────

@router.get("/experience", response_model=List[schemas.ResumeExperience])
def read_resume_experience(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_experience(db, skip=skip, limit=limit)


@router.post("/experience", response_model=schemas.ResumeExperience, dependencies=[Depends(verify_admin)])
def create_resume_experience(experience: schemas.ResumeExperienceCreate, db: Session = Depends(get_db)):
    return crud.create_resume_experience(db=db, exp=experience)


@router.put("/experience/{exp_id}", response_model=schemas.ResumeExperience, dependencies=[Depends(verify_admin)])
def update_resume_experience(exp_id: int, experience: schemas.ResumeExperienceCreate, db: Session = Depends(get_db)):
    db_exp = crud.update_resume_experience(db, exp_id=exp_id, exp=experience)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp


@router.delete("/experience/{exp_id}", dependencies=[Depends(verify_admin)])
def delete_resume_experience(exp_id: int, db: Session = Depends(get_db)):
    db_exp = crud.delete_resume_experience(db, exp_id=exp_id)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}


# ── Skills ──────────────────────────────────────────────────────────────────

@router.get("/skills", response_model=List[schemas.ResumeSkill])
def read_resume_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_skills(db, skip=skip, limit=limit)


@router.post("/skills", response_model=schemas.ResumeSkill, dependencies=[Depends(verify_admin)])
def create_resume_skill(skill: schemas.ResumeSkillCreate, db: Session = Depends(get_db)):
    return crud.create_resume_skill(db=db, skill=skill)


@router.put("/skills/{skill_id}", response_model=schemas.ResumeSkill, dependencies=[Depends(verify_admin)])
def update_resume_skill(skill_id: int, skill: schemas.ResumeSkillCreate, db: Session = Depends(get_db)):
    db_skill = crud.update_resume_skill(db, skill_id=skill_id, skill=skill)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill


@router.delete("/skills/{skill_id}", dependencies=[Depends(verify_admin)])
def delete_resume_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = crud.delete_resume_skill(db, skill_id=skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}


# ── Education ────────────────────────────────────────────────────────────────

@router.get("/education", response_model=List[schemas.ResumeEducation])
def read_resume_education(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_education(db, skip=skip, limit=limit)


@router.post("/education", response_model=schemas.ResumeEducation, dependencies=[Depends(verify_admin)])
def create_resume_education(education: schemas.ResumeEducationCreate, db: Session = Depends(get_db)):
    return crud.create_resume_education(db=db, edu=education)


@router.put("/education/{edu_id}", response_model=schemas.ResumeEducation, dependencies=[Depends(verify_admin)])
def update_resume_education(edu_id: int, education: schemas.ResumeEducationCreate, db: Session = Depends(get_db)):
    db_edu = crud.update_resume_education(db, edu_id=edu_id, edu=education)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu


@router.delete("/education/{edu_id}", dependencies=[Depends(verify_admin)])
def delete_resume_education(edu_id: int, db: Session = Depends(get_db)):
    db_edu = crud.delete_resume_education(db, edu_id=edu_id)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted successfully"}


# ── Certifications ───────────────────────────────────────────────────────────

@router.get("/certifications", response_model=List[schemas.ResumeCertification])
def read_resume_certifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_resume_certifications(db, skip=skip, limit=limit)


@router.post("/certifications", response_model=schemas.ResumeCertification, dependencies=[Depends(verify_admin)])
def create_resume_certification(certification: schemas.ResumeCertificationCreate, db: Session = Depends(get_db)):
    return crud.create_resume_certification(db=db, cert=certification)


@router.put("/certifications/{cert_id}", response_model=schemas.ResumeCertification, dependencies=[Depends(verify_admin)])
def update_resume_certification(cert_id: int, certification: schemas.ResumeCertificationCreate, db: Session = Depends(get_db)):
    db_cert = crud.update_resume_certification(db, cert_id=cert_id, cert=certification)
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return db_cert


@router.delete("/certifications/{cert_id}", dependencies=[Depends(verify_admin)])
def delete_resume_certification(cert_id: int, db: Session = Depends(get_db)):
    db_cert = crud.delete_resume_certification(db, cert_id=cert_id)
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Certification deleted successfully"}
