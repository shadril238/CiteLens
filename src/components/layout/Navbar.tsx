import React from 'react'
import { LogoIcon, SearchIcon, SlidersIcon, SunIcon, MoonIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'

export function Navbar() {
  const { state, dispatch } = useApp()
  const { tweaks } = state

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
    <header
      className="sticky top-0 z-50 border-b border-[var(--line)] backdrop-blur-md"
      style={{ background: 'oklch(from var(--bg-1) l c h / 0.92)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
          <LogoIcon size={28} />
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}
          >
            CiteLens
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 ml-4">
          {['Methodology', 'Docs', 'Changelog'].map((link) => (
            <a
              key={link}
              href="#"
              className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:bg-[var(--bg-2)]"
              style={{ color: 'var(--ink-3)' }}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search affordance */}
          <button
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--line)] transition-colors hover:bg-[var(--bg-2)]"
            style={{ color: 'var(--ink-3)' }}
            title={tweaks.theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          >
            {tweaks.theme === 'light' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
          </button>

          {/* Tweaks button */}
          <button
            onClick={toggleTweaks}
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
  )
}
