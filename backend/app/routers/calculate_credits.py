from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter(
    tags=["calculate_credits"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/calculate_credits")
def calculate_credits(student_info: Dict[str, int], db: Session = Depends(get_db)):
    student_id = student_info.get("student_id")
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = student.course
    completed_subjects = student.completed_subjects

    credits = {
        "compulsory": 0,
        "limited_elective": 0,
        "standard_elective": 0,
        "elective": 0,
        "total": 0
    }

    details = {
        "compulsory_subjects": [],
        "limited_elective_subjects": [],
        "standard_elective_subjects": [],
        "elective_subjects": []
    }

    for subject_id in completed_subjects:
        subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
        if not subject:
            continue  # 科目が存在しない場合はスキップ
        category = subject.course_categories.get(course)
        if category == "必修科目":
            credits["compulsory"] += subject.credit
            details["compulsory_subjects"].append(subject_id)
        elif category == "限定選択科目":
            credits["limited_elective"] += subject.credit
            details["limited_elective_subjects"].append(subject_id)
        elif category == "標準選択科目":
            credits["standard_elective"] += subject.credit
            details["standard_elective_subjects"].append(subject_id)
        else:
            credits["elective"] += subject.credit
            details["elective_subjects"].append(subject_id)
        credits["total"] += subject.credit

    # 要件のチェック
    requirements = schemas.credit_requirement.CreditRequirement()
    requirements_met = {
        "compulsory": credits["compulsory"] >= requirements.required_compulsory,
        "limited_elective": credits["limited_elective"] >= requirements.required_limited_elective,
        "limited_standard_elective": (credits["limited_elective"] + credits["standard_elective"]) >= requirements.required_limited_standard_elective,
        "total": credits["total"] >= requirements.required_total
    }

    return {
        "student_id": student_id,
        "course": course,
        "credits": credits,
        "requirements_met": requirements_met,
        "details": details
    }
