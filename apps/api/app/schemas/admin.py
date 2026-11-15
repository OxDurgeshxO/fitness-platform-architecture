from datetime import datetime
from typing import List

from pydantic import BaseModel


class SystemMetrics(BaseModel):
    total_users_registered: int
    active_sessions_today: int
    total_workout_sets_logged: int
    total_estimated_calories_burned: float
    average_kinematic_accuracy: float


class ServiceHealth(BaseModel):
    service: str
    status: str
    latency_ms: float
    last_checked: datetime


class AdminOverviewResponse(BaseModel):
    system_metrics: SystemMetrics
    subsystem_health: List[ServiceHealth]
    platform_version: str
    environment: str
    generated_at: datetime
