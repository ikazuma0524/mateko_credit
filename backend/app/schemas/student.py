from pydantic import BaseModel, Field, ConfigDict
from typing import List

class SubjectBase(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    course: str = Field(..., pattern="^[ABC]$")


    
class Student(StudentBase):
    id: int
    email: str  # 追加して、返す際に利用する場合
    completed_subjects: List[SubjectBase]

    model_config = ConfigDict(from_attributes=True)



class StudentCreate(BaseModel):
    name: str
    email: str
    course: str
    uid: str  # ここに uid を追加
    completed_subjects: List[int] = Field(default=[], description="List of completed subject IDs")
