import React, { useEffect, useRef } from 'react'
import { XIcon } from '../ui/Icons'
import { useApp } from '../../context/AppContext'
import type { LayoutMode, DensityMode, ReasoningTone, AccentColor } from '../../types'
import { ACCENTS } from '../../data/mockData'

const ACCENT_COLORS: { value: AccentColor; label: string; preview: string }[] = [
  { value: 'indigo',   label: 'Indigo',   preview: 'oklch(52% 0.18 275)' },
  { value: 'teal',     label: 'Teal',     preview: 'oklch(55% 0.12 195)' },
  { value: 'plum',     label: 'Plum',     preview: 'oklch(50% 0.16 330)' },
  { value: 'forest',   label: 'Forest',   preview: 'oklch(50% 0.1 155)'  },
  { value: 'graphite', label: 'Graphite', preview: 'oklch(30% 0.01 270)' },
]

type ButtonGroupOption<T> = { value: T; label: string }

function ButtonGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: ButtonGroupOption<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-4)' }}>
        {label}
      </span>
      <div
        className="flex rounded-xl overflow-hidden border border-[var(--line)]"
        style={{ background: 'var(--bg-2)' }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2.5 py-2 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'text-[var(--accent-ink)] bg-[var(--accent-weak)]'
                : 'text-[var(--ink-3)] hover:bg-[var(--bg-3)] hover:text-[var(--ink-2)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TweaksPanel() {
  const { state, dispatch } = useApp()
  const { tweaks, tweaksPanelOpen } = state
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!tweaksPanelOpen) return
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        dispatch({ type: 'CLOSE_TWEAKS_PANEL' })
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [tweaksPanelOpen, dispatch])

  if (!tweaksPanelOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-6 z-50 w-72 rounded-2xl border border-[var(--line)] flex flex-col overflow-hidden"
      style={{
        background: 'var(--bg-1)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)]"
        style={{ background: 'var(--bg-2)' }}
      >
        <div>
          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Tweaks
          </span>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-4)' }}>
            Personalize your CiteLens experience
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'CLOSE_TWEAKS_PANEL' })}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-3)] transition-colors"
          style={{ color: 'var(--ink-3)' }}
        >
          <XIcon size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
        {/* Layout */}
        <ButtonGroup<LayoutMode>
          label="Layout"
          value={tweaks.layout}
          onChange={(v) => dispatch({ type: 'SET_TWEAKS', payload: { layout: v } })}
          options={[
            { value: 'focus',  label: 'Focus'  },
            { value: 'split',  label: 'Split'  },
            { value: 'stream', label: 'Stream' },
          ]}
        />

        {/* Theme */}
        <ButtonGroup<'light' | 'dark'>
          label="Theme"
          value={tweaks.theme}
          onChange={(v) => dispatch({ type: 'SET_TWEAKS', payload: { theme: v } })}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark',  label: 'Dark'  },
          ]}
        />

        {/* Accent */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-4)' }}>
            Accent color
          </span>
          <div className="flex items-center gap-2">
            {ACCENT_COLORS.map((ac) => (
              <button
                key={ac.value}
                onClick={() => dispatch({ type: 'SET_TWEAKS', payload: { accent: ac.value } })}
                title={ac.label}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ background: ac.preview }}
              >
                {tweaks.accent === ac.value && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Density */}
        <ButtonGroup<DensityMode>
          label="Density"
          value={tweaks.density}
          onChange={(v) => dispatch({ type: 'SET_TWEAKS', payload: { density: v } })}
          options={[
            { value: 'cozy',    label: 'Cozy'    },
            { value: 'compact', label: 'Compact' },
          ]}
        />

        {/* Reasoning tone */}
        <ButtonGroup<ReasoningTone>
          label="Reasoning tone"
          value={tweaks.reasoningTone}
          onChange={(v) => dispatch({ type: 'SET_TWEAKS', payload: { reasoningTone: v } })}
          options={[
            { value: 'accented', label: 'Accented' },
            { value: 'plain',    label: 'Plain'    },
          ]}
        />

        {/* Preview swatch */}
        <div
          className="rounded-xl p-3 border border-[var(--accent-line)]"
          style={{ background: 'var(--accent-weak)' }}
        >
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--accent-ink)' }}>
            Preview — current accent
          </div>
          <div
            className="h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
        </div>
      </div>
    </div>
  )
}

// Helper: compute CSS variables for the current accent + theme
export function getAccentVars(accent: AccentColor, theme: 'light' | 'dark'): React.CSSProperties {
  const tokens = ACCENTS[accent][theme === 'dark' ? 'd' : 'l']
  return {
    '--accent':      tokens.a,
    '--accent-ink':  tokens.i,
    '--accent-weak': tokens.w,
    '--accent-line': tokens.ln,
    '--network':     tokens.a,
    '--network-weak': tokens.w,
  } as React.CSSProperties
}
