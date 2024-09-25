from pydantic import BaseModel
from typing import Dict

class SubjectBase(BaseModel):
    name: str
    credit: int
    course_categories: Dict[str, str]

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int

    class Config:
        orm_mode = True