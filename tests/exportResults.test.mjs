import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getExportDateStamp,
  serializeCsv,
  toBibtex,
  toCsvRows,
} from '../.tmp-tests/utils/exportResults.js'

function makePaper(overrides = {}) {
  return {
    id: 1,
    title: 'Foundational Paper',
    authors: 'Alice Smith, Bob Jones',
    venue: 'NeurIPS',
    year: 2024,
    citations: 42,
    impact: 88,
    network: 77,
    relevance: 91,
    context: 65,
    final: 84,
    badges: ['Direct Citation', 'Highly Influential'],
    review: false,
    why: 'Ranks highly because it connects multiple clusters.',
    breakdown: {
      impact: 'High citation velocity.',
      network: 'Strong centrality.',
      relevance: 'Substantial architectural overlap.',
      context: 'Clear downstream influence.',
    },
    abstract: 'A concise abstract.',
    doi: '10.1000/test-doi',
    url: 'https://example.com/paper',
    ...overrides,
  }
}

test('serializes a normal result list in input order', () => {
  const rows = toCsvRows([
    makePaper({ id: 11, title: 'Alpha Paper' }),
    makePaper({ id: 12, title: 'Beta Paper', badges: ['Survey', 'Comprehensive'] }),
  ])
  const csv = serializeCsv(rows)
  const lines = csv.split('\r\n')

  assert.equal(lines[0], 'rank,title,authors,year,venue,doi,arxivId,paperId,url,finalScore,impactScore,networkScore,relevanceScore,citationIntentScore,highlyInfluential,badges,whyRanked')
  assert.match(lines[1], /^1,Alpha Paper,Alice Smith; Bob Jones,2024,NeurIPS/)
  assert.match(lines[2], /^2,Beta Paper,Alice Smith; Bob Jones,2024,NeurIPS/)
})

test('escapes CSV special characters correctly', () => {
  const csv = serializeCsv(
    toCsvRows([
      makePaper({
        title: 'Paper, "Quoted"\nLine',
        why: 'Uses "quotes", commas, and\nnew lines.',
      }),
    ]),
  )

  assert.ok(csv.includes('"Paper, ""Quoted""\nLine"'))
  assert.ok(csv.includes('"Uses ""quotes"", commas, and\nnew lines."'))
})

test('handles missing CSV values without undefined text', () => {
  const rows = toCsvRows([
    makePaper({
      venue: '',
      year: 0,
      doi: undefined,
      url: undefined,
      badges: [],
    }),
  ])
  const csv = serializeCsv(rows)

  assert.ok(!csv.includes('undefined'))
  assert.ok(!csv.includes('null'))
  assert.match(csv, /Foundational Paper,Alice Smith; Bob Jones,,,/)
})

test('serializes arrays deterministically for CSV fields', () => {
  const [row] = toCsvRows([
    makePaper({
      badges: ['Survey', 'Efficiency', 'Highly Influential'],
    }),
  ])

  assert.equal(row.authors, 'Alice Smith; Bob Jones')
  assert.equal(row.badges, 'Survey; Efficiency; Highly Influential')
  assert.equal(row.highlyInfluential, 'true')
})

test('creates one BibTeX entry per paper', () => {
  const bibtex = toBibtex([
    makePaper({ title: 'First Paper' }),
    makePaper({ id: 2, title: 'Second Paper' }),
  ])

  assert.equal((bibtex.match(/^@\w+\{/gm) ?? []).length, 2)
})

test('uses stable sanitized BibTeX keys and resolves collisions deterministically', () => {
  const papers = [
    makePaper({
      id: 1,
      title: 'The Graph Theory of Ranking',
      authors: 'Jane Doe, Bob Jones',
      year: 2023,
    }),
    makePaper({
      id: 2,
      title: 'Graph Systems in Practice',
      authors: 'Jane Doe, Alice Brown',
      year: 2023,
    }),
  ]

  const firstPass = toBibtex(papers)
  const secondPass = toBibtex(papers)

  assert.equal(firstPass, secondPass)
  assert.ok(firstPass.includes('@inproceedings{Doe2023Graph,'))
  assert.ok(firstPass.includes('@inproceedings{Doe2023Grapha,'))
})

test('uses sensible BibTeX fallback entry types', () => {
  const bibtex = toBibtex([
    makePaper({ venue: 'ACM Computing Surveys' }),
    makePaper({ id: 2, venue: 'NeurIPS' }),
    makePaper({ id: 3, venue: 'arXiv', doi: undefined, url: undefined }),
  ])

  assert.ok(bibtex.includes('@article{'))
  assert.ok(bibtex.includes('@inproceedings{'))
  assert.ok(bibtex.includes('@misc{'))
})

test('omits absent or oversized BibTeX fields cleanly', () => {
  const bibtex = toBibtex([
    makePaper({
      year: 0,
      doi: undefined,
      url: undefined,
      abstract: 'x'.repeat(1001),
      venue: 'arXiv',
    }),
  ])

  assert.ok(!bibtex.includes('undefined'))
  assert.ok(!bibtex.includes('null'))
  assert.ok(!bibtex.includes('year = {0}'))
  assert.ok(!bibtex.includes('doi = {}'))
  assert.ok(!bibtex.includes('url = {}'))
  assert.ok(!bibtex.includes('abstract = {'))
})

test('formats deterministic local-date export filenames', () => {
  const date = new Date(2026, 3, 20)
  assert.equal(getExportDateStamp(date), '2026-04-20')
})
