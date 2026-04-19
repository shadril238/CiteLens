"""
Shared pytest fixtures and configuration.

IMPORTANT: the os.environ assignment MUST happen before any app.* import so that
pydantic-settings picks up USE_MOCK_DATA when it constructs the Settings singleton.
conftest.py is always executed by pytest before any test module is collected.
"""

import os
os.environ["USE_MOCK_DATA"] = "true"

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)
