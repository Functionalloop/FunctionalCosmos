from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db
from ..dependencies import verify_admin

router = APIRouter(prefix="/api/socials", tags=["Socials"])


@router.get("/", response_model=List[schemas.Social])
def read_socials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_socials(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.Social, dependencies=[Depends(verify_admin)])
def create_social(social: schemas.SocialCreate, db: Session = Depends(get_db)):
    return crud.create_social(db=db, social=social)


@router.put("/{social_id}", response_model=schemas.Social, dependencies=[Depends(verify_admin)])
def update_social(social_id: int, social: schemas.SocialCreate, db: Session = Depends(get_db)):
    db_social = crud.update_social(db, social_id=social_id, social=social)
    if not db_social:
        raise HTTPException(status_code=404, detail="Social not found")
    return db_social


@router.delete("/{social_id}", dependencies=[Depends(verify_admin)])
def delete_social(social_id: int, db: Session = Depends(get_db)):
    db_social = crud.delete_social(db, social_id=social_id)
    if not db_social:
        raise HTTPException(status_code=404, detail="Social not found")
    return {"message": "Social deleted successfully"}
