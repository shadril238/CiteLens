import React from 'react'

interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  active?: boolean
  size?: 'sm' | 'md'
}

export function GhostButton({ children, active = false, size = 'md', className = '', ...props }: GhostButtonProps) {
  const sizeClass = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs'
    : 'px-3 py-2 text-sm'

  return (
    <button
      {...props}
      className={`
        inline-flex items-center gap-1.5 rounded-lg font-medium border transition-colors
        ${sizeClass}
        ${active
          ? 'bg-[var(--accent-weak)] text-[var(--accent-ink)] border-[var(--accent-line)]'
          : 'bg-transparent text-[var(--ink-3)] border-[var(--line)] hover:bg-[var(--bg-2)] hover:text-[var(--ink-2)] hover:border-[var(--line-2)]'
        }
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}
