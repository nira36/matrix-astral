'use client'

import React, { useState, useMemo } from 'react'
import { calcAllGematria, letterBreakdown, SYSTEM_LABELS } from '@/lib/gematria'
import type { GematriaSystem } from '@/lib/gematria'

const SYSTEMS: GematriaSystem[] = ['pythagorean', 'simple', 'chaldean']

const SYSTEM_COLORS: Record<GematriaSystem, { text: string; bg: string; border: string }> = {
  pythagorean: { text: 'text-violet-400', bg: 'bg-violet-500/[0.06]', border: 'border-violet-500/20' },
  simple:      { text: 'text-sky-400',    bg: 'bg-sky-500/[0.06]',    border: 'border-sky-500/20' },
  chaldean:    { text: 'text-amber-400',  bg: 'bg-amber-500/[0.06]',  border: 'border-amber-500/20' },
}

export default function GematriaCalculator() {
  const [input, setInput] = useState('')
  const [activeSystem, setActiveSystem] = useState<GematriaSystem>('pythagorean')

  const results = useMemo(() => input.trim() ? calcAllGematria(input) : [], [input])
  const breakdown = useMemo(
    () => input.trim() ? letterBreakdown(input, activeSystem) : [],
    [input, activeSystem]
  )
  const activeResult = results.find(r => r.system === activeSystem)

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black tracking-widest uppercase text-slate-500">
          Word, Name, or Phrase
        </label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. LOVE, PEACE, your name…"
          className="w-full bg-[#1f2937] border border-white/[0.08] rounded-xl
                     px-4 py-3 text-white placeholder-slate-600 text-sm outline-none
                     transition-all duration-200
                     focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
        />
      </div>

      {results.length > 0 && (
        <>
          {/* System tabs */}
          <div className="flex gap-2 flex-wrap">
            {SYSTEMS.map(s => {
              const c = SYSTEM_COLORS[s]
              const isActive = s === activeSystem
              return (
                <button
                  key={s}
                  onClick={() => setActiveSystem(s)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase
                             border transition-all duration-150 ${c.border}
                             ${isActive ? `${c.bg} ${c.text}` : 'bg-transparent text-slate-500 hover:text-slate-400'}`}
                >
                  {SYSTEM_LABELS[s].label}
                </button>
              )
            })}
          </div>

          {/* Three results summary */}
          <div className="grid grid-cols-3 gap-3">
            {results.map(r => {
              const c = SYSTEM_COLORS[r.system]
              return (
                <div
                  key={r.system}
                  onClick={() => setActiveSystem(r.system)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border cursor-pointer
                             transition-all duration-150 ${c.border}
                             ${r.system === activeSystem ? c.bg : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  <p className={`text-[9px] font-black tracking-widest uppercase ${c.text}`}>
                    {SYSTEM_LABELS[r.system].label}
                  </p>
                  <p className={`text-3xl font-black ${c.text}`}>{r.reduced}</p>
                  <p className="text-[9px] text-slate-600">raw: {r.raw}</p>
                </div>
              )
            })}
          </div>

          {/* System description */}
          <p className="text-[11px] text-slate-500 italic">
            {SYSTEM_LABELS[activeSystem].description}
          </p>

          {/* Letter breakdown */}
          {breakdown.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">
                Letter Breakdown · {SYSTEM_LABELS[activeSystem].label}
              </p>
              <div className="flex flex-wrap gap-2">
                {breakdown.map((lb, i) => {
                  const c = SYSTEM_COLORS[activeSystem]
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center px-2.5 py-2 rounded-xl border ${c.border} ${c.bg} min-w-[40px]`}
                    >
                      <span className={`text-base font-black ${c.text}`}>{lb.letter}</span>
                      <span className="text-[9px] text-slate-500">{lb.value}</span>
                    </div>
                  )
                })}
              </div>
              {activeResult && (
                <div className="flex items-baseline gap-3 pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] text-slate-500">Sum:</span>
                  <span className={`text-2xl font-black ${SYSTEM_COLORS[activeSystem].text}`}>{activeResult.raw}</span>
                  <span className="text-slate-600 text-sm">→</span>
                  <span className={`text-3xl font-black ${SYSTEM_COLORS[activeSystem].text}`}>{activeResult.reduced}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
