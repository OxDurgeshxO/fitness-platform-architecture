from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class Achievement(BaseModel):
    id: str
    title: str
    description: str
    category: str  # strength, endurance, consistency, biomechanics
    xp_reward: int
    icon: str
    is_unlocked: bool
    unlocked_at: Optional[datetime] = None


class LeaderboardEntry(BaseModel):
    rank: int
    athlete_name: str
    level: int
    tier_title: str
    total_xp: int
    streak_days: int
    badges_count: int


class UserLevelProgress(BaseModel):
    current_level: int
    tier_title: str
    total_xp: int
    current_level_xp: int
    next_level_xp: int
    progress_percentage: float
    streak_days: int
    completed_workouts_count: int
