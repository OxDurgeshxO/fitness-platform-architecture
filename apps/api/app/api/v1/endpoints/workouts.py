import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.dependencies import get_current_active_user
from app.core.database import get_db
from app.models.user import User
from app.models.workout import ExerciseLog, WorkoutSession
from app.repositories.workout_repository import WorkoutRepository
from app.schemas.workout import (
    ExerciseLogCreate,
    ExerciseLogRead,
    QuickWorkoutLogRequest,
    QuickWorkoutLogResponse,
    WorkoutSessionCreate,
    WorkoutSessionRead,
)

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/", response_model=WorkoutSessionRead, status_code=status.HTTP_201_CREATED)
async def create_workout_session(
    session_in: WorkoutSessionCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkoutSessionRead:
    repo = WorkoutRepository(db)
    session = WorkoutSession(
        user_id=current_user.id,
        title=session_in.title,
        status=session_in.status,
    )
    created = await repo.create(session)
    return WorkoutSessionRead.model_validate(created)


@router.get("/", response_model=List[WorkoutSessionRead])
async def list_user_workouts(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> List[WorkoutSessionRead]:
    repo = WorkoutRepository(db)
    sessions = await repo.list_by_user(current_user.id, skip=skip, limit=limit)
    return [WorkoutSessionRead.model_validate(s) for s in sessions]


@router.get("/{workout_id}", response_model=WorkoutSessionRead)
async def get_workout_session(
    workout_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> WorkoutSessionRead:
    repo = WorkoutRepository(db)
    session = await repo.get_with_logs(workout_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")
    return WorkoutSessionRead.model_validate(session)


@router.post(
    "/{workout_id}/logs", response_model=ExerciseLogRead, status_code=status.HTTP_201_CREATED
)
async def log_exercise(
    workout_id: uuid.UUID,
    log_in: ExerciseLogCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ExerciseLogRead:
    repo = WorkoutRepository(db)
    session = await repo.get(workout_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout not found")

    log = ExerciseLog(
        session_id=workout_id,
        exercise_type=log_in.exercise_type,
        reps=log_in.reps,
        form_accuracy=log_in.form_accuracy,
        feedback_notes=log_in.feedback_notes,
        raw_landmarks=log_in.raw_landmarks,
    )
    created_log = await repo.add_exercise_log(log)

    # Increment aggregate totals
    await repo.update(session, {"total_reps": session.total_reps + log_in.reps})

    return ExerciseLogRead.model_validate(created_log)


MET_VALUES = {
    "squat": 6.0,
    "pushup": 5.5,
    "bicep_curl": 4.5,
    "lunge": 6.0,
    "overhead_press": 5.0,
    "plank": 4.0,
}


@router.post(
    "/quick-log", response_model=QuickWorkoutLogResponse, status_code=status.HTTP_201_CREATED
)
async def log_quick_set(payload: QuickWorkoutLogRequest) -> QuickWorkoutLogResponse:
    from datetime import datetime, timezone

    met = MET_VALUES.get(payload.exercise_type.lower(), 5.0)
    duration_min = max(0.1, payload.duration_seconds / 60.0)
    base_cals = (met * 3.5 * payload.athlete_weight_kg / 200.0) * duration_min
    rep_bonus = payload.reps * 0.45
    total_calories = round(base_cals + rep_bonus, 1)

    strain = round((payload.reps * payload.form_accuracy * 1.5) / duration_min, 2)
    if strain > 30.0:
        intensity = "Peak"
    elif strain > 18.0:
        intensity = "High"
    elif strain > 10.0:
        intensity = "Moderate"
    else:
        intensity = "Light"

    feedback = f"Completed {payload.reps} reps of {payload.exercise_type} with {int(payload.form_accuracy * 100)}% kinematic accuracy. {intensity} neuromuscular stimulus achieved."

    return QuickWorkoutLogResponse(
        id=uuid.uuid4(),
        exercise_type=payload.exercise_type,
        reps=payload.reps,
        form_accuracy=payload.form_accuracy,
        duration_seconds=payload.duration_seconds,
        estimated_calories_burned=total_calories,
        intensity_rating=intensity,
        anabolic_strain_index=strain,
        feedback=feedback,
        recorded_at=datetime.now(timezone.utc),
    )
