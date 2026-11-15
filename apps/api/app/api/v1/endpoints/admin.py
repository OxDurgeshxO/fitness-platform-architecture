from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.admin import AdminOverviewResponse, ServiceHealth, SystemMetrics

router = APIRouter(prefix="/admin", tags=["Platform & Admin"])


@router.get("/overview", response_model=AdminOverviewResponse)
async def get_admin_overview() -> AdminOverviewResponse:
    now = datetime.now(timezone.utc)

    metrics = SystemMetrics(
        total_users_registered=1420,
        active_sessions_today=215,
        total_workout_sets_logged=18490,
        total_estimated_calories_burned=142980.0,
        average_kinematic_accuracy=94.8,
    )

    services: List[ServiceHealth] = [
        ServiceHealth(
            service="MediaPipe Computer Vision",
            status="operational",
            latency_ms=12.4,
            last_checked=now,
        ),
        ServiceHealth(
            service="PostgreSQL Database Engine",
            status="operational",
            latency_ms=4.2,
            last_checked=now,
        ),
        ServiceHealth(
            service="Redis Cache & PubSub", status="operational", latency_ms=1.1, last_checked=now
        ),
        ServiceHealth(
            service="AI Master Coach Agent", status="operational", latency_ms=14.8, last_checked=now
        ),
        ServiceHealth(
            service="Anabolic Nutrition Engine",
            status="operational",
            latency_ms=6.3,
            last_checked=now,
        ),
    ]

    return AdminOverviewResponse(
        system_metrics=metrics,
        subsystem_health=services,
        platform_version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        generated_at=now,
    )
