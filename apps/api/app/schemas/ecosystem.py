from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class HeartRateStreamRequest(BaseModel):
    athlete_age: int = Field(25, ge=14, le=100)
    resting_heart_rate: int = Field(60, ge=35, le=110)
    current_heart_rate: int = Field(..., ge=40, le=240, json_schema_extra={"example": 145})
    device_name: str = Field("Apple Watch Ultra / Polar H10", max_length=100)


class HeartRateZoneAnalysis(BaseModel):
    current_bpm: int
    max_heart_rate: int
    heart_rate_reserve_pct: float
    current_zone: str  # Zone 1 (Recovery), Zone 2 (Base/Fat Burn), Zone 3 (Aerobic), Zone 4 (Threshold), Zone 5 (VO2 Max)
    zone_description: str
    target_bpm_range: str
    training_effect: str
    timestamp: datetime


class AthleteDataExportResponse(BaseModel):
    athlete_profile: Dict[str, str | int]
    session_count: int
    total_reps_completed: int
    total_calories_burned: float
    achievements_unlocked: List[str]
    compliance_standard: str
    exported_at: datetime
