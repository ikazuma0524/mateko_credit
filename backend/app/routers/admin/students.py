from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
import logging

from ... import models
from ...database import SessionLocal
from ...schemas.student import Student, StudentCreate
from ...firebase_auth import auth_required, security  # Firebase 認証用（オプション）
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/students",
    tags=["students"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# すべての学生を取得するエンドポイント
@router.get("/", response_model=List[Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        students = db.query(models.Student).offset(skip).limit(limit).all()
        return students
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 特定の学生を ID で取得するエンドポイント


# 学生データを作成するエンドポイント
@router.post("/", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    try:
        # Firebase側ではフロントエンドで既にユーザーが作成されている前提
        # 受け取ったFirebaseのUIDをデータベースに保存
        db_student = models.Student(
           uid= student.uid,  # FirebaseのUIDを使用
            name=student.name,
            course=student.course,
            email=student.email
        )

        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        logger.info(f"Created student: {db_student.__dict__}")
        return db_student
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Error in create_student: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



# 学生データを更新するエンドポイント
@router.put("/{student_id}", response_model=Student)
def update_student(student_id: str, student: StudentCreate, db: Session = Depends(get_db)):
    try:
        db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
        if db_student is None:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student_data = student.model_dump(exclude_unset=True)
        for key, value in student_data.items():
            setattr(db_student, key, value)
        
        db.commit()
        db.refresh(db_student)
        return db_student
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update student")

# 学生データを削除するエンドポイント
@router.delete("/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    try:
        db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
        if db_student is None:
            raise HTTPException(status_code=404, detail="Student not found")
        db.delete(db_student)
        db.commit()
        return {"detail": "Student deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete student")

# 特定の学生を UID で取得するエンドポイント
@router.get("/by-uid/{uid}", response_model=Student)
def get_student_by_uid(uid: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.uid == uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

# 特定の学生を ID で取得するエンドポイント（IDと区別するために異なるパス）
@router.get("/{student_id}", response_model=Student)
def get_student_by_id(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
