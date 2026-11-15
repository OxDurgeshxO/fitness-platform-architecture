from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    auth,
    coach,
    ecosystem,
    exercises,
    gamification,
    nutrition,
    pose,
    users,
    workouts,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(workouts.router)
api_router.include_router(pose.router)
api_router.include_router(exercises.router)
api_router.include_router(nutrition.router)
api_router.include_router(coach.router)
api_router.include_router(admin.router)
api_router.include_router(gamification.router)
api_router.include_router(ecosystem.router)
