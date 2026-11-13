from starlette.testclient import TestClient


def test_list_exercises(client: TestClient) -> None:
    response = client.get("/api/v1/exercises/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    ids = [e["id"] for e in data]
    assert "squat" in ids
    assert "pushup" in ids
    assert "plank" in ids


def test_get_exercise_detail(client: TestClient) -> None:
    response = client.get("/api/v1/exercises/squat")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "squat"
    assert "Quadriceps" in data["target_muscle_groups"]
    assert data["min_angle_threshold"] == 90.0
