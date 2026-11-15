"""
End-to-end integration tests using Starlette TestClient (no live server required).
All routes are exercised in-process via ASGI transport.
"""

import pytest
from starlette.testclient import TestClient


def test_live_health_endpoint(client: TestClient) -> None:
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AI Gym & Fitness Assistant"


def test_live_exercise_catalog(client: TestClient) -> None:
    res = client.get("/api/v1/exercises/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 6
    assert any(e["id"] == "squat" for e in data)

    res_detail = client.get("/api/v1/exercises/squat")
    assert res_detail.status_code == 200
    assert res_detail.json()["name"] == "Barbell / Bodyweight Squat"


def test_live_nutrition_plan(client: TestClient) -> None:
    payload = {
        "weight_kg": 80.0,
        "height_cm": 182.0,
        "age": 26,
        "gender": "male",
        "activity_level": "very_active",
        "goal": "hypertrophy",
    }
    res = client.post("/api/v1/nutrition/calculate-plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["bmr"] > 1700
    assert data["target_calories"] > 3000
    assert len(data["meals"]) == 4


def test_live_pose_analysis(client: TestClient) -> None:
    payload = {
        "exercise_type": "squat",
        "current_reps": 3,
        "landmarks": [
            {"x": float(i), "y": float(i), "z": 0.0, "visibility": 1.0}
            for i in range(33)
        ],
    }
    res = client.post("/api/v1/pose/analyze-frame", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["exercise_type"] == "squat"
    assert "symmetry_score" in data
    assert data["bilateral_balance"] in ["balanced", "left_shifted", "right_shifted"]


def test_live_workout_quick_log(client: TestClient) -> None:
    payload = {
        "exercise_type": "pushup",
        "reps": 20,
        "form_accuracy": 0.98,
        "duration_seconds": 45,
        "athlete_weight_kg": 75.0,
    }
    res = client.post("/api/v1/workouts/quick-log", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["exercise_type"] == "pushup"
    assert data["reps"] == 20
    assert data["estimated_calories_burned"] > 5.0
    assert data["intensity_rating"] in ["Light", "Moderate", "High", "Peak"]


def test_live_coach_chat(client: TestClient) -> None:
    payload = {
        "message": "What is the optimal bar path for overhead press?",
    }
    res = client.post("/api/v1/coach/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["confidence_score"] >= 0.85
    assert len(data["actionable_cues"]) > 0
    assert len(data["reply"]) > 20
