from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud
from ..database import get_db

router = APIRouter(prefix="/api/visitors", tags=["Visitors"])


@router.get("/")
def read_visitors(db: Session = Depends(get_db)):
    count = crud.get_visitor_count(db)
    return {"count": count}


@router.post("/ping")
def ping_visitor(db: Session = Depends(get_db)):
    count = crud.increment_visitor(db)
    return {"count": count}
