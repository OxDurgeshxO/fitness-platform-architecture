from fastapi import APIRouter

from app.schemas.workout import PoseAnalysisRequest, PoseAnalysisResponse
from app.services.pose_service import PoseAnalysisService

router = APIRouter(prefix="/pose", tags=["Pose Analysis"])
service = PoseAnalysisService()


@router.post("/analyze-frame", response_model=PoseAnalysisResponse)
async def analyze_pose_frame(payload: PoseAnalysisRequest) -> PoseAnalysisResponse:
    """Real-time biomechanical analysis and rep counting for exercise frames."""
    return service.process_frame(payload)
