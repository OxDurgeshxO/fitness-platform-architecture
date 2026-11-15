from starlette.testclient import TestClient


def test_admin_overview_endpoint(client: TestClient) -> None:
    response = client.get("/api/v1/admin/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["system_metrics"]["total_users_registered"] > 1000
    assert len(data["subsystem_health"]) >= 5
    assert data["environment"] == "development"


def test_security_headers_and_timing(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert "X-Process-Time-Ms" in response.headers
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "Strict-Transport-Security" in response.headers
