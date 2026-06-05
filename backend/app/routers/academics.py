from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db
from ..dependencies import verify_admin

router = APIRouter(prefix="/api/academics", tags=["Academics"])


@router.get("/", response_model=List[schemas.Academic])
def read_academics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_academics(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Academic, dependencies=[Depends(verify_admin)])
def create_academic(academic: schemas.AcademicCreate, db: Session = Depends(get_db)):
    return crud.create_academic(db=db, academic=academic)


@router.put("/{academic_id}", response_model=schemas.Academic, dependencies=[Depends(verify_admin)])
def update_academic(academic_id: int, academic: schemas.AcademicCreate, db: Session = Depends(get_db)):
    db_academic = crud.update_academic(db, academic_id=academic_id, academic=academic)
    if not db_academic:
        raise HTTPException(status_code=404, detail="Academic not found")
    return db_academic


@router.delete("/{academic_id}", dependencies=[Depends(verify_admin)])
def delete_academic(academic_id: int, db: Session = Depends(get_db)):
    db_academic = crud.delete_academic(db, academic_id=academic_id)
    if not db_academic:
        raise HTTPException(status_code=404, detail="Academic not found")
    return {"message": "Academic deleted successfully"}
