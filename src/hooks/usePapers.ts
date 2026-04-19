import { useMemo } from 'react'
import { PAPERS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import type { Paper } from '../types'

export function usePapers(): Paper[] {
  const { state } = useApp()
  const { filters, analyzeMode } = state

  return useMemo(() => {
    let papers = [...PAPERS]

    // Filter by year
    papers = papers.filter(
      (p) => p.year >= filters.yearFrom && p.year <= filters.yearTo
    )

    // Filter by relevance threshold
    if (filters.relevanceThreshold > 0) {
      papers = papers.filter((p) => p.relevance >= filters.relevanceThreshold)
    }

    // Filter by highly influential
    if (filters.highlyInfluential) {
      papers = papers.filter((p) => p.badges.includes('Highly Influential'))
    }

    // Filter by review only
    if (filters.reviewOnly) {
      papers = papers.filter((p) => p.review)
    }

    // Sort by mode
    switch (analyzeMode) {
      case 'influential':
        papers.sort((a, b) => b.final - a.final)
        break
      case 'relevant':
        papers.sort((a, b) => b.relevance - a.relevance)
        break
      case 'recent':
        papers.sort((a, b) => b.year - a.year || b.final - a.final)
        break
      case 'reviews':
        papers = papers.filter((p) => p.review)
        papers.sort((a, b) => b.final - a.final)
        break
    }

    return papers
  }, [filters, analyzeMode])
}
