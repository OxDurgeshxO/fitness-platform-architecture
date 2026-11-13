import sys
from pathlib import Path
import pytest
from starlette.testclient import TestClient

# Ensure app package is in path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)
