import React from 'react'
import type { Paper } from '../../types'
import { Badge } from '../ui/Badge'
import { useApp } from '../../context/AppContext'

interface PaperSplitItemProps {
  paper: Paper
  rank: number
  isSelected: boolean
  onClick: () => void
}

function PaperSplitItem({ paper, rank, isSelected, onClick }: PaperSplitItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        isSelected
          ? 'border-[var(--accent-line)] bg-[var(--accent-weak)]'
          : 'border-[var(--line)] bg-[var(--bg-1)] hover:bg-[var(--bg-2)] hover:border-[var(--line-2)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-lg font-mono font-semibold leading-none mt-0.5 flex-shrink-0 w-6"
          style={{ color: isSelected ? 'var(--accent)' : 'var(--ink-5)' }}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium leading-snug line-clamp-2 mb-1.5"
            style={{
              color: isSelected ? 'var(--accent-ink)' : 'var(--ink)',
              fontFamily: 'Instrument Serif, Georgia, serif',
            }}
          >
            {paper.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--ink-4)' }}>
            <span className="font-medium" style={{ color: isSelected ? 'var(--accent-ink)' : 'var(--accent-ink)', opacity: 0.8 }}>
              {paper.venue}
            </span>
            <span>·</span>
            <span>{paper.year}</span>
            <span>·</span>
            <span className="font-mono">{paper.citations.toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {paper.badges.slice(0, 2).map((b) => (
              <Badge key={b} label={b} variant={isSelected ? 'accent' : 'default'} size="xs" />
            ))}
          </div>
        </div>
        <div
          className="flex-shrink-0 text-sm font-mono font-semibold"
          style={{ color: isSelected ? 'var(--accent)' : 'var(--ink-4)' }}
        >
          {paper.final}
        </div>
      </div>
    </button>
  )
}

interface PaperSplitListProps {
  papers: Paper[]
}

export function PaperSplitList({ papers }: PaperSplitListProps) {
  const { state, dispatch } = useApp()

  return (
    <div className="flex flex-col gap-2">
      {papers.map((paper, i) => (
        <PaperSplitItem
          key={paper.id}
          paper={paper}
          rank={i + 1}
          isSelected={state.selectedPaperId === paper.id}
          onClick={() =>
            dispatch({
              type: 'SELECT_PAPER',
              payload: state.selectedPaperId === paper.id ? null : paper.id,
            })
          }
        />
      ))}
    </div>
  )
}
