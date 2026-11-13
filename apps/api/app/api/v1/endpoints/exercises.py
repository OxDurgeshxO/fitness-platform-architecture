from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.services.exercise_catalog import ExerciseCatalogService, ExerciseProfile

router = APIRouter(prefix="/exercises", tags=["Exercise Catalog"])


@router.get("/", response_model=List[ExerciseProfile])
async def list_exercises(
    category: Optional[str] = Query(None, description="Filter by category (strength, hypertrophy, core)")
) -> List[ExerciseProfile]:
    if category:
        return ExerciseCatalogService.list_by_category(category)
    return ExerciseCatalogService.list_all()


@router.get("/{exercise_id}", response_model=ExerciseProfile)
async def get_exercise_profile(exercise_id: str) -> ExerciseProfile:
    profile = ExerciseCatalogService.get_by_id(exercise_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise '{exercise_id}' not found in catalog",
        )
    return profile
