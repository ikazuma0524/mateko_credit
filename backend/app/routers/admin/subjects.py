from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models
from ...database import SessionLocal
from ...schemas.subject import Subject, SubjectCreate, SubjectUpdate

router = APIRouter(
    prefix="/subjects",
    tags=["subjects"]
)

# データベースセッションの取得関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 科目の一覧取得エンドポイント
@router.get("/", response_model=List[Subject])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subjects = db.query(models.Subject).offset(skip).limit(limit).all()
    return subjects

# 科目の作成エンドポイント
@router.post("/", response_model=Subject)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = models.Subject(name=subject.name, credit=subject.credit)
    db.add(db_subject)
    db.flush()  # to get the id of the newly created subject

    for category in subject.categories:
        db_category = models.SubjectCategory(
            course=category.course,
            category=category.category,
            subject_id=db_subject.id
        )
        db.add(db_category)

    db.commit()
    db.refresh(db_subject)
    return db_subject

# 科目の更新エンドポイント
@router.put("/{subject_id}", response_model=Subject)
def update_subject(subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if db_subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Update basic fields
    db_subject.name = subject.name
    db_subject.credit = subject.credit

    # Update categories
    # First, remove all existing categories
    db.query(models.SubjectCategory).filter(models.SubjectCategory.subject_id == subject_id).delete()

    # Then, add new categories
    for category in subject.categories:
        db_category = models.SubjectCategory(
            course=category.course,
            category=category.category,
            subject_id=subject_id
        )
        db.add(db_category)

    db.commit()
    db.refresh(db_subject)
    return db_subject

# 科目の削除エンドポイント
@router.delete("/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if db_subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Delete associated categories
    db.query(models.SubjectCategory).filter(models.SubjectCategory.subject_id == subject_id).delete()

    # Delete the subject
    db.delete(db_subject)
    db.commit()
    return {"detail": "Subject deleted successfully"}

# 特定の科目を取得するエンドポイント
@router.get("/{subject_id}", response_model=Subject)
def read_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if db_subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject