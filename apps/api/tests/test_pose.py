from starlette.testclient import TestClient


def test_pose_squat_up_stage(client: TestClient) -> None:
    landmarks = [{"x": float(i), "y": float(i), "z": 0.0, "visibility": 1.0} for i in range(33)]
    payload = {
        "exercise_type": "squat",
        "current_reps": 0,
        "landmarks": landmarks,
    }
    response = client.post("/api/v1/pose/analyze-frame", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["exercise_type"] == "squat"
    assert "reps_counted" in data
    assert "current_angle" in data
    assert data["stage"] in ["up", "down", "transition"]
