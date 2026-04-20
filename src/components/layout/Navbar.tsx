import React, { useState, useEffect } from 'react'
import { LogoIcon, SearchIcon, SlidersIcon, SunIcon, MoonIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'
import { MethodologyModal } from '../modals/MethodologyModal'
import { DocsModal } from '../modals/DocsModal'
import { ChangelogModal } from '../modals/ChangelogModal'

function StarButton() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/kishormorol/CiteLens')
      .then((r) => r.json())
      .then((d) => { if (typeof d.stargazers_count === 'number') setCount(d.stargazers_count) })
      .catch(() => {})
  }, [])

  const label = count === null ? '—' : count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`

  return (
    <a
      href="https://github.com/kishormorol/CiteLens"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:flex items-center rounded-lg border border-[var(--line)] overflow-hidden text-sm transition-colors hover:border-[var(--line-2)] hover:bg-[var(--bg-2)]"
      aria-label="Star CiteLens on GitHub"
    >
      {/* Star action */}
      <span
        className="flex items-center gap-1.5 px-2.5 py-1.5 border-r border-[var(--line)]"
        style={{ color: 'var(--ink-3)' }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
        Star
      </span>
      {/* Count */}
      <span
        className="px-2 py-1.5 font-mono text-xs tabular-nums"
        style={{ color: 'var(--ink-3)', minWidth: 28, textAlign: 'center' }}
      >
        {label}
      </span>
    </a>
  )
}

type ModalKey = 'methodology' | 'docs' | 'changelog' | null

export function Navbar() {
  const { state, dispatch } = useApp()
  const { tweaks } = state
  const [modal, setModal] = useState<ModalKey>(null)

  function toggleTheme() {
    dispatch({
      type: 'SET_TWEAKS',
      payload: { theme: tweaks.theme === 'light' ? 'dark' : 'light' },
    })
  }

  function toggleTweaks() {
    dispatch({ type: 'TOGGLE_TWEAKS_PANEL' })
  }

  return (
    <>
    <header
      className="sticky top-0 z-50 border-b border-[var(--line)] backdrop-blur-md"
      style={{ background: 'color-mix(in oklab, var(--bg-1) 92%, transparent)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
        {/* Logo */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2.5 flex-shrink-0 no-underline bg-transparent border-0 cursor-pointer p-0"
        >
          <LogoIcon size={28} />
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}
          >
            CiteLens
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 ml-4">
          {([
            { label: 'Methodology', key: 'methodology' },
            { label: 'Docs', key: 'docs' },
            { label: 'Changelog', key: 'changelog' },
          ] as { label: string; key: ModalKey }[]).map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setModal(key)}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--ink-3)' }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search affordance */}
          <button
            onClick={() => window.dispatchEvent(new Event('citelens:focus-search'))}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--line)] text-sm transition-colors hover:bg-[var(--bg-2)]"
            style={{ color: 'var(--ink-4)' }}
          >
            <SearchIcon size={13} />
            <span>Search</span>
            <kbd
              className="px-1 py-0.5 text-[10px] rounded font-mono border border-[var(--line-2)]"
              style={{ background: 'var(--bg-2)', color: 'var(--ink-4)' }}
            >
              ⌘K
            </kbd>
          </button>

          {/* GitHub star */}
          <StarButton />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={tweaks.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="p-2 rounded-lg border border-[var(--line)] transition-colors hover:bg-[var(--bg-2)]"
            style={{ color: 'var(--ink-3)' }}
          >
            {tweaks.theme === 'light' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
          </button>

          {/* Tweaks button */}
          <button
            onClick={toggleTweaks}
            aria-label="Open tweaks panel"
            aria-expanded={state.tweaksPanelOpen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              state.tweaksPanelOpen
                ? 'bg-[var(--accent-weak)] text-[var(--accent-ink)] border-[var(--accent-line)]'
                : 'border-[var(--line)] text-[var(--ink-3)] hover:bg-[var(--bg-2)]'
            }`}
          >
            <SlidersIcon size={14} />
            <span className="hidden sm:inline">Tweaks</span>
          </button>
        </div>
      </div>
    </header>

    <MethodologyModal open={modal === 'methodology'} onClose={() => setModal(null)} />
    <DocsModal open={modal === 'docs'} onClose={() => setModal(null)} />
    <ChangelogModal open={modal === 'changelog'} onClose={() => setModal(null)} />
    </>
  )
}
