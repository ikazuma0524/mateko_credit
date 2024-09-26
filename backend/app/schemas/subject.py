from pydantic import BaseModel
from typing import List
from enum import Enum

class SubjectCategoryEnum(str, Enum):
    COMPULSORY = "COMPULSORY"
    LIMITED_ELECTIVE = "LIMITED_ELECTIVE"
    STANDARD_ELECTIVE = "STANDARD_ELECTIVE"
    ELECTIVE = "ELECTIVE"

class SubjectCategoryBase(BaseModel):
    course: str
    category: SubjectCategoryEnum

class SubjectCategoryCreate(SubjectCategoryBase):
    pass

class SubjectCategory(SubjectCategoryBase):
    id: int
    subject_id: int

    class Config:
        orm_mode = True

class SubjectBase(BaseModel):
    name: str
    credit: int

class SubjectCreate(SubjectBase):
    categories: List[SubjectCategoryCreate]

class SubjectUpdate(SubjectBase):
    categories: List[SubjectCategoryCreate]

class Subject(SubjectBase):
    id: int
    categories: List[SubjectCategory]

    class Config:
        orm_mode = True