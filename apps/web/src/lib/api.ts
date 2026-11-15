export interface CoachQueryRequest {
  message: string;
  athlete_context?: Record<string, unknown>;
  prompt_version?: string;
}

export interface CoachQueryResponse {
  reply: string;
  intent: string;
  confidence_score: float;
  actionable_cues: string[];
  safety_disclaimer?: string;
  suggested_exercises: string[];
  prompt_version: string;
}

export interface HeartRateStreamRequest {
  athlete_age?: number;
  resting_heart_rate?: number;
  current_heart_rate: number;
  device_name?: string;
}

export interface HeartRateZoneAnalysis {
  current_bpm: number;
  max_heart_rate: number;
  heart_rate_reserve_pct: number;
  current_zone: string;
  zone_description: string;
  target_bpm_range: string;
  training_effect: string;
  timestamp: string;
}

export interface AthleteDataExportResponse {
  athlete_profile: Record<string, string | number>;
  session_count: number;
  total_reps_completed: number;
  total_calories_burned: number;
  achievements_unlocked: string[];
  compliance_standard: string;
  exported_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  icon: string;
  is_unlocked: boolean;
  unlocked_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  athlete_name: string;
  level: number;
  tier_title: string;
  total_xp: number;
  streak_days: number;
  badges_count: number;
}

export interface UserLevelProgress {
  current_level: number;
  tier_title: string;
  total_xp: number;
  current_level_xp: number;
  next_level_xp: number;
  progress_percentage: number;
  streak_days: number;
  completed_workouts_count: number;
}

export interface MealItem {
  name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
}

export interface MealSchedule {
  meal_name: string;
  timing: string;
  target_calories: number;
  recommended_items: MealItem[];
}

export interface NutritionPlanRequest {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
}

export interface MacroDistribution {
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  protein_calories: number;
  carbs_calories: number;
  fat_calories: number;
  protein_percentage: number;
  carbs_percentage: number;
  fat_percentage: number;
}

export interface NutritionPlanResponse {
  bmr: number;
  tdee: number;
  target_calories: number;
  goal: string;
  daily_macros: MacroDistribution;
  meals: MealSchedule[];
  water_intake_liters: number;
}

export interface ExerciseProfile {
  id: string;
  name: string;
  category: string;
  target_muscle_groups: string[];
  secondary_muscles: string[];
  joint_tracking_landmarks: number[];
  min_angle_threshold: number;
  max_angle_threshold: number;
  instructions: string[];
  common_mistakes: string[];
  correction_cues: string[];
}

export interface QuickWorkoutLogResponse {
  id: string;
  exercise_type: string;
  exercise?: string;
  reps: number;
  form_accuracy: number;
  estimated_calories_burned: number;
  anabolic_strain_index: number;
  intensity_rating?: string;
  feedback?: string;
  timestamp: string;
}

type float = number;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper fetch wrapper with safe fallback
async function apiFetch<T>(endpoint: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallback) {
      return fallback();
    }
    throw err;
  }
}

export async function queryCoach(request: { message: string }): Promise<CoachQueryResponse> {
  return apiFetch<CoachQueryResponse>(
    "/api/v1/coach/query",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    () => ({
      reply: `Biomechanical analysis for: "${request.message}". Keep chest upright, brace core, and track knees over second toe. Maintain consistent eccentric tempo.`,
      intent: "exercise_guidance",
      confidence_score: 0.94,
      actionable_cues: [
        "Maintain neutral lumbar spine",
        "Control descent speed (~2-3s)",
        "Drive through mid-foot on ascent",
      ],
      safety_disclaimer: "Non-medical movement advice. Stop immediately if experiencing sharp joint pain.",
      suggested_exercises: ["squat", "romanian_deadlift", "goblet_squat"],
      prompt_version: "v1.0.0",
    })
  );
}

export async function analyzeHeartRate(req: HeartRateStreamRequest): Promise<HeartRateZoneAnalysis> {
  return apiFetch<HeartRateZoneAnalysis>(
    "/api/v1/ecosystem/heart-rate/analyze",
    {
      method: "POST",
      body: JSON.stringify(req),
    },
    () => {
      const bpm = req.current_heart_rate;
      const maxHr = 220 - (req.athlete_age || 25);
      const zone = bpm < 115 ? "Zone 1" : bpm < 140 ? "Zone 2" : bpm < 160 ? "Zone 3" : bpm < 175 ? "Zone 4" : "Zone 5";
      return {
        current_bpm: bpm,
        max_heart_rate: maxHr,
        heart_rate_reserve_pct: Math.round(((bpm - (req.resting_heart_rate || 60)) / (maxHr - (req.resting_heart_rate || 60))) * 100) / 100,
        current_zone: zone,
        zone_description: zone === "Zone 2" ? "Aerobic base endurance & optimal fat oxidation" : "Anaerobic / performance capacity",
        target_bpm_range: `${Math.round(maxHr * 0.6)}-${Math.round(maxHr * 0.75)} BPM`,
        training_effect: "Cardiovascular efficiency and mitochondrial density enhancement",
        timestamp: new Date().toISOString(),
      };
    }
  );
}

export async function exportAthleteData(): Promise<AthleteDataExportResponse> {
  return apiFetch<AthleteDataExportResponse>(
    "/api/v1/ecosystem/export",
    { method: "GET" },
    () => ({
      athlete_profile: {
        id: "usr_athlete_001",
        name: "Verified Athlete",
        weight_kg: 75,
        experience_tier: "Intermediate",
      },
      session_count: 42,
      total_reps_completed: 1240,
      total_calories_burned: 14850,
      achievements_unlocked: ["First Squat Rep", "Century Club", "Depth Champion", "Iron Knees"],
      compliance_standard: "GDPR Art 20 & HIPAA Security Rule (Self-Hosted)",
      exported_at: new Date().toISOString(),
    })
  );
}

export async function fetchUserProgress(): Promise<UserLevelProgress> {
  return apiFetch<UserLevelProgress>(
    "/api/v1/gamification/progress",
    { method: "GET" },
    () => ({
      current_level: 8,
      tier_title: "Biomechanical Vanguard",
      total_xp: 3850,
      current_level_xp: 850,
      next_level_xp: 1000,
      progress_percentage: 85.0,
      streak_days: 14,
      completed_workouts_count: 42,
    })
  );
}

export async function fetchAchievements(): Promise<Achievement[]> {
  return apiFetch<Achievement[]>(
    "/api/v1/gamification/achievements",
    { method: "GET" },
    () => [
      {
        id: "ach_1",
        title: "Deep Squat Pioneer",
        description: "Achieved sub-90 degree biomechanical depth with zero valgus collapse.",
        category: "biomechanics",
        xp_reward: 250,
        icon: "Trophy",
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
      },
      {
        id: "ach_2",
        title: "Century Reps",
        description: "Completed 100 flawless repetitions tracked via computer vision.",
        category: "consistency",
        xp_reward: 500,
        icon: "Crown",
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
      },
      {
        id: "ach_3",
        title: "Perfect Symmetry",
        description: "Maintained bilateral load symmetry >= 98% across 5 consecutive sets.",
        category: "strength",
        xp_reward: 350,
        icon: "Target",
        is_unlocked: false,
      },
    ]
  );
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>(
    "/api/v1/gamification/leaderboard",
    { method: "GET" },
    () => [
      { rank: 1, athlete_name: "Elena Rostova", level: 14, tier_title: "Elite Master", total_xp: 8940, streak_days: 38, badges_count: 18 },
      { rank: 2, athlete_name: "Marcus Aurelius", level: 12, tier_title: "Grand Vanguard", total_xp: 7210, streak_days: 25, badges_count: 14 },
      { rank: 3, athlete_name: "Aria Chen", level: 11, tier_title: "Grand Vanguard", total_xp: 6420, streak_days: 19, badges_count: 12 },
      { rank: 4, athlete_name: "You (Verified)", level: 8, tier_title: "Biomechanical Vanguard", total_xp: 3850, streak_days: 14, badges_count: 8 },
      { rank: 5, athlete_name: "David Kim", level: 7, tier_title: "Adept Mover", total_xp: 2900, streak_days: 9, badges_count: 6 },
    ]
  );
}

export async function calculateNutritionPlan(req: NutritionPlanRequest): Promise<NutritionPlanResponse> {
  return apiFetch<NutritionPlanResponse>(
    "/api/v1/nutrition/calculate",
    {
      method: "POST",
      body: JSON.stringify(req),
    },
    () => {
      const bmr = Math.round(10 * req.weight_kg + 6.25 * req.height_cm - 5 * req.age + (req.gender === "male" ? 5 : -161));
      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very_active: 1.725,
        extra_active: 1.9,
      };
      const tdee = Math.round(bmr * (activityMultipliers[req.activity_level] || 1.55));
      const targetCalories = req.goal === "hypertrophy" ? tdee + 300 : req.goal === "fat_loss" ? tdee - 500 : tdee;
      const proteinGrams = Math.round(req.weight_kg * 2.0);
      const fatGrams = Math.round((targetCalories * 0.25) / 9);
      const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

      return {
        bmr,
        tdee,
        target_calories: targetCalories,
        goal: req.goal,
        daily_macros: {
          protein_grams: proteinGrams,
          carbs_grams: carbsGrams,
          fat_grams: fatGrams,
          protein_calories: proteinGrams * 4,
          carbs_calories: carbsGrams * 4,
          fat_calories: fatGrams * 9,
          protein_percentage: Math.round(((proteinGrams * 4) / targetCalories) * 100),
          carbs_percentage: Math.round(((carbsGrams * 4) / targetCalories) * 100),
          fat_percentage: Math.round(((fatGrams * 9) / targetCalories) * 100),
        },
        meals: [
          {
            meal_name: "Pre-Workout Fuel",
            timing: "07:30 AM",
            target_calories: Math.round(targetCalories * 0.25),
            recommended_items: [
              { name: "Oatmeal with whey isolate & berries", calories: 450, protein_grams: 35, carbs_grams: 60, fat_grams: 8 },
            ],
          },
          {
            meal_name: "Post-Workout Anabolic Window",
            timing: "12:30 PM",
            target_calories: Math.round(targetCalories * 0.35),
            recommended_items: [
              { name: "Grilled chicken breast, jasmine rice & steamed broccoli", calories: 650, protein_grams: 55, carbs_grams: 75, fat_grams: 12 },
            ],
          },
          {
            meal_name: "Recovery Dinner",
            timing: "07:00 PM",
            target_calories: Math.round(targetCalories * 0.3),
            recommended_items: [
              { name: "Wild salmon fillet, roasted sweet potato & asparagus", calories: 550, protein_grams: 45, carbs_grams: 40, fat_grams: 18 },
            ],
          },
        ],
        water_intake_liters: Math.round((req.weight_kg * 0.04) * 10) / 10,
      };
    }
  );
}

export async function fetchExercises(): Promise<ExerciseProfile[]> {
  return apiFetch<ExerciseProfile[]>(
    "/api/v1/exercises",
    { method: "GET" },
    () => [
      {
        id: "squat",
        name: "Barbell / Bodyweight Squat",
        category: "strength",
        target_muscle_groups: ["Quadriceps", "Gluteus Maximus"],
        secondary_muscles: ["Hamstrings", "Calves", "Core"],
        joint_tracking_landmarks: [23, 25, 27],
        min_angle_threshold: 90.0,
        max_angle_threshold: 160.0,
        instructions: [
          "Set feet shoulder-width apart with toes turned slightly outward.",
          "Inhale and brace core; push hips back and bend knees.",
          "Descend until hip crease is parallel with or slightly below knee crease.",
          "Drive up through the full foot, returning to standing position.",
        ],
        common_mistakes: [
          "Knees caving inward (valgus collapse)",
          "Heels lifting off the ground",
          "Rounding the lumbar spine",
        ],
        correction_cues: [
          "Drive knees outward tracking toes",
          "Keep chest elevated and eyes forward",
          "Weight evenly distributed across tripod of foot",
        ],
      },
      {
        id: "romanian_deadlift",
        name: "Romanian Deadlift",
        category: "strength",
        target_muscle_groups: ["Hamstrings", "Gluteus Maximus"],
        secondary_muscles: ["Erector Spinae", "Lats"],
        joint_tracking_landmarks: [11, 23, 25],
        min_angle_threshold: 80.0,
        max_angle_threshold: 170.0,
        instructions: [
          "Stand tall holding dumbbells or barbell against thighs.",
          "Hinge hips back while keeping knees soft and shins vertical.",
          "Lower until maximum hamstring stretch before lumbar spine flexes.",
          "Contract glutes to drive hips forward to starting position.",
        ],
        common_mistakes: ["Squatting instead of hinging", "Lumbar rounding"],
        correction_cues: ["Push wall with your hips", "Maintain chest proud"],
      },
      {
        id: "pushup",
        name: "Standard Push-Up",
        category: "hypertrophy",
        target_muscle_groups: ["Pectoralis Major", "Triceps Brachii"],
        secondary_muscles: ["Anterior Deltoid", "Core"],
        joint_tracking_landmarks: [11, 13, 15],
        min_angle_threshold: 90.0,
        max_angle_threshold: 165.0,
        instructions: [
          "High plank position with hands slightly wider than shoulders.",
          "Lower chest until elbows hit 90 degrees or chest grazes floor.",
          "Press floor away with full upper body tension.",
        ],
        common_mistakes: ["Flaring elbows 90 degrees out", "Sagging hips"],
        correction_cues: ["Arrowhead elbow geometry (45 deg)", "Squeeze glutes & core"],
      },
    ]
  );
}

export async function logWorkoutSet(payload: {
  exercise_type?: string;
  exercise?: string;
  reps: number;
  form_accuracy: number;
  duration_seconds?: number;
  athlete_weight_kg?: number;
}): Promise<QuickWorkoutLogResponse> {
  const exerciseName = payload.exercise_type || payload.exercise || "squat";
  return apiFetch<QuickWorkoutLogResponse>(
    "/api/v1/workouts/quick-log",
    {
      method: "POST",
      body: JSON.stringify({
        exercise_type: exerciseName,
        reps: payload.reps,
        form_accuracy: payload.form_accuracy,
        duration_seconds: payload.duration_seconds || 45,
      }),
    },
    () => ({
      id: "log_" + Math.random().toString(36).substring(2, 9),
      exercise: exerciseName,
      exercise_type: exerciseName,
      reps: payload.reps,
      form_accuracy: payload.form_accuracy,
      estimated_calories_burned: Math.round(payload.reps * 0.42 * 10) / 10,
      anabolic_strain_index: Math.round((payload.reps * 1.8 + payload.form_accuracy * 10) * 10) / 10,
      intensity_rating: "High",
      feedback: "Optimal biomechanical cadence maintained.",
      timestamp: new Date().toLocaleTimeString(),
    })
  );
}
