from starlette.testclient import TestClient


def test_quick_workout_log(client: TestClient) -> None:
    payload = {
        "exercise_type": "squat",
        "reps": 15,
        "form_accuracy": 0.95,
        "duration_seconds": 60,
        "athlete_weight_kg": 75.0,
    }
    response = client.post("/api/v1/workouts/quick-log", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["exercise_type"] == "squat"
    assert data["reps"] == 15
    assert data["estimated_calories_burned"] > 5.0
    assert data["intensity_rating"] in ["Light", "Moderate", "High", "Peak"]
    assert "recorded_at" in data
