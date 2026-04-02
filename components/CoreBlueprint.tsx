'use client'

import React from 'react'
import { INTERPRETATIONS } from '@/lib/interpretations'
import { getCoreBlueprint } from '@/lib/numerology'
import type { NumerologyResult } from '@/lib/numerology'
import { Sparkles, Shield, Compass, Heart } from 'lucide-react'

export default function CoreBlueprint({ result }: { result: NumerologyResult }) {
  const blueprint = getCoreBlueprint(result.core)
  const lp = INTERPRETATIONS[result.core.lifePath]

  if (!lp) return null

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-bg-card p-8 md:p-12 shadow-2xl shadow-purple-950/20">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-accent-purple">
              <Sparkles size={12} />
              Your Identity Archetype
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white italic">
              {lp.archetype}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-white/10 flex items-center justify-center shadow-inner">
              <span className="text-3xl font-black text-accent-purple">{result.core.lifePath}</span>
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              Life Path <br/> Energy
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Compass size={14} className="text-accent-purple" />
            The Core Blueprint
          </h3>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-medium">
            {blueprint}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Shield size={20} className="text-emerald-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-1">Strongest Asset</h4>
              <p className="text-xs text-white font-bold">{lp.positive[0]}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Shield size={20} className="text-rose-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-1">Shadow Challenge</h4>
              <p className="text-xs text-white font-bold">{lp.shadow[0]}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Heart size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-1">Soul Desire</h4>
              <p className="text-xs text-white font-bold">
                {INTERPRETATIONS[result.core.soulUrge]?.archetype || 'Discover via name'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
