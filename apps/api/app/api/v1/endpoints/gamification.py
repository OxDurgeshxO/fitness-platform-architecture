from typing import List

from fastapi import APIRouter

from app.schemas.gamification import Achievement, LeaderboardEntry, UserLevelProgress
from app.services.gamification_service import GamificationService

router = APIRouter(prefix="/gamification", tags=["Gamification & Growth"])


@router.get("/progress", response_model=UserLevelProgress)
async def get_progress() -> UserLevelProgress:
    """Returns current athlete level, XP progress bar, tier title, and streak days."""
    return GamificationService.get_user_progress()


@router.get("/achievements", response_model=List[Achievement])
async def list_achievements() -> List[Achievement]:
    """Returns all badges and achievements with unlock status and XP rewards."""
    return GamificationService.list_achievements()


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard() -> List[LeaderboardEntry]:
    """Returns global leaderboards ranked by total XP and streak."""
    return GamificationService.get_leaderboard()
