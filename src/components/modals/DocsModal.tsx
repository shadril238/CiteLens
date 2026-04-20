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

function CodeChip({ children }: { children: string }) {
  return (
    <code
      className="px-2 py-0.5 rounded text-xs font-mono"
      style={{ background: 'var(--bg-3)', color: 'var(--accent-ink)' }}
    >
      {children}
    </code>
  )
}

export function DocsModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="How to use CiteLens">
      <div className="flex flex-col gap-6">

        <Section title="Supported input formats">
          <div className="flex flex-col gap-2">
            {[
              {
                label: 'arXiv ID',
                example: '1706.03762',
                tip: 'The numeric ID from an arXiv paper URL.',
              },
              {
                label: 'arXiv URL',
                example: 'https://arxiv.org/abs/1706.03762',
                tip: 'Full arXiv abstract or PDF URL.',
              },
              {
                label: 'DOI',
                example: '10.1145/3292500.3330701',
                tip: 'Bare DOI starting with 10.',
              },
              {
                label: 'DOI URL',
                example: 'https://doi.org/10.1145/3292500.3330701',
                tip: 'Full doi.org link.',
              },
              {
                label: 'Semantic Scholar URL',
                example: 'https://semanticscholar.org/paper/...',
                tip: 'Direct link to a Semantic Scholar paper page.',
              },
              {
                label: 'Paper title',
                example: 'Attention Is All You Need',
                tip: 'Fuzzy title search — less reliable for obscure papers. Use an ID when possible.',
              },
            ].map(({ label, example, tip }) => (
              <div
                key={label}
                className="rounded-xl border border-[var(--line)] p-3 flex flex-col gap-1"
                style={{ background: 'var(--bg-2)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--ink-2)' }}>{label}</span>
                </div>
                <CodeChip>{example}</CodeChip>
                <p className="text-xs" style={{ color: 'var(--ink-4)' }}>{tip}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Understanding scores">
          <div className="flex flex-col gap-2">
            {[
              { label: 'Impact', color: 'var(--impact)', desc: 'Citation-based importance. A score of 80+ means this paper is highly cited within its field relative to peers.' },
              { label: 'Network', color: 'var(--network)', desc: 'Centrality in the local citation graph. High network score = frequently co-cited with other important papers.' },
              { label: 'Relevance', color: 'var(--relevance)', desc: 'Textual similarity to your seed paper. High relevance = the paper closely relates to the same topic.' },
              { label: 'Context', color: 'var(--context)', desc: 'Citation influence signal. High context = Semantic Scholar flagged this as an influential citation of your seed.' },
              { label: 'Final', color: 'var(--accent)', desc: 'Weighted combination of all four scores. Default weights: Impact 45%, Network 25%, Relevance 20%, Context 10%.' },
            ].map(({ label, color, desc }) => (
              <div key={label} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
                  style={{ background: color }}
                />
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--ink-2)' }}>{label} — </span>
                  <span className="text-sm" style={{ color: 'var(--ink-3)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Views">
          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--ink-3)' }}>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Ranked</span> — default view. Papers sorted by final score with expandable score breakdowns and abstract.</p>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Timeline</span> — bar chart of citation activity by year with year-over-year growth.</p>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Network</span> — force-directed graph. Nodes animate outward from the seed on load. Node size = citation count, color = score tier, distance from seed ≈ relevance. Drag any node to reposition; hover to preview; click to open a score breakdown panel.</p>
          </div>
        </Section>

        <Section title="Filters & sorting">
          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--ink-3)' }}>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Publication year</span> — slide both handles to narrow results to a specific time window.</p>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Relevance threshold</span> — hide papers below a minimum relevance score (0 = show all).</p>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Highly influential only</span> — show only papers flagged as influential citations by Semantic Scholar.</p>
            <p><span className="font-medium" style={{ color: 'var(--ink-2)' }}>Review papers only</span> — show only survey and review articles.</p>
          </div>
        </Section>

        <Section title="Tips">
          <ul className="flex flex-col gap-1.5">
            {[
              'Use an arXiv ID or DOI for the most reliable results — title search can fail for obscure papers.',
              'Switch to Timeline tab to see how citation activity has grown year-over-year.',
              'Switch to Network tab to explore the citation landscape spatially — drag nodes to rearrange.',
              'Use the Tweaks panel to change layout, theme, accent colour, and display density.',
              'Click any paper row to expand it and see the full score breakdown and abstract.',
            ].map((tip) => (
              <li key={tip} className="flex gap-2 text-sm items-start" style={{ color: 'var(--ink-3)' }}>
                <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }} />
                {tip}
              </li>
            ))}
          </ul>
        </Section>

      </div>
    </Modal>
  )
}
