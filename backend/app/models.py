from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

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

class SubjectCategoryEnum(PyEnum):
    COMPULSORY = "Compulsory"  # 必修科目
    LIMITED_ELECTIVE = "Limited Elective"  #限定選択
    STANDARD_ELECTIVE = "Standard Elective"  # 標準選択
    ELECTIVE ='Elective'  #選択科目

# コースごとの科目のカテゴリを保存する中間テーブル
class SubjectCategory(Base):
    __tablename__ = "subject_category"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String, nullable=False)  # コース名 (A, B, C)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    category = Column(Enum(SubjectCategoryEnum), nullable=False)  
    subject = relationship("Subject", back_populates="categories")
    
class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    # 科目カテゴリのリレーション
    categories = relationship("SubjectCategory", back_populates="subject")

    # リレーションシップの定義
    students = relationship("Student", secondary=student_subject, back_populates="completed_subjects")