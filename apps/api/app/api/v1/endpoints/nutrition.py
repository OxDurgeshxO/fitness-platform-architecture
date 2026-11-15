from fastapi import APIRouter

from app.schemas.nutrition import NutritionPlanRequest, NutritionPlanResponse
from app.services.nutrition_service import NutritionService

router = APIRouter(prefix="/nutrition", tags=["AI Nutritionist"])


@router.post("/calculate-plan", response_model=NutritionPlanResponse)
async def generate_nutrition_plan(request: NutritionPlanRequest) -> NutritionPlanResponse:
    """Calculates BMR, TDEE, macro distribution, and generated meal plan tailored to athlete goals."""
    return NutritionService.calculate_plan(request)
