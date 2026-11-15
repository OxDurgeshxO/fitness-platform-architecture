from starlette.testclient import TestClient


def test_coach_form_correction_query(client: TestClient) -> None:
    payload = {
        "message": "My knees hurt during deep squats, what should I change?",
    }
    response = client.post("/api/v1/coach/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "form_correction"
    assert data["confidence_score"] >= 0.90
    assert len(data["actionable_cues"]) > 0
    assert data["safety_disclaimer"] is not None
    assert "squat" in data["suggested_exercises"]


def test_coach_nutrition_query(client: TestClient) -> None:
    payload = {
        "message": "How much protein should I eat daily for muscle hypertrophy?",
    }
    response = client.post("/api/v1/coach/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "nutrition_advice"
    assert "protein" in data["reply"].lower()
    assert len(data["actionable_cues"]) > 0
