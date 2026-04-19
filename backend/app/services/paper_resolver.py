"""
Resolve user input to a canonical seed paper.

Resolution order:
  1. Semantic Scholar (primary — best coverage + citation graph access)
  2. arXiv (for arXiv IDs when SS lookup fails)
  3. OpenAlex title search (last resort)

Returns a single RawPaper or raises PaperNotFoundError.
"""

import logging
import re
from app.models.api import ParsedInput
from app.models.paper import RawPaper
from app.services import semantic_scholar_service as ss
from app.services import arxiv_service
from app.services import openalex_service as oa
from app.utils.exceptions import PaperNotFoundError, UpstreamAPIError

logger = logging.getLogger(__name__)


async def resolve(parsed: ParsedInput) -> RawPaper:
    """
    Attempt to resolve the parsed input to a paper using available sources.
    Raises PaperNotFoundError if all sources fail.
    """
    paper: RawPaper | None = None

    # --- Try Semantic Scholar first -----------------------------------------
    if parsed.input_type in ("arxiv_id", "arxiv_url", "doi", "doi_url", "semantic_scholar_url"):
        try:
            paper = await ss.get_paper(parsed.value, parsed.input_type)
            logger.info("Resolved '%s' via Semantic Scholar", parsed.value)
        except (PaperNotFoundError, UpstreamAPIError) as exc:
            logger.warning("SS resolution failed (%s): %s", parsed.value, exc)

    elif parsed.input_type == "title":
        try:
            results = await ss.search_by_title(parsed.value, limit=5)
            match = _best_title_match(parsed.value, results)
            if match:
                paper = match
                logger.info("Resolved title '%s' via SS search", parsed.value)
        except UpstreamAPIError as exc:
            logger.warning("SS title search failed: %s", exc)

    # --- arXiv fallback for arXiv IDs ---------------------------------------
    if paper is None and parsed.input_type in ("arxiv_id", "arxiv_url"):
        try:
            paper = await arxiv_service.get_paper(parsed.value)
            if paper:
                logger.info("Resolved '%s' via arXiv", parsed.value)
        except Exception as exc:
            logger.warning("arXiv fallback failed: %s", exc)

    # --- OpenAlex title search as last resort --------------------------------
    if paper is None and parsed.input_type == "title":
        try:
            oa_results = await oa.search_by_title(parsed.value, limit=5)
            if oa_results:
                # Pick the OA result whose title best matches the query
                oa_papers = [_oa_result_to_raw_paper(h) for h in oa_results]
                match = _best_title_match(parsed.value, oa_papers)
                if match:
                    paper = match
                    logger.info("Resolved title '%s' via OpenAlex", parsed.value)
        except Exception as exc:
            logger.warning("OA title search failed: %s", exc)

    if paper is None:
        raise PaperNotFoundError(
            f"Could not resolve paper from input: '{parsed.raw}'. "
            "Try a direct arXiv ID, DOI, or Semantic Scholar URL."
        )

    # Best-effort OA enrichment on the seed
    try:
        paper = await oa.enrich_paper_by_doi(paper)
    except Exception:
        pass

    return paper


def _normalise(text: str) -> set[str]:
    """Lowercase, strip punctuation, return set of words."""
    return set(re.sub(r"[^\w\s]", "", text.lower()).split())


def _title_similarity(query: str, candidate: str) -> float:
    """Jaccard similarity between query and candidate title word sets."""
    a = _normalise(query)
    b = _normalise(candidate)
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _best_title_match(query: str, papers: list[RawPaper], threshold: float = 0.3) -> RawPaper | None:
    """
    Return the paper with the highest title similarity to the query,
    only if it meets the minimum threshold. Returns None if no good match.
    """
    best: RawPaper | None = None
    best_score = 0.0
    for p in papers:
        score = _title_similarity(query, p.title)
        if score > best_score:
            best_score = score
            best = p
    if best_score >= threshold:
        logger.debug("Best title match: %.2f — '%s'", best_score, best.title if best else "")
        return best
    logger.debug("No title match above threshold %.2f (best was %.2f)", threshold, best_score)
    return None


def _oa_result_to_raw_paper(hit: dict) -> RawPaper:
    """Convert a raw OpenAlex works API result to a RawPaper."""
    doi = (hit.get("doi") or "").replace("https://doi.org/", "") or None
    authors = []
    for a in (hit.get("authorships") or []):
        name = (a.get("author") or {}).get("display_name", "")
        if name:
            authors.append(name)

    venue = None
    loc = hit.get("primary_location") or {}
    source = loc.get("source") or {}
    venue = source.get("display_name")

    return RawPaper(
        id=doi or hit.get("id", "oa-unknown"),
        title=hit.get("title") or "Untitled",
        authors=authors,
        year=hit.get("publication_year"),
        venue=venue,
        doi=doi,
        openalex_id=hit.get("id"),
        citation_count=hit.get("cited_by_count") or 0,
        sources=["OpenAlex"],
    )
