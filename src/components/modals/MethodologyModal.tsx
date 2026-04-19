import React from 'react'
import { Modal } from '../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-4)' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function ScoreCard({
  label,
  color,
  weight,
  description,
  detail,
}: {
  label: string
  color: string
  weight: string
  description: string
  detail: string
}) {
  return (
    <div
      className="rounded-xl border border-[var(--line)] p-4 flex flex-col gap-1.5"
      style={{ background: 'var(--bg-2)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color }}>
          {label}
        </span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full border"
          style={{ color: 'var(--ink-3)', borderColor: 'var(--line)', background: 'var(--bg-1)' }}
        >
          {weight}
        </span>
      </div>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>{description}</p>
      <p className="text-xs" style={{ color: 'var(--ink-4)' }}>{detail}</p>
    </div>
  )
}

export function MethodologyModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Methodology">
      <div className="flex flex-col gap-6">

        <Section title="How CiteLens ranks papers">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-3)' }}>
            CiteLens scores every paper that cites your seed paper across four dimensions,
            then combines them into a single final score. Each dimension captures a different
            angle of importance.
          </p>
        </Section>

        <Section title="Scoring dimensions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ScoreCard
              label="Impact"
              color="var(--impact)"
              weight="35%"
              description="How widely cited is this paper?"
              detail="Uses citation count, OpenAlex FWCI (field-weighted citation impact), and citation percentile within the paper's field."
            />
            <ScoreCard
              label="Network"
              color="var(--network)"
              weight="25%"
              description="How central is this paper in the citation graph?"
              detail="PageRank computed over the local citation subgraph of all candidate papers. Papers that are co-cited frequently score higher."
            />
            <ScoreCard
              label="Relevance"
              color="var(--relevance)"
              weight="25%"
              description="How similar is this paper to the seed?"
              detail="Token-overlap similarity between the seed paper's title and abstract and the candidate's title and abstract."
            />
            <ScoreCard
              label="Context"
              color="var(--context)"
              weight="15%"
              description="How influential is this citation?"
              detail="Semantic Scholar's influential citation signal — flags papers where the citing work builds directly on the cited methodology."
            />
          </div>
        </Section>

        <Section title="Pipeline">
          <ol className="flex flex-col gap-2">
            {[
              ['Resolve', 'Parse your input (arXiv ID, DOI, URL, or title) and fetch seed paper metadata from Semantic Scholar.'],
              ['Fetch', 'Retrieve all papers that cite the seed, up to 300 candidates via the Semantic Scholar citations API.'],
              ['Enrich', 'Cross-reference with OpenAlex to add FWCI and citation percentile where available.'],
              ['Deduplicate', 'Merge duplicate records that appear across multiple sources using DOI and title matching.'],
              ['Rank', 'Score each candidate across the four dimensions and compute a weighted final score.'],
              ['Return', 'Return the top 20 results (configurable up to 100) sorted by final score.'],
            ].map(([step, desc], i) => (
              <li key={step} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center mt-0.5"
                  style={{ background: 'var(--accent-weak)', color: 'var(--accent-ink)' }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--ink-2)' }}>{step} — </span>
                  <span className="text-sm" style={{ color: 'var(--ink-3)' }}>{desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Data sources">
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Semantic Scholar', desc: 'Citation graph, influential citation signal, paper metadata' },
              { name: 'OpenAlex', desc: 'FWCI, citation percentiles, field classification' },
            ].map((s) => (
              <div
                key={s.name}
                className="flex-1 min-w-[180px] rounded-xl border border-[var(--line)] p-3"
                style={{ background: 'var(--bg-2)' }}
              >
                <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--ink-2)' }}>{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--ink-4)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </Modal>
  )
}
