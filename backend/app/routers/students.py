from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
import logging

from .. import models
from ..database import SessionLocal
from ..schemas.student import Student, StudentCreate

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

@router.get("/", response_model=List[Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        students = db.query(models.Student).offset(skip).limit(limit).all()
        return students
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Student)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received student data: {student.model_dump()}")
        db_student = models.Student(
            name=student.name,
            course=student.course
        )
        # completed_subjectsの処理
        for subject_id in student.completed_subjects:
            subject = db.query(models.Subject).get(subject_id)
            if subject:
                db_student.completed_subjects.append(subject)
            else:
                logger.warning(f"Subject with id {subject_id} not found")
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        logger.info(f"Created student: {db_student.__dict__}")
        return db_student
    except Exception as e:
        db.rollback()
        logger.error(f"Error in create_student: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.put("/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
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

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
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

