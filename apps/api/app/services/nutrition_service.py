from typing import List

from app.schemas.nutrition import (
    MacroDistribution,
    MealItem,
    MealSchedule,
    NutritionPlanRequest,
    NutritionPlanResponse,
)


class NutritionService:
    ACTIVITY_MULTIPLIERS = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }

    GOAL_ADJUSTMENTS = {
        "fat_loss": -500,
        "aggressive_cut": -750,
        "maintenance": 0,
        "hypertrophy": 300,
    }

    @classmethod
    def calculate_bmr(cls, weight_kg: float, height_cm: float, age: int, gender: str) -> int:
        """Mifflin-St Jeor equation."""
        base = (10.0 * weight_kg) + (6.25 * height_cm) - (5.0 * age)
        return int(round(base + 5.0 if gender.lower() == "male" else base - 161.0))

    @classmethod
    def calculate_plan(cls, req: NutritionPlanRequest) -> NutritionPlanResponse:
        bmr = cls.calculate_bmr(req.weight_kg, req.height_cm, req.age, req.gender)
        multiplier = cls.ACTIVITY_MULTIPLIERS.get(req.activity_level.lower(), 1.55)
        tdee = int(round(bmr * multiplier))

        calorie_delta = cls.GOAL_ADJUSTMENTS.get(req.goal.lower(), 0)
        target_calories = max(1200, tdee + calorie_delta)

        # Protein: 2.0 to 2.4 g/kg
        if req.goal in ["fat_loss", "aggressive_cut"]:
            protein_g_per_kg = 2.4
        elif req.goal == "hypertrophy":
            protein_g_per_kg = 2.2
        else:
            protein_g_per_kg = 2.0

        protein_grams = int(round(req.weight_kg * protein_g_per_kg))
        protein_calories = protein_grams * 4

        remaining_calories = max(400, target_calories - protein_calories)

        # Fat: 25% of total target calories
        fat_calories = int(round(target_calories * 0.25))
        fat_grams = int(round(fat_calories / 9.0))

        # Carbs: remainder
        carbs_calories = max(200, remaining_calories - fat_calories)
        carbs_grams = int(round(carbs_calories / 4.0))

        total_distributed_cals = (protein_grams * 4) + (carbs_grams * 4) + (fat_grams * 9)

        macros = MacroDistribution(
            protein_grams=protein_grams,
            carbs_grams=carbs_grams,
            fat_grams=fat_grams,
            protein_calories=protein_grams * 4,
            carbs_calories=carbs_grams * 4,
            fat_calories=fat_grams * 9,
            protein_percentage=round((protein_grams * 4 / total_distributed_cals) * 100, 1),
            carbs_percentage=round((carbs_grams * 4 / total_distributed_cals) * 100, 1),
            fat_percentage=round((fat_grams * 9 / total_distributed_cals) * 100, 1),
        )

        # Generate 4-meal distribution
        meals: List[MealSchedule] = [
            MealSchedule(
                meal_name="Breakfast — Protein Kickstart",
                timing="08:00 AM",
                target_calories=int(round(target_calories * 0.25)),
                recommended_items=[
                    MealItem(
                        name="Eggs (3 whole + 2 whites)",
                        calories=280,
                        protein_grams=28,
                        carbs_grams=2,
                        fat_grams=16,
                    ),
                    MealItem(
                        name="Rolled Oats with berries (60g)",
                        calories=220,
                        protein_grams=7,
                        carbs_grams=40,
                        fat_grams=4,
                    ),
                ],
            ),
            MealSchedule(
                meal_name="Lunch — Anabolic Fuel",
                timing="01:00 PM",
                target_calories=int(round(target_calories * 0.35)),
                recommended_items=[
                    MealItem(
                        name="Grilled Chicken Breast / Tofu (200g)",
                        calories=320,
                        protein_grams=54,
                        carbs_grams=0,
                        fat_grams=6,
                    ),
                    MealItem(
                        name="Steamed Jasmine Rice / Quinoa (180g)",
                        calories=230,
                        protein_grams=5,
                        carbs_grams=50,
                        fat_grams=1,
                    ),
                    MealItem(
                        name="Steamed Broccoli & Olive Oil (100g)",
                        calories=85,
                        protein_grams=3,
                        carbs_grams=6,
                        fat_grams=5,
                    ),
                ],
            ),
            MealSchedule(
                meal_name="Pre/Post Workout — Performance Nutrition",
                timing="05:30 PM",
                target_calories=int(round(target_calories * 0.15)),
                recommended_items=[
                    MealItem(
                        name="Whey / Plant Isolate Shake (1 scoop)",
                        calories=130,
                        protein_grams=26,
                        carbs_grams=2,
                        fat_grams=1,
                    ),
                    MealItem(
                        name="Medium Banana",
                        calories=105,
                        protein_grams=1,
                        carbs_grams=27,
                        fat_grams=0,
                    ),
                ],
            ),
            MealSchedule(
                meal_name="Dinner — Recovery & Sleep Optimization",
                timing="08:30 PM",
                target_calories=int(round(target_calories * 0.25)),
                recommended_items=[
                    MealItem(
                        name="Baked Salmon Fillet / Paneer (180g)",
                        calories=360,
                        protein_grams=36,
                        carbs_grams=0,
                        fat_grams=22,
                    ),
                    MealItem(
                        name="Roasted Sweet Potato (150g)",
                        calories=130,
                        protein_grams=2,
                        carbs_grams=30,
                        fat_grams=0,
                    ),
                    MealItem(
                        name="Mixed Green Salad with Avocado",
                        calories=110,
                        protein_grams=2,
                        carbs_grams=4,
                        fat_grams=9,
                    ),
                ],
            ),
        ]

        water_liters = round(max(2.5, req.weight_kg * 0.04), 1)

        return NutritionPlanResponse(
            bmr=bmr,
            tdee=tdee,
            target_calories=target_calories,
            goal=req.goal,
            daily_macros=macros,
            meals=meals,
            water_intake_liters=water_liters,
        )
