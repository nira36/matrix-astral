'use client'

import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'
import { Heart, Coins, Sparkles } from 'lucide-react'

export default function PrognosisDisplay({ result }: { result: DestinyMatrixResult }) {
  const { lifePeriods } = result
  
  const segments = [
    { title: '0-19 years (Youth)', items: lifePeriods.youth },
    { title: '19-39 years (Youth-Maturity)', items: lifePeriods.youthMaturity },
    { title: '39-59 years (Maturity)', items: lifePeriods.maturity },
    { title: '59-79 years (Maturity-Old Age)', items: lifePeriods.maturityOld },
  ]

  return (
    <div className="flex flex-col gap-10 py-12 animate-fade-up">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-accent-purple">
          Life Prognosis
        </h2>
        <p className="text-slate-500 text-sm">
          Energetic dynamics along the 80-year cycle based on the Destiny Matrix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {segments.map((segment, sIdx) => (
          <div key={sIdx} className="flex flex-col rounded-2xl border border-white/[0.08] bg-bg-card overflow-hidden shadow-xl">
            <div className="bg-accent-purple/10 py-4 px-4 border-b border-white/[0.08]">
              <h3 className="text-center text-sm font-bold text-accent-purple tracking-wide">
                {segment.title}
              </h3>
            </div>

            <div className="flex flex-col divide-y divide-white/[0.04]">
              <div className="grid grid-cols-3 px-4 py-2 bg-white/[0.02]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Age</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Theme</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Energy</span>
              </div>
              
              {segment.items.map((item, iIdx) => {
                // Theme Cycle per 5-year block (4 phases): Money, Love, Spirit, Love
                const cyclePos = iIdx % 4
                const THEME_MAP = [
                  { Icon: Coins, color: 'text-emerald-500', label: '+4' },    // Money
                  { Icon: Heart, color: 'text-rose-500', label: '+2' },       // Love
                  { Icon: Sparkles, color: 'text-amber-400', label: '+4' },   // Spirit/Luck
                  { Icon: Heart, color: 'text-rose-500', label: '+4' },       // Love/Relation
                ]
                const { Icon: SelectedIcon, color, label } = THEME_MAP[cyclePos]

                return (
                  <div key={iIdx} className="grid grid-cols-3 px-4 py-2.5 items-center hover:bg-white/[0.02] transition-colors group">
                    <span className="text-xs font-mono text-slate-400">
                      {item.startAge}-{item.endAge}
                    </span>
                    
                    <div className="flex items-center justify-center gap-1">
                      <SelectedIcon className={`w-3.5 h-3.5 ${color}`} strokeWidth={2.5} />
                      <span className="text-[10px] font-bold text-slate-500">{label}</span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-accent-purple group-hover:scale-110 transition-transform">
                          {item.energy}
                        </span>
                        <span className="hidden group-hover:block text-[9px] text-slate-500 whitespace-nowrap">
                          {getArcana(item.energy).name}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-center text-[10px] text-slate-600 italic">
          This prognosis is calculated based on the 80 points of the Destiny Matrix Age Cycle. 
          Each period represents the dominant Arcana energy influencing your path in that age range.
        </p>
      </div>
    </div>
  )
}
