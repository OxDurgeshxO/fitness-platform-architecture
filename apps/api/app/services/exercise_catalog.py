from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ExerciseProfile(BaseModel):
    id: str
    name: str
    category: str  # strength, hypertrophy, mobility, core
    target_muscle_groups: List[str]
    secondary_muscles: List[str]
    joint_tracking_landmarks: List[int]
    min_angle_threshold: float
    max_angle_threshold: float
    instructions: List[str]
    common_mistakes: List[str]
    correction_cues: List[str]


EXERCISE_DATABASE: Dict[str, ExerciseProfile] = {
    "squat": ExerciseProfile(
        id="squat",
        name="Barbell / Bodyweight Squat",
        category="strength",
        target_muscle_groups=["Quadriceps", "Gluteus Maximus"],
        secondary_muscles=["Hamstrings", "Calves", "Core"],
        joint_tracking_landmarks=[23, 25, 27],  # Left Hip, Knee, Ankle
        min_angle_threshold=90.0,
        max_angle_threshold=160.0,
        instructions=[
            "Set feet shoulder-width apart with toes turned slightly outward.",
            "Inhale and brace core; push hips back and bend knees.",
            "Descend until hip crease is parallel with or slightly below knee crease.",
            "Drive up through the full foot, returning to standing position.",
        ],
        common_mistakes=[
            "Knees caving inward (valgus collapse)",
            "Heels lifting off the ground",
            "Rounding the lumbar spine",
        ],
        correction_cues=[
            "Drive knees outward tracking toes",
            "Keep chest elevated and eyes forward",
            "Weight evenly distributed across tripod of foot",
        ],
    ),
    "pushup": ExerciseProfile(
        id="pushup",
        name="Standard Pushup",
        category="strength",
        target_muscle_groups=["Pectoralis Major", "Triceps Brachii"],
        secondary_muscles=["Anterior Deltoids", "Rectus Abdominis"],
        joint_tracking_landmarks=[11, 13, 15],  # Left Shoulder, Elbow, Wrist
        min_angle_threshold=90.0,
        max_angle_threshold=160.0,
        instructions=[
            "Begin in a high plank with hands slightly wider than shoulder-width.",
            "Maintain straight line from crown of head to heels.",
            "Lower chest until elbows reach 90-degree angle.",
            "Press firmly through palms to return to top position.",
        ],
        common_mistakes=[
            "Sagging hips or arching lower back",
            "Flaring elbows excessively outward (90 degrees to torso)",
            "Incomplete lockout or shallow depth",
        ],
        correction_cues=[
            "Tuck elbows at 45 degrees relative to torso",
            "Squeeze glutes and brace abdominals",
            "Full range of motion: chest to deck",
        ],
    ),
    "bicep_curl": ExerciseProfile(
        id="bicep_curl",
        name="Standing Dumbbell Bicep Curl",
        category="hypertrophy",
        target_muscle_groups=["Biceps Brachii"],
        secondary_muscles=["Brachialis", "Brachioradialis"],
        joint_tracking_landmarks=[11, 13, 15],  # Left Shoulder, Elbow, Wrist
        min_angle_threshold=40.0,
        max_angle_threshold=160.0,
        instructions=[
            "Stand tall holding dumbbells at sides, palms facing forward.",
            "Keep upper arms pinned to torso; curl weight upward.",
            "Contract biceps hard at peak flexion.",
            "Lower slowly with control through full eccentric range.",
        ],
        common_mistakes=[
            "Swinging torso for momentum",
            "Drifting elbows forward away from ribs",
            "Cutting eccentric phase short",
        ],
        correction_cues=[
            "Pin elbows to sides throughout the rep",
            "3-second controlled descent on the way down",
            "Keep wrists neutral without curling backwards",
        ],
    ),
    "lunge": ExerciseProfile(
        id="lunge",
        name="Walking / Stationary Lunge",
        category="strength",
        target_muscle_groups=["Quadriceps", "Glutes"],
        secondary_muscles=["Hamstrings", "Calves"],
        joint_tracking_landmarks=[23, 25, 27],
        min_angle_threshold=90.0,
        max_angle_threshold=160.0,
        instructions=[
            "Step forward with lead leg, keeping torso upright.",
            "Lower rear knee until it hovers 1 inch above the floor.",
            "Front knee should remain stacked directly over front ankle.",
            "Push through front heel to return to start.",
        ],
        common_mistakes=[
            "Front knee traveling past front toes excessively",
            "Torso pitching forward",
            "Narrow stride causing balance loss",
        ],
        correction_cues=[
            "Maintain 90-degree bend in both knees at bottom",
            "Keep torso perpendicular to floor",
            "Step slightly wider as if on railroad tracks",
        ],
    ),
    "overhead_press": ExerciseProfile(
        id="overhead_press",
        name="Standing Overhead Shoulder Press",
        category="strength",
        target_muscle_groups=["Anterior Deltoids", "Medial Deltoids"],
        secondary_muscles=["Triceps Brachii", "Upper Pectorals", "Trapezius"],
        joint_tracking_landmarks=[13, 11, 23],  # Elbow, Shoulder, Hip
        min_angle_threshold=80.0,
        max_angle_threshold=175.0,
        instructions=[
            "Hold bar at collarbone height with full grip.",
            "Press straight overhead, clearing head as bar ascends.",
            "Lock out overhead with arms aligned over mid-foot.",
            "Control descent back to front rack position.",
        ],
        common_mistakes=[
            "Excessive lumbar arching under heavy load",
            "Bar path drifting forward around face",
            "Failing to achieve full overhead extension",
        ],
        correction_cues=[
            "Squeeze glutes to protect lower spine",
            "Move head slightly back then push through under the bar",
            "Shrug shoulders upward into active lockout",
        ],
    ),
    "plank": ExerciseProfile(
        id="plank",
        name="Isometric Forearm Plank",
        category="core",
        target_muscle_groups=["Transverse Abdominis", "Rectus Abdominis"],
        secondary_muscles=["Obliques", "Gluteals", "Serratus Anterior"],
        joint_tracking_landmarks=[11, 23, 27],  # Shoulder, Hip, Ankle
        min_angle_threshold=170.0,
        max_angle_threshold=180.0,
        instructions=[
            "Rest on forearms with elbows directly under shoulders.",
            "Maintain rigid straight line from head to heels.",
            "Engage core actively by pulling navel toward spine.",
            "Breathe steadily while holding position.",
        ],
        common_mistakes=[
            "Hips sagging down toward floor",
            "Piking hips excessively into an A-frame",
            "Hyperextending the neck looking up",
        ],
        correction_cues=[
            "Tuck pelvis under and squeeze glutes",
            "Push floor away with forearms to prevent shoulder collapse",
            "Keep chin tucked looking at floor between forearms",
        ],
    ),
}


class ExerciseCatalogService:
    @staticmethod
    def list_all() -> List[ExerciseProfile]:
        return list(EXERCISE_DATABASE.values())

    @staticmethod
    def get_by_id(exercise_id: str) -> Optional[ExerciseProfile]:
        return EXERCISE_DATABASE.get(exercise_id.lower())

    @staticmethod
    def list_by_category(category: str) -> List[ExerciseProfile]:
        return [e for e in EXERCISE_DATABASE.values() if e.category.lower() == category.lower()]
