import React from 'react'

interface BadgeProps {
  label: string
  variant?: 'default' | 'accent' | 'impact' | 'network' | 'relevance' | 'context' | 'review' | 'ghost'
  size?: 'sm' | 'xs'
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full border'
  const sizeClass = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px] leading-none gap-1'
    : 'px-2 py-0.5 text-[11px] leading-none gap-1'

  const variantStyles: Record<string, string> = {
    default: 'bg-[var(--bg-2)] text-[var(--ink-3)] border-[var(--line)]',
    accent: 'bg-[var(--accent-weak)] text-[var(--accent-ink)] border-[var(--accent-line)]',
    impact: 'bg-[var(--impact-weak)] text-[var(--impact)] border-[var(--impact-weak)]',
    network: 'bg-[var(--network-weak)] text-[var(--network)] border-[var(--network-weak)]',
    relevance: 'bg-[var(--relevance-weak)] text-[var(--relevance)] border-[var(--relevance-weak)]',
    context: 'bg-[var(--context-weak)] text-[var(--context)] border-[var(--context-weak)]',
    review: 'bg-[var(--impact-weak)] text-[var(--impact)] border-[var(--impact-weak)]',
    ghost: 'bg-transparent text-[var(--ink-4)] border-[var(--line)]',
  }

  return (
    <span className={`${base} ${sizeClass} ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
