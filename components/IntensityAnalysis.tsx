'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import { getIntensityAnalysis } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import { Zap, AlertCircle, BookOpen } from 'lucide-react'

const SAGE = '#8b9d87'
const ROSE = '#9d7a7a'

export default function IntensityAnalysis({ result }: { result: NumerologyResult }) {
  const { talents, lessons } = getIntensityAnalysis(result.letterFrequency)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Natural Talents */}
      <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
               style={{ background: `${SAGE}18`, borderColor: `${SAGE}40` }}>
            <Zap size={24} style={{ color: SAGE }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Natural Talents</h3>
            <p className="text-[10px] font-black uppercase tracking-widest italic" style={{ color: `${SAGE}cc` }}>Dominant Vibrations</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {talents.length > 0 ? (
            talents.map(n => (
              <div key={n} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-all"
                   style={{ ['--hover-bg' as string]: `${SAGE}08` }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-black" style={{ color: SAGE }}>{n}</span>
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
      <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-bg-card shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
               style={{ background: `${ROSE}18`, borderColor: `${ROSE}40` }}>
            <AlertCircle size={24} style={{ color: ROSE }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Karmic Lessons</h3>
            <p className="text-[10px] font-black uppercase tracking-widest italic" style={{ color: `${ROSE}cc` }}>Missing Vibrations</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {lessons.length > 0 ? (
            lessons.map(n => (
              <div key={n} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-black" style={{ color: ROSE }}>{n}</span>
                  <span className="text-xs font-black uppercase text-slate-300 tracking-widest">{INTERPRETATIONS[n]?.archetype || 'Lesson'}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Your path requires you to learn the lessons of number {n}: {INTERPRETATIONS[n]?.shadow[0].toLowerCase()} and {INTERPRETATIONS[n]?.shadow[1]?.toLowerCase() || 'structure'}.
                </p>
                <div className="mt-3 flex items-center gap-2 uppercase" style={{ color: `${ROSE}cc` }}>
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
