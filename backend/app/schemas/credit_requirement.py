from pydantic import BaseModel

class CreditRequirement(BaseModel):
    required_compulsory: int = 26
    required_limited_elective: int = 47
    required_limited_standard_elective: int = 59
    required_total: int = 95
