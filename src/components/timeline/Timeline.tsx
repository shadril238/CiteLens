import React from 'react'
import { TIMELINE_DATA } from '../../data/mockData'

export function Timeline() {
  const maxCount = Math.max(...TIMELINE_DATA.map((d) => d.count))
  const total = TIMELINE_DATA.reduce((s, d) => s + d.count, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div
        className="rounded-2xl border border-[var(--line)] p-5"
        style={{ background: 'var(--bg-1)' }}
      >
        <div className="flex flex-wrap gap-6 mb-6">
          <div>
            <div
              className="text-3xl font-mono font-semibold leading-none"
              style={{ color: 'var(--accent)' }}
            >
              {total.toLocaleString()}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>
              total citing papers
            </div>
          </div>
          <div>
            <div
              className="text-3xl font-mono font-semibold leading-none"
              style={{ color: 'var(--impact)' }}
            >
              {TIMELINE_DATA[TIMELINE_DATA.length - 2].count.toLocaleString()}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>
              citations in 2023
            </div>
          </div>
          <div>
            <div
              className="text-3xl font-mono font-semibold leading-none"
              style={{ color: 'var(--relevance)' }}
            >
              +{Math.round(
                ((TIMELINE_DATA[TIMELINE_DATA.length - 2].count /
                  TIMELINE_DATA[TIMELINE_DATA.length - 3].count) - 1) * 100
              )}%
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--ink-4)' }}>
              YoY growth (22→23)
            </div>
          </div>
        </div>

        {/* Arc visualization */}
        <div className="relative">
          <svg
            viewBox="0 0 700 180"
            className="w-full overflow-visible"
            style={{ height: '180px' }}
          >
            {/* Horizontal axis */}
            <line
              x1="20"
              y1="90"
              x2="680"
              y2="90"
              stroke="var(--line-2)"
              strokeWidth="1"
            />

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <line
                key={pct}
                x1="20"
                y1={90 - (pct / 100) * 75}
                x2="680"
                y2={90 - (pct / 100) * 75}
                stroke="var(--line)"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Compute points */}
            {(() => {
              const n = TIMELINE_DATA.length
              const pts = TIMELINE_DATA.map((d, i) => {
                const x = 20 + (i / (n - 1)) * 660
                const y = 90 - (d.count / maxCount) * 72
                return { x, y, d }
              })

              const pathD = pts
                .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                .join(' ')

              const areaD =
                pathD +
                ` L ${pts[pts.length - 1].x} 90 L ${pts[0].x} 90 Z`

              return (
                <>
                  {/* Area */}
                  <path d={areaD} fill="url(#areaGrad)" />

                  {/* Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points */}
                  {pts.map(({ x, y, d }, i) => (
                    <g key={d.year}>
                      {/* Point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="var(--bg-1)"
                        stroke="var(--accent)"
                        strokeWidth="2"
                      />

                      {/* Year label */}
                      <text
                        x={x}
                        y={90 + 14}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                        fill="var(--ink-4)"
                      >
                        {d.year}
                      </text>

                      {/* Count label (alternating above/below axis) */}
                      <text
                        x={x}
                        y={i % 2 === 0 ? y - 10 : y - 10}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="600"
                        fill="var(--ink-3)"
                      >
                        {d.count >= 1000
                          ? `${(d.count / 1000).toFixed(0)}K`
                          : d.count}
                      </text>
                    </g>
                  ))}
                </>
              )
            })()}
          </svg>
        </div>
      </div>

      {/* Notable events */}
      <div
        className="rounded-2xl border border-[var(--line)] p-5"
        style={{ background: 'var(--bg-1)' }}
      >
        <h3
          className="text-base mb-4"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: 'var(--ink)' }}
        >
          Milestone citations
        </h3>
        <div className="flex flex-col gap-3">
          {TIMELINE_DATA.map((d) => (
            <div key={d.year} className="flex items-center gap-4">
              <span
                className="font-mono font-medium w-10 flex-shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                {d.year}
              </span>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'var(--bg-3)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(d.count / maxCount) * 100}%`,
                    background: 'var(--accent)',
                    opacity: 0.75,
                  }}
                />
              </div>
              <span
                className="font-mono text-xs w-14 text-right flex-shrink-0"
                style={{ color: 'var(--ink-3)' }}
              >
                {d.count.toLocaleString()}
              </span>
              <span
                className="text-xs flex-shrink-0 hidden sm:block"
                style={{ color: 'var(--ink-4)', maxWidth: '14rem' }}
              >
                {d.notable}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
