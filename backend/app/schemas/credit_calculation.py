from pydantic import BaseModel
from typing import List ,Dict
class CreditRequirement(BaseModel):
    required_compulsory: int = 26
    required_limited_elective: int = 47
    required_limited_standard_elective: int = 59
    required_total: int = 95


class Credits(BaseModel):
    compulsory: int
    limited_elective: int
    standard_elective: int
    elective: int
    total: int

class CreditDetails(BaseModel):
    compulsory_subjects: List[str]
    limited_elective_subjects: List[str]
    standard_elective_subjects: List[str]
    elective_subjects: List[str]

class RequirementsMet(BaseModel):
    compulsory: bool
    limited_elective: bool
    limited_standard_elective: bool
    total: bool

class CreditCalculation(BaseModel):
    student_id: str
    course: str
    credits: Credits
    requirements_met: RequirementsMet
    details: CreditDetails