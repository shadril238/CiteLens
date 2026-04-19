import React from 'react'

type RecipeType = 'impact' | 'network' | 'relevance' | 'context'

interface RecipePill {
  type: RecipeType
  weight: string
  score: number
}

const RECIPE_CONFIG: Record<RecipeType, { label: string; color: string; bg: string }> = {
  impact:    { label: 'Impact',    color: 'var(--impact)',    bg: 'var(--impact-weak)'    },
  network:   { label: 'Network',   color: 'var(--network)',   bg: 'var(--network-weak)'   },
  relevance: { label: 'Relevance', color: 'var(--relevance)', bg: 'var(--relevance-weak)' },
  context:   { label: 'Context',   color: 'var(--context)',   bg: 'var(--context-weak)'   },
}

export const RECIPE_PILLS: RecipePill[] = [
  { type: 'impact',    weight: '30%', score: 0 },
  { type: 'network',   weight: '30%', score: 0 },
  { type: 'relevance', weight: '25%', score: 0 },
  { type: 'context',   weight: '15%', score: 0 },
]

interface RecipeRowProps {
  impact: number
  network: number
  relevance: number
  context: number
  final: number
}

export function RecipeRow({ impact, network, relevance, context, final }: RecipeRowProps) {
  const pills: RecipePill[] = [
    { type: 'impact',    weight: '30%', score: impact    },
    { type: 'network',   weight: '30%', score: network   },
    { type: 'relevance', weight: '25%', score: relevance },
    { type: 'context',   weight: '15%', score: context   },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill, i) => {
        const cfg = RECIPE_CONFIG[pill.type]
        return (
          <React.Fragment key={pill.type}>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              <span>{cfg.label}</span>
              <span className="font-mono opacity-70">{pill.score}</span>
              <span className="opacity-50">×{pill.weight}</span>
            </div>
            {i < pills.length - 1 && (
              <span className="text-[var(--ink-5)] text-xs">+</span>
            )}
          </React.Fragment>
        )
      })}
      <span className="text-[var(--ink-5)] text-xs">=</span>
      <span
        className="px-2.5 py-1.5 rounded-full text-xs font-mono font-semibold"
        style={{ background: 'var(--accent-weak)', color: 'var(--accent-ink)' }}
      >
        {final}/100
      </span>
    </div>
  )
}
