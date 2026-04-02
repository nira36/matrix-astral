'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import { getIntensityAnalysis } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import { Zap, AlertCircle, BookOpen } from 'lucide-react'

export default function IntensityAnalysis({ result }: { result: NumerologyResult }) {
  const { talents, lessons } = getIntensityAnalysis(result.letterFrequency)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Natural Talents */}
      <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Zap size={24} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Natural Talents</h3>
            <p className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest italic">Dominant Vibrations</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {talents.length > 0 ? (
            talents.map(n => (
              <div key={n} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-emerald-500/[0.03] hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-black text-emerald-500">{n}</span>
                  <span className="text-xs font-source-code font-black uppercase text-slate-300 tracking-widest">{INTERPRETATIONS[n]?.archetype || 'Talent'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {INTERPRETATIONS[n]?.meaning}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Balanced distribution of energies.</p>
          )}
        </div>
      </div>

      {/* Karmic Lessons */}
      <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl shadow-rose-500/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <AlertCircle size={24} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Karmic Lessons</h3>
            <p className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest italic">Missing Vibrations</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {lessons.length > 0 ? (
            lessons.map(n => (
              <div key={n} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-rose-500/[0.03] hover:border-rose-500/20 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-black text-rose-500">{n}</span>
                  <span className="text-xs font-black uppercase text-slate-300 tracking-widest">{INTERPRETATIONS[n]?.archetype || 'Lesson'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Your path requires you to learn the lessons of number {n}: {INTERPRETATIONS[n]?.shadow[0].toLowerCase()} and {INTERPRETATIONS[n]?.shadow[1]?.toLowerCase() || 'structure'}.
                </p>
                <div className="mt-3 flex items-center gap-2 text-rose-400/80 uppercase">
                  <BookOpen size={10} />
                  <span className="text-[9px] font-bold tracking-widest">To do: {INTERPRETATIONS[n]?.advice}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No missing numbers. Your karmic profile is exceptionally complete.</p>
          )}
        </div>
      </div>
    </div>
  )
}
