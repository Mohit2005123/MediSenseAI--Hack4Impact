from pydantic import BaseModel, Field, constr
from typing import List, Optional, Any

class MedicineItem(BaseModel):
    name: constr(strip_whitespace=True, min_length=1)
    dosage: Optional[str] = Field(None)
    frequency: Optional[str] = Field(None)
    duration: Optional[str] = Field(None)
    instructions: Optional[str] = Field(None)

class PrescriptionSummary(BaseModel):
    patient_name: Optional[str] = None
    diagnosis_or_complaints: Optional[str] = None
    medicines: List[MedicineItem] = Field(default_factory=list)
    tests_or_followup: Optional[str] = None
    red_flags: Optional[str] = None
    generic_advice: Optional[str] = None
    disclaimer: str

class SummarizeRequest(BaseModel):
    text: constr(strip_whitespace=True, min_length=5)
    locale: str = Field(default="en-IN")

class SummarizeResponse(BaseModel):
    summary: PrescriptionSummary

class AnswerQueryRequest(BaseModel):
    query: constr(strip_whitespace=True, min_length=3)
    locale: str = Field(default="en-IN")
    # NEW: a JSON object containing the prescription summary you previously generated
    prescription_summary: Optional[dict[str, Any]] = None

class AnswerQueryResponse(BaseModel):
    answer: str
    safety: dict
    sources: list[str] = []
