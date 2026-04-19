import React from 'react'
import type { Paper } from '../../types'
import { Badge } from '../ui/Badge'
import { Metric, RecipeRow } from '../ui/index'
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'

function ScoreCircle({ score }: { score: number }) {
  const radius = 20
  const circ = 2 * Math.PI * radius
  const dash = (score / 100) * circ
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="var(--bg-3)"
          strokeWidth="3.5"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 26 26)"
        />
        <text
          x="26"
          y="26"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          fontFamily="JetBrains Mono, monospace"
          fill="var(--accent)"
        >
          {score}
        </text>
      </svg>
      <span className="text-[9px] font-medium uppercase tracking-wide" style={{ color: 'var(--ink-5)' }}>
        score
      </span>
    </div>
  )
}

interface PaperFocusProps {
  paper: Paper
  rank: number
}

export function PaperFocus({ paper, rank }: PaperFocusProps) {
  const { state, dispatch } = useApp()
  const isExpanded = state.expandedIds.has(paper.id)
  const tone = state.tweaks.reasoningTone

  function toggleExpand() {
    dispatch({ type: 'TOGGLE_EXPANDED', payload: paper.id })
  }

  return (
    <article
      className="rounded-2xl border border-[var(--line)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
      style={{ background: 'var(--bg-1)' }}
    >
      {/* Main content */}
      <div className="p-5 flex gap-4">
        {/* Rank numeral */}
        <div className="flex-shrink-0 w-8 flex flex-col items-center pt-0.5">
          <span
            className="text-2xl font-mono font-semibold leading-none"
            style={{ color: 'var(--ink-5)' }}
          >
            {rank}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5">
            {paper.badges.map((b) => (
              <Badge
                key={b}
                label={b}
                variant={b === 'Highly Influential' ? 'accent' : b === 'Survey' || b === 'Review' || b === 'Comprehensive' ? 'review' : 'default'}
                size="xs"
              />
            ))}
            {paper.review && <Badge label="Review" variant="review" size="xs" />}
          </div>

          {/* Title */}
          <h3
            className="text-base sm:text-lg leading-snug"
            style={{
              fontFamily: 'Instrument Serif, Georgia, serif',
              color: 'var(--ink)',
            }}
          >
            {paper.title}
          </h3>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span style={{ color: 'var(--ink-3)' }}>{paper.authors}</span>
            <span style={{ color: 'var(--line-2)' }}>·</span>
            <span className="font-medium" style={{ color: 'var(--accent-ink)' }}>
              {paper.venue}
            </span>
            <span style={{ color: 'var(--line-2)' }}>·</span>
            <span style={{ color: 'var(--ink-4)' }}>{paper.year}</span>
            <span style={{ color: 'var(--line-2)' }}>·</span>
            <span style={{ color: 'var(--ink-3)' }}>
              <span className="font-mono font-medium">
                {paper.citations.toLocaleString()}
              </span>{' '}
              citations
            </span>
          </div>

          {/* "Why" callout */}
          <div
            className="rounded-lg px-4 py-3 text-sm leading-relaxed border-l-2"
            style={{
              background: 'var(--accent-weak)',
              borderLeftColor: 'var(--accent)',
              color: tone === 'accented' ? 'var(--accent-ink)' : 'var(--ink-2)',
            }}
          >
            {paper.why}
          </div>

          {/* Expandable: Why ranked here */}
          {isExpanded && (
            <div className="flex flex-col gap-3 pt-1">
              {/* Formula */}
              <div
                className="p-3 rounded-xl border border-[var(--line)] text-xs overflow-x-auto"
                style={{ background: 'var(--bg-2)' }}
              >
                <RecipeRow
                  impact={paper.impact}
                  network={paper.network}
                  relevance={paper.relevance}
                  context={paper.context}
                  final={paper.final}
                />
              </div>

              {/* 4 metric tiles */}
              <div className="grid grid-cols-2 gap-2">
                <Metric
                  type="impact"
                  score={paper.impact}
                  label="Impact"
                  description={paper.breakdown.impact}
                />
                <Metric
                  type="network"
                  score={paper.network}
                  label="Network"
                  description={paper.breakdown.network}
                />
                <Metric
                  type="relevance"
                  score={paper.relevance}
                  label="Relevance"
                  description={paper.breakdown.relevance}
                />
                <Metric
                  type="context"
                  score={paper.context}
                  label="Context"
                  description={paper.breakdown.context}
                />
              </div>
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <button
              onClick={toggleExpand}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-ink)' }}
            >
              {isExpanded ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
              {isExpanded ? 'Hide breakdown' : 'Why ranked here'}
            </button>

            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] text-xs font-medium transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--ink-2)' }}
            >
              Open paper
              <ExternalLinkIcon size={11} />
            </a>
          </div>
        </div>

        {/* Score circle */}
        <ScoreCircle score={paper.final} />
      </div>
    </article>
  )
}

// Re-export Metric and RecipeRow from ui/index
export { Metric, RecipeRow }
