from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db
from ..dependencies import verify_admin

router = APIRouter(prefix="/api/tech-stack", tags=["Tech Stack"])


@router.get("/", response_model=List[schemas.TechStack])
def read_tech_stack(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tech_stacks(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.TechStack, dependencies=[Depends(verify_admin)])
def create_tech_stack(tech_stack: schemas.TechStackCreate, db: Session = Depends(get_db)):
    return crud.create_tech_stack(db=db, tech_stack=tech_stack)


@router.put("/{tech_id}", response_model=schemas.TechStack, dependencies=[Depends(verify_admin)])
def update_tech_stack(tech_id: int, tech_stack: schemas.TechStackCreate, db: Session = Depends(get_db)):
    db_tech = crud.update_tech_stack(db, tech_id=tech_id, tech=tech_stack)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack not found")
    return db_tech


@router.delete("/{tech_id}", dependencies=[Depends(verify_admin)])
def delete_tech_stack(tech_id: int, db: Session = Depends(get_db)):
    db_tech = crud.delete_tech_stack(db, tech_id=tech_id)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Tech stack not found")
    return {"message": "Tech stack deleted successfully"}
