from typing import List, Optional

from pydantic import BaseModel, Field


class CoachMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class CoachQueryRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=2,
        max_length=1000,
        json_schema_extra={"example": "How do I fix knee pain during squats?"},
    )
    athlete_context: Optional[dict] = None
    prompt_version: str = "v1.0.0"


class CoachQueryResponse(BaseModel):
    reply: str
    intent: str  # exercise_guidance, form_correction, nutrition_advice, recovery
    confidence_score: float
    actionable_cues: List[str]
    safety_disclaimer: Optional[str]
    suggested_exercises: List[str]
    prompt_version: str
