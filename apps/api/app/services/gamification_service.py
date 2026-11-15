from datetime import datetime, timezone
from typing import List

from app.schemas.gamification import Achievement, LeaderboardEntry, UserLevelProgress

TIER_TITLES = [
    (1, "Iron Novice"),
    (3, "Bronze Lifter"),
    (5, "Silver Athlete"),
    (7, "Gold Spartan"),
    (10, "Mythic Titan"),
]

ACHIEVEMENTS_REGISTRY: List[Achievement] = [
    Achievement(
        id="first_blood",
        title="First Blood",
        description="Complete your first recorded exercise set",
        category="consistency",
        xp_reward=50,
        icon="Trophy",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 10, tzinfo=timezone.utc),
    ),
    Achievement(
        id="century_club",
        title="Century Club",
        description="Complete 100 cumulative reps in a single day",
        category="endurance",
        xp_reward=200,
        icon="Flame",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 12, tzinfo=timezone.utc),
    ),
    Achievement(
        id="squat_depth_master",
        title="Squat Depth Master",
        description="Achieve 95%+ kinematic accuracy on full depth squats",
        category="biomechanics",
        xp_reward=150,
        icon="Target",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 13, tzinfo=timezone.utc),
    ),
    Achievement(
        id="iron_will",
        title="Iron Will",
        description="Log workouts for 7 consecutive calendar days",
        category="consistency",
        xp_reward=350,
        icon="ShieldCheck",
        is_unlocked=False,
    ),
    Achievement(
        id="calorie_crusher",
        title="Calorie Crusher",
        description="Burn over 500 estimated kcal during training session",
        category="endurance",
        xp_reward=150,
        icon="Zap",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 13, tzinfo=timezone.utc),
    ),
    Achievement(
        id="macro_disciplined",
        title="Macro Disciplined",
        description="Generate personalized nutrition plan with optimal protein",
        category="consistency",
        xp_reward=100,
        icon="Utensils",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 13, tzinfo=timezone.utc),
    ),
    Achievement(
        id="coach_consultant",
        title="Coach Consultant",
        description="Engage AI Master Coach for biomechanical form correction",
        category="biomechanics",
        xp_reward=75,
        icon="Bot",
        is_unlocked=True,
        unlocked_at=datetime(2026, 11, 13, tzinfo=timezone.utc),
    ),
    Achievement(
        id="bilateral_balance_master",
        title="Kinematic Harmony",
        description="Attain 98%+ left/right limb symmetry score",
        category="biomechanics",
        xp_reward=250,
        icon="Sparkles",
        is_unlocked=False,
    ),
    Achievement(
        id="hypertrophy_beast",
        title="Hypertrophy Titan",
        description="Complete 500 cumulative reps across all exercises",
        category="strength",
        xp_reward=500,
        icon="Dumbbell",
        is_unlocked=False,
    ),
    Achievement(
        id="titan_ascendant",
        title="Titan Ascendant",
        description="Reach Level 10 and claim Mythic Titan status",
        category="strength",
        xp_reward=1000,
        icon="Crown",
        is_unlocked=False,
    ),
]

GLOBAL_LEADERBOARD: List[LeaderboardEntry] = [
    LeaderboardEntry(
        rank=1,
        athlete_name="Marcus Thorne",
        level=14,
        tier_title="Mythic Titan",
        total_xp=7420,
        streak_days=28,
        badges_count=18,
    ),
    LeaderboardEntry(
        rank=2,
        athlete_name="Elena Rostova",
        level=12,
        tier_title="Mythic Titan",
        total_xp=6150,
        streak_days=21,
        badges_count=15,
    ),
    LeaderboardEntry(
        rank=3,
        athlete_name="Durgesh Sinha",
        level=9,
        tier_title="Gold Spartan",
        total_xp=4825,
        streak_days=14,
        badges_count=12,
    ),
    LeaderboardEntry(
        rank=4,
        athlete_name="Kai Tanaka",
        level=8,
        tier_title="Gold Spartan",
        total_xp=4120,
        streak_days=12,
        badges_count=10,
    ),
    LeaderboardEntry(
        rank=5,
        athlete_name="Sarah Connor",
        level=7,
        tier_title="Gold Spartan",
        total_xp=3650,
        streak_days=9,
        badges_count=8,
    ),
    LeaderboardEntry(
        rank=6,
        athlete_name="David Goggins (AI)",
        level=25,
        tier_title="Immortal Legend",
        total_xp=15400,
        streak_days=365,
        badges_count=35,
    ),
]


class GamificationService:
    @staticmethod
    def get_tier(level: int) -> str:
        current_title = "Iron Novice"
        for req_level, title in TIER_TITLES:
            if level >= req_level:
                current_title = title
        return current_title

    @classmethod
    def get_user_progress(cls) -> UserLevelProgress:
        total_xp = 4825
        level = int(total_xp / 500) + 1
        current_level_base = (level - 1) * 500
        current_level_xp = total_xp - current_level_base
        next_level_xp = 500
        progress_pct = round((current_level_xp / next_level_xp) * 100, 1)

        return UserLevelProgress(
            current_level=level,
            tier_title=cls.get_tier(level),
            total_xp=total_xp,
            current_level_xp=current_level_xp,
            next_level_xp=next_level_xp,
            progress_percentage=progress_pct,
            streak_days=14,
            completed_workouts_count=38,
        )

    @staticmethod
    def list_achievements() -> List[Achievement]:
        return ACHIEVEMENTS_REGISTRY

    @staticmethod
    def get_leaderboard() -> List[LeaderboardEntry]:
        return sorted(GLOBAL_LEADERBOARD, key=lambda x: x.total_xp, reverse=True)
