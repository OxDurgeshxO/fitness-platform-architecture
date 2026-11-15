from starlette.testclient import TestClient


def test_heart_rate_zone_analysis(client: TestClient) -> None:
    payload = {
        "athlete_age": 28,
        "resting_heart_rate": 55,
        "current_heart_rate": 150,
        "device_name": "Garmin Forerunner 965"
    }
    response = client.post("/api/v1/ecosystem/heart-rate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["current_bpm"] == 150
    assert data["max_heart_rate"] > 180
    assert "current_zone" in data
    assert "Zone" in data["current_zone"]
    assert "target_bpm_range" in data
    assert "training_effect" in data
    assert data["heart_rate_reserve_pct"] > 0


def test_athlete_data_export(client: TestClient) -> None:
    response = client.get("/api/v1/ecosystem/export-data")
    assert response.status_code == 200
    data = response.json()
    assert "athlete_profile" in data
    assert data["athlete_profile"]["name"] == "Durgesh Dutt Sinha"
    assert data["session_count"] > 0
    assert data["total_calories_burned"] > 0
    assert len(data["achievements_unlocked"]) > 0
    assert "GDPR" in data["compliance_standard"]
    assert "HIPAA" in data["compliance_standard"]
