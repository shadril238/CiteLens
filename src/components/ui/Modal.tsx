import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center"
      style={{ background: 'oklch(0% 0 0 / 0.45)', backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '2rem 1rem' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[var(--line)] shadow-[var(--shadow-lg)]"
        style={{ background: 'var(--bg-1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]"
          style={{ background: 'var(--bg-2)', borderRadius: '1rem 1rem 0 0' }}
        >
          <h2
            className="text-xl"
            style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: 'var(--ink)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-3)]"
            style={{ color: 'var(--ink-4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
