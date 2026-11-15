from fastapi import APIRouter

from app.schemas.ecosystem import (
    AthleteDataExportResponse,
    HeartRateStreamRequest,
    HeartRateZoneAnalysis,
)
from app.services.ecosystem_service import EcosystemService

router = APIRouter(prefix="/ecosystem", tags=["Ecosystem & Wearables"])


@router.post("/heart-rate", response_model=HeartRateZoneAnalysis)
async def analyze_heart_rate(request: HeartRateStreamRequest) -> HeartRateZoneAnalysis:
    """Analyze real-time heart rate stream using Tanaka and Karvonen formulas into 5 metabolic zones."""
    return EcosystemService.analyze_heart_rate(request)


@router.get("/export-data", response_model=AthleteDataExportResponse)
async def export_athlete_data() -> AthleteDataExportResponse:
    """Export complete athlete fitness telemetry complying with GDPR Art. 20 and HIPAA standards."""
    return EcosystemService.export_athlete_data()
