import React from 'react'

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`shimmer rounded-lg ${className}`}
      style={{ background: undefined }}
    />
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 border border-[var(--line)] flex flex-col gap-3"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="flex items-start gap-4">
        <SkeletonBlock className="w-8 h-8 rounded-lg flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-4/5" />
          <SkeletonBlock className="h-3.5 w-2/5" />
        </div>
        <SkeletonBlock className="w-12 h-10 rounded-xl flex-shrink-0" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-24 rounded-full" />
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
      <SkeletonBlock className="h-14 w-full" />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <SkeletonBlock className="h-5 w-16 rounded-full" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonResults() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonSeedCard() {
  return (
    <div
      className="rounded-2xl p-6 border border-[var(--line)]"
      style={{ background: 'var(--bg-1)' }}
    >
      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <SkeletonBlock className="h-3.5 w-1/4" />
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-4 w-2/4" />
          <SkeletonBlock className="h-16 w-full" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <SkeletonBlock className="h-16 w-24 rounded-xl" />
          <div className="flex flex-col gap-1.5 w-40">
            <SkeletonBlock className="h-7 rounded-full" />
            <SkeletonBlock className="h-7 rounded-full" />
            <SkeletonBlock className="h-7 rounded-full" />
            <SkeletonBlock className="h-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
