import React from 'react'

type SignalType = 'impact' | 'network' | 'relevance' | 'context'

interface MetricProps {
  type: SignalType
  score: number
  label: string
  description?: string
  showBar?: boolean
  size?: 'sm' | 'md'
}

const SIGNAL_CONFIG: Record<SignalType, { label: string; color: string; bg: string }> = {
  impact: { label: 'Impact', color: 'var(--impact)', bg: 'var(--impact-weak)' },
  network: { label: 'Network', color: 'var(--network)', bg: 'var(--network-weak)' },
  relevance: { label: 'Relevance', color: 'var(--relevance)', bg: 'var(--relevance-weak)' },
  context: { label: 'Context', color: 'var(--context)', bg: 'var(--context-weak)' },
}

export function Metric({ type, score, label, description, showBar = true, size = 'md' }: MetricProps) {
  const config = SIGNAL_CONFIG[type]

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: config.color }}
        />
        <span className="text-xs text-[var(--ink-3)] flex-shrink-0">{label}</span>
        {showBar && (
          <div className="flex-1 h-1 rounded-full overflow-hidden min-w-[3rem]" style={{ background: config.bg }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${score}%`, background: config.color }}
            />
          </div>
        )}
        <span className="text-xs font-mono font-medium flex-shrink-0" style={{ color: config.color }}>
          {score}
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: config.bg }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: config.color }}
          />
          <span className="text-xs font-medium" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
        <span
          className="text-lg font-mono font-medium leading-none"
          style={{ color: config.color }}
        >
          {score}
        </span>
      </div>
      {showBar && (
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `color-mix(in oklch, ${config.color} 20%, transparent)` }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${score}%`, background: config.color }}
          />
        </div>
      )}
      {description && (
        <p className="text-xs leading-relaxed text-[var(--ink-3)]">{description}</p>
      )}
    </div>
  )
}

interface SignalBarsProps {
  impact: number
  network: number
  relevance: number
  context: number
}

export function SignalBars({ impact, network, relevance, context }: SignalBarsProps) {
  const signals: [SignalType, number][] = [
    ['impact', impact],
    ['network', network],
    ['relevance', relevance],
    ['context', context],
  ]

  return (
    <div className="flex items-end gap-0.5 h-6">
      {signals.map(([type, score]) => {
        const config = SIGNAL_CONFIG[type]
        const heightPct = Math.max(20, score)
        return (
          <div
            key={type}
            className="flex-1 rounded-sm"
            title={`${config.label}: ${score}`}
            style={{
              height: `${heightPct * 0.24}px`,
              maxHeight: '100%',
              background: config.color,
              opacity: 0.85,
            }}
          />
        )
      })}
    </div>
  )
}
