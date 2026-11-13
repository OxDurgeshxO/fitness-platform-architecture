from starlette.testclient import TestClient


def test_calculate_nutrition_plan_hypertrophy(client: TestClient) -> None:
    payload = {
        "weight_kg": 75.0,
        "height_cm": 178.0,
        "age": 25,
        "gender": "male",
        "activity_level": "moderate",
        "goal": "hypertrophy",
    }
    response = client.post("/api/v1/nutrition/calculate-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["bmr"] > 1600
    assert data["tdee"] > 2400
    assert data["target_calories"] == data["tdee"] + 300
    assert data["daily_macros"]["protein_grams"] == int(round(75.0 * 2.2))
    assert len(data["meals"]) == 4
    assert data["water_intake_liters"] >= 2.5


def test_calculate_nutrition_plan_fat_loss(client: TestClient) -> None:
    payload = {
        "weight_kg": 85.0,
        "height_cm": 180.0,
        "age": 30,
        "gender": "male",
        "activity_level": "light",
        "goal": "fat_loss",
    }
    response = client.post("/api/v1/nutrition/calculate-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_calories"] == data["tdee"] - 500
    assert data["daily_macros"]["protein_grams"] == int(round(85.0 * 2.4))
