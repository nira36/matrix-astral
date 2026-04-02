'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import type { NumerologyResult } from '@/lib/numerology'
import { Calendar, Target, ShieldAlert, Star } from 'lucide-react'

export default function ActionPlan({ result }: { result: NumerologyResult }) {
  const py = result.personalDay.year
  const pm = result.personalDay.month
  const pd = result.personalDay.day

  const yearInterp = INTERPRETATIONS[py]
  const monthInterp = INTERPRETATIONS[pm]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-accent-purple flex items-center gap-2">
          <Calendar size={16} />
          Your Action Plan
        </h3>
        <p className="text-slate-400 text-xs italic">Personal alignment and immediate opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* YEAR FOCUS */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl shadow-blue-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Target size={24} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Year Focus</h4>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Major Cycle: {py}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[9px] font-black uppercase text-slate-500 block mb-2 tracking-widest">Theme: {yearInterp?.archetype}</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{yearInterp?.meaning}"</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-emerald-500 block tracking-widest">Immediate Opportunities:</span>
              <p className="text-xs text-slate-200 font-bold">{yearInterp?.career}</p>
            </div>
          </div>
        </div>

        {/* MONTH FOCUS */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl shadow-purple-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Star size={24} className="text-purple-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Month Focus</h4>
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Monthly Vibration: {pm}</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[9px] font-black uppercase text-slate-500 block mb-2 tracking-widest">Actionable:</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">{monthInterp?.advice}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase text-accent-purple block tracking-widest">Meme for Success:</span>
              <p className="text-xs text-slate-200 font-bold">{monthInterp?.positive[0]} & {monthInterp?.positive[1]}</p>
            </div>
          </div>
        </div>

        {/* ERRORS TO AVOID */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl shadow-rose-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <ShieldAlert size={24} className="text-rose-500" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">Shadow Side</h4>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Errors to avoid</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-rose-400 font-medium leading-relaxed">
              During this Personal Year {py}, watch out for these low-vibration tendencies:
            </p>
            <div className="flex flex-wrap gap-2">
              {yearInterp?.shadow.map((s, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[9px] font-bold text-rose-300 uppercase tracking-widest">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
               <p className="text-[10px] text-slate-400 italic">"Remember: The shadow is just the light in waiting."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
