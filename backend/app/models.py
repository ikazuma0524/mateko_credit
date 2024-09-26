from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLAlchemyEnum,Table
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum as PyEnum


# 中間テーブルの定義（学生と科目の多対多リレーションシップ）
student_subject = Table('student_subject', Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('subject_id', Integer, ForeignKey('subjects.id'))
)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    course = Column(String)
    email = Column(String, unique=True, index=True)
    uid = Column(String, unique=True, index=True)  # FirebaseのUIDを保存

    # リレーションシップの定義
    completed_subjects = relationship("Subject", secondary=student_subject, back_populates="students")



# Enumの定義
class SubjectCategoryEnum(PyEnum):
    COMPULSORY = "COMPULSORY"
    LIMITED_ELECTIVE = "LIMITED_ELECTIVE"
    STANDARD_ELECTIVE = "STANDARD_ELECTIVE"
    ELECTIVE = "ELECTIVE"
class SubjectCategory(Base):
    __tablename__ = "subject_category"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String, nullable=False)  # コース名 (A, B, C)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    category = Column(SQLAlchemyEnum(SubjectCategoryEnum), nullable=False)
    subject = relationship("Subject", back_populates="categories")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    credit = Column(Integer)

    # 科目カテゴリのリレーション
    categories = relationship("SubjectCategory", back_populates="subject")

    # リレーションシップの定義
    students = relationship("Student", secondary="student_subject", back_populates="completed_subjects")
