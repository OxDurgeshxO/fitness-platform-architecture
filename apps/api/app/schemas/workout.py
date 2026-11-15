import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ExerciseLogBase(BaseModel):
    exercise_type: str = Field(..., json_schema_extra={"example": "squat"})
    reps: int = Field(0, ge=0)
    form_accuracy: float = Field(1.0, ge=0.0, le=1.0)
    feedback_notes: Optional[str] = None
    raw_landmarks: Optional[Dict[str, Any]] = None


class ExerciseLogCreate(ExerciseLogBase):
    pass


class ExerciseLogRead(ExerciseLogBase):
    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WorkoutSessionBase(BaseModel):
    title: str = Field(
        ..., min_length=2, max_length=255, json_schema_extra={"example": "Morning Leg Routine"}
    )
    status: str = Field("in_progress", pattern="^(in_progress|completed|paused)$")


class WorkoutSessionCreate(WorkoutSessionBase):
    pass


class WorkoutSessionUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    total_reps: Optional[int] = None
    calories_burned: Optional[float] = None
    duration_seconds: Optional[int] = None


class WorkoutSessionRead(WorkoutSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    total_reps: int
    calories_burned: float
    duration_seconds: int
    created_at: datetime
    updated_at: datetime
    exercise_logs: List[ExerciseLogRead] = []

    model_config = ConfigDict(from_attributes=True)


class PoseLandmark(BaseModel):
    x: float
    y: float
    z: float
    visibility: float = 1.0


class PoseAnalysisRequest(BaseModel):
    exercise_type: str = Field(..., json_schema_extra={"example": "squat"})
    landmarks: List[PoseLandmark]
    current_reps: int = 0


class PoseAnalysisResponse(BaseModel):
    exercise_type: str
    reps_counted: int
    rep_completed: bool
    current_angle: float
    form_accuracy: float
    feedback: str
    stage: str  # "up", "down", "transition"
    symmetry_score: float = 1.0  # 0.0 to 1.0 ratio between left and right limb kinematics
    bilateral_balance: str = "balanced"  # balanced, left_shifted, right_shifted
    active_joint: str = "knee"


class QuickWorkoutLogRequest(BaseModel):
    exercise_type: str = Field(..., json_schema_extra={"example": "squat"})
    reps: int = Field(..., ge=1, json_schema_extra={"example": 15})
    form_accuracy: float = Field(1.0, ge=0.0, le=1.0)
    duration_seconds: int = Field(60, ge=5)
    athlete_weight_kg: float = Field(75.0, gt=30.0)


class QuickWorkoutLogResponse(BaseModel):
    id: uuid.UUID
    exercise_type: str
    reps: int
    form_accuracy: float
    duration_seconds: int
    estimated_calories_burned: float
    intensity_rating: str  # Light, Moderate, High, Peak
    anabolic_strain_index: float
    feedback: str
    recorded_at: datetime
