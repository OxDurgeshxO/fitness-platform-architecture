from typing import List

from pydantic import BaseModel, Field


class MacroDistribution(BaseModel):
    protein_grams: int
    carbs_grams: int
    fat_grams: int
    protein_calories: int
    carbs_calories: int
    fat_calories: int
    protein_percentage: float
    carbs_percentage: float
    fat_percentage: float


class MealItem(BaseModel):
    name: str
    calories: int
    protein_grams: int
    carbs_grams: int
    fat_grams: int


class MealSchedule(BaseModel):
    meal_name: str
    timing: str
    target_calories: int
    recommended_items: List[MealItem]


class NutritionPlanRequest(BaseModel):
    weight_kg: float = Field(..., gt=30, lt=300, json_schema_extra={"example": 75.0})
    height_cm: float = Field(..., gt=100, lt=250, json_schema_extra={"example": 178.0})
    age: int = Field(..., gt=14, lt=100, json_schema_extra={"example": 25})
    gender: str = Field("male", pattern="^(male|female)$")
    activity_level: str = Field(
        "moderate",
        pattern="^(sedentary|light|moderate|very_active|extra_active)$",
        description="sedentary, light (1-3 days), moderate (3-5 days), very_active (6-7 days), extra_active",
    )
    goal: str = Field(
        "hypertrophy",
        pattern="^(fat_loss|maintenance|hypertrophy|aggressive_cut)$",
        description="fat_loss (-500 kcal), aggressive_cut (-750 kcal), maintenance, hypertrophy (+300 kcal)",
    )


class NutritionPlanResponse(BaseModel):
    bmr: int
    tdee: int
    target_calories: int
    goal: str
    daily_macros: MacroDistribution
    meals: List[MealSchedule]
    water_intake_liters: float
