from starlette.testclient import TestClient


def test_gamification_progress(client: TestClient) -> None:
    response = client.get("/api/v1/gamification/progress")
    assert response.status_code == 200
    data = response.json()
    assert data["current_level"] >= 1
    assert "tier_title" in data
    assert 0 <= data["progress_percentage"] <= 100


def test_gamification_achievements(client: TestClient) -> None:
    response = client.get("/api/v1/gamification/achievements")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 8
    unlocked = [a for a in data if a["is_unlocked"]]
    assert len(unlocked) > 0


def test_gamification_leaderboard(client: TestClient) -> None:
    response = client.get("/api/v1/gamification/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    # Verify sorted descending by total_xp
    xps = [entry["total_xp"] for entry in data]
    assert xps == sorted(xps, reverse=True)
