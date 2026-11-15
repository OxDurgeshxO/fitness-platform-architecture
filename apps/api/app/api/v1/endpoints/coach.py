from fastapi import APIRouter
from app.schemas.coach import CoachQueryRequest, CoachQueryResponse
from app.services.coach_service import CoachService

router = APIRouter(prefix="/coach", tags=["AI Coach"])


@router.post("/chat", response_model=CoachQueryResponse)
async def query_coach(request: CoachQueryRequest) -> CoachQueryResponse:
    """Interacts with the AI Gym Master Coach for biomechanical form correction, exercise guidance, and sports nutrition advice."""
    return CoachService.generate_coaching_response(request)
