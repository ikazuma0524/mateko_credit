from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

# 中間テーブルの定義
student_subject = Table('student_subject', Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('subject_id', Integer, ForeignKey('subjects.id'))
)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    course = Column(String)
    
    # リレーションシップの定義
    completed_subjects = relationship("Subject", secondary=student_subject, back_populates="students")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    # リレーションシップの定義
    students = relationship("Student", secondary=student_subject, back_populates="completed_subjects")