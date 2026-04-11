'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import type { NumerologyResult } from '@/lib/numerology'
import { Calendar, Target, ShieldAlert, Star } from 'lucide-react'

const SLATE = '#7a8b9d'   // dusty blue
const MAUVE = '#a8879d'   // magician
const ROSE = '#9d7a7a'    // brick rose
const SAGE = '#8b9d87'    // sage green

export default function ActionPlan({ result }: { result: NumerologyResult }) {
  const py = result.personalDay.year
  const pm = result.personalDay.month

  const yearInterp = INTERPRETATIONS[py]
  const monthInterp = INTERPRETATIONS[pm]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: MAUVE }}>
          <Calendar size={16} />
          Your Action Plan
        </h3>
        <p className="text-slate-400 text-xs italic">Personal alignment and immediate opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* YEAR FOCUS */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                 style={{ background: `${SLATE}18`, borderColor: `${SLATE}40` }}>
              <Target size={24} style={{ color: SLATE }} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Year Focus</h4>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: SLATE }}>Major Cycle: {py}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[9px] font-black uppercase text-slate-500 block mb-2 tracking-widest">Theme: {yearInterp?.archetype}</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">&quot;{yearInterp?.meaning}&quot;</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase block tracking-widest" style={{ color: SAGE }}>Immediate Opportunities:</span>
              <p className="text-xs text-slate-200 font-bold">{yearInterp?.career}</p>
            </div>
          </div>
        </div>

        {/* MONTH FOCUS */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                 style={{ background: `${MAUVE}18`, borderColor: `${MAUVE}40` }}>
              <Star size={24} style={{ color: MAUVE }} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Month Focus</h4>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: MAUVE }}>Monthly Vibration: {pm}</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[9px] font-black uppercase text-slate-500 block mb-2 tracking-widest">Actionable:</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">{monthInterp?.advice}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase block tracking-widest" style={{ color: MAUVE }}>Meme for Success:</span>
              <p className="text-xs text-slate-200 font-bold">{monthInterp?.positive[0]} & {monthInterp?.positive[1]}</p>
            </div>
          </div>
        </div>

        {/* ERRORS TO AVOID */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                 style={{ background: `${ROSE}18`, borderColor: `${ROSE}40` }}>
              <ShieldAlert size={24} style={{ color: ROSE }} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Shadow Side</h4>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: ROSE }}>Errors to avoid</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium leading-relaxed" style={{ color: `${ROSE}dd` }}>
              During this Personal Year {py}, watch out for these low-vibration tendencies:
            </p>
            <div className="flex flex-wrap gap-2">
              {yearInterp?.shadow.map((s, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border"
                      style={{ background: `${ROSE}0d`, borderColor: `${ROSE}20`, color: `${ROSE}dd` }}>
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
               <p className="text-[10px] text-slate-400 italic">&quot;Remember: The shadow is just the light in waiting.&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
