"""
OpenAlex API integration.

Used for normalised citation metrics (citation_normalized_percentile, FWCI)
that are not available from Semantic Scholar.

API docs: https://docs.openalex.org
Rate limits: 10 req/s with email, 100k/day.
"""

import logging
from typing import Optional
import httpx

from app.config import settings
from app.models.paper import RawPaper
from app.utils.exceptions import UpstreamAPIError

logger = logging.getLogger(__name__)

_BASE = "https://api.openalex.org"


def _params() -> dict[str, str]:
    """Always include polite-pool email if configured."""
    p: dict[str, str] = {}
    if settings.OPENALEX_EMAIL:
        p["mailto"] = settings.OPENALEX_EMAIL
    return p


def _extract_metrics(data: dict) -> tuple[Optional[float], Optional[float]]:
    """
    Pull citation_normalized_percentile and fwci from an OpenAlex work record.
    Returns (cnp, fwci) — either may be None.
    """
    cited = data.get("cited_by_percentile_year") or {}
    cnp: Optional[float] = None
    # OA provides min/max percentile per year; we use the max as an upper bound
    if "max" in cited:
        cnp = float(cited["max"]) / 100.0  # normalise to [0, 1]

    fwci: Optional[float] = data.get("fwci")
    if fwci is not None:
        try:
            fwci = float(fwci)
        except (TypeError, ValueError):
            fwci = None

    return cnp, fwci


async def enrich_paper_by_doi(paper: RawPaper) -> RawPaper:
    """
    Fetch OpenAlex work by DOI and enrich the RawPaper in-place (returns updated copy).
    Silently returns original if lookup fails — OA enrichment is best-effort.
    """
    if not paper.doi:
        return paper

    url = f"{_BASE}/works/https://doi.org/{paper.doi}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=_params())
        if not response.is_success:
            logger.debug("OA enrichment failed for DOI %s: %s", paper.doi, response.status_code)
            return paper

        data = response.json()
        cnp, fwci = _extract_metrics(data)
        oa_id: Optional[str] = data.get("id")  # e.g. "https://openalex.org/W..."

        return paper.model_copy(update={
            "citation_normalized_percentile": cnp,
            "fwci": fwci,
            "openalex_id": oa_id,
            "sources": list(set(paper.sources + ["OpenAlex"])),
        })

    except httpx.HTTPError as exc:
        logger.warning("OA HTTP error for DOI %s: %s", paper.doi, exc)
        return paper


async def enrich_batch(papers: list[RawPaper]) -> list[RawPaper]:
    """
    Enrich a list of papers with OpenAlex metrics concurrently.
    Papers without a DOI are returned unchanged.
    Errors are swallowed — this is always best-effort.
    """
    import asyncio
    tasks = [enrich_paper_by_doi(p) for p in papers]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    enriched: list[RawPaper] = []
    for orig, result in zip(papers, results):
        if isinstance(result, Exception):
            logger.warning("OA enrichment skipped for %s: %s", orig.id, result)
            enriched.append(orig)
        else:
            enriched.append(result)
    return enriched


async def get_citing_papers(openalex_id: str, limit: int = 200) -> list[RawPaper]:
    """
    Fetch papers that cite the given OpenAlex work ID.
    Used as a fallback when Semantic Scholar ID is unavailable.
    """
    # Strip to bare ID like W2963403868
    bare_id = openalex_id.split("/")[-1]
    results: list[RawPaper] = []
    cursor = "*"
    per_page = min(limit, 200)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            while len(results) < limit:
                params = {
                    **_params(),
                    "filter": f"cites:{bare_id}",
                    "per-page": per_page,
                    "cursor": cursor,
                    "select": "id,doi,title,authorships,publication_year,primary_location,cited_by_count,fwci,cited_by_percentile_year,ids",
                }
                response = await client.get(f"{_BASE}/works", params=params)
                if not response.is_success:
                    logger.warning("OA citing papers failed: %s", response.status_code)
                    break

                data = response.json()
                batch = data.get("results") or []
                if not batch:
                    break

                for item in batch:
                    paper = _oa_work_to_raw_paper(item)
                    results.append(paper)

                cursor = (data.get("meta") or {}).get("next_cursor")
                if not cursor or len(batch) < per_page:
                    break

    except httpx.HTTPError as exc:
        logger.warning("OA HTTP error fetching citing papers: %s", exc)

    return results[:limit]


def _oa_work_to_raw_paper(item: dict) -> RawPaper:
    """Convert a raw OpenAlex works result to a RawPaper."""
    doi = (item.get("doi") or "").replace("https://doi.org/", "") or None
    authors = [
        (a.get("author") or {}).get("display_name", "")
        for a in (item.get("authorships") or [])
        if (a.get("author") or {}).get("display_name")
    ]
    loc = item.get("primary_location") or {}
    source = loc.get("source") or {}
    venue = source.get("display_name")

    # Try to get SS ID from OA ids field
    ids = item.get("ids") or {}
    ss_id = ids.get("semantic_scholar")

    oa_id = item.get("id")
    internal_id = doi or ss_id or oa_id or item.get("title", "unknown")

    cnp, fwci = _extract_metrics(item)

    return RawPaper(
        id=internal_id,
        title=item.get("title") or "Untitled",
        authors=authors,
        year=item.get("publication_year"),
        venue=venue,
        doi=doi,
        semantic_scholar_id=ss_id,
        openalex_id=oa_id,
        citation_count=item.get("cited_by_count") or 0,
        citation_normalized_percentile=cnp,
        fwci=fwci,
        sources=["OpenAlex"],
    )


async def search_by_title(title: str, limit: int = 5) -> list[dict]:
    """
    Search OpenAlex by title. Returns raw API dicts (caller decides how to use them).
    Used as a fallback resolver when Semantic Scholar search fails.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{_BASE}/works",
                params={**_params(), "search": title, "per-page": limit, "select": "id,doi,title,authorships,publication_year,primary_location,cited_by_count,fwci,cited_by_percentile_year"},
            )
        if not response.is_success:
            return []
        return (response.json().get("results") or [])[:limit]
    except httpx.HTTPError:
        return []
