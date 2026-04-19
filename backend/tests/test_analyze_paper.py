"""
Integration tests for POST /api/analyze-paper in mock mode.
These run without any live API calls.

Mock mode is enabled globally by conftest.py before any app.* import.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _analyze(query: str, limit: int = 10) -> dict:
    response = client.post("/api/analyze-paper", json={"query": query, "limit": limit})
    assert response.status_code == 200, response.text
    return response.json()


# ---------------------------------------------------------------------------
# Response shape
# ---------------------------------------------------------------------------

def test_analyze_returns_seed_paper():
    data = _analyze("1706.03762")
    assert "seedPaper" in data
    seed = data["seedPaper"]
    assert seed["title"]
    assert isinstance(seed["authors"], list)
    assert seed["citationCount"] > 0


def test_analyze_returns_results():
    data = _analyze("attention is all you need")
    assert "results" in data
    assert len(data["results"]) > 0


def test_analyze_results_have_scores():
    data = _analyze("1706.03762")
    for paper in data["results"]:
        assert "finalScore" in paper
        assert "impactScore" in paper
        assert "networkScore" in paper
        assert "relevanceScore" in paper
        assert "citationIntentScore" in paper
        assert 0.0 <= paper["finalScore"] <= 1.0


def test_analyze_results_have_why_ranked():
    data = _analyze("1706.03762")
    for paper in data["results"]:
        assert paper["whyRanked"]
        assert len(paper["whyRanked"]) > 5


def test_analyze_summary_mock_mode_true():
    data = _analyze("1706.03762")
    assert data["summary"]["mockMode"] is True


def test_analyze_results_sorted_descending():
    data = _analyze("1706.03762")
    scores = [p["finalScore"] for p in data["results"]]
    assert scores == sorted(scores, reverse=True)


def test_analyze_limit_respected():
    data = _analyze("1706.03762", limit=3)
    assert len(data["results"]) <= 3


# ---------------------------------------------------------------------------
# Breakdown and badges
# ---------------------------------------------------------------------------

def test_analyze_results_have_breakdown():
    data = _analyze("1706.03762")
    for paper in data["results"]:
        assert "breakdown" in paper
        bd = paper["breakdown"]
        assert "impact" in bd
        assert "network" in bd
        assert "relevance" in bd
        assert "context" in bd
        assert bd["impact"]
        assert bd["network"]


def test_analyze_results_have_badges_list():
    data = _analyze("1706.03762")
    for paper in data["results"]:
        assert "badges" in paper
        assert isinstance(paper["badges"], list)


def test_analyze_highly_influential_gets_badge():
    data = _analyze("1706.03762")
    influential = [p for p in data["results"] if p.get("highlyInfluential")]
    for paper in influential:
        assert "Highly Influential" in paper["badges"]


# ---------------------------------------------------------------------------
# Resolve endpoint
# ---------------------------------------------------------------------------

def test_resolve_paper():
    response = client.post("/api/resolve-paper", json={"query": "1706.03762"})
    assert response.status_code == 200
    data = response.json()
    assert "paper" in data
    assert data["paper"]["title"]


# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------

def test_analyze_empty_query_returns_422():
    response = client.post("/api/analyze-paper", json={"query": ""})
    assert response.status_code == 422


def test_analyze_limit_above_max_rejected():
    response = client.post("/api/analyze-paper", json={"query": "test", "limit": 9999})
    assert response.status_code == 422
