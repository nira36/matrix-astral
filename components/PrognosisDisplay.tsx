'use client'

import { useState } from 'react'
import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'
import { Heart, Coins, Sparkles, ChevronDown } from 'lucide-react'

export default function PrognosisDisplay({ result }: { result: DestinyMatrixResult }) {
  const { lifePeriods } = result

  const segments = [
    { title: '0-19 years (Youth)', items: lifePeriods.youth },
    { title: '19-39 years (Youth-Maturity)', items: lifePeriods.youthMaturity },
    { title: '39-59 years (Maturity)', items: lifePeriods.maturity },
    { title: '59-79 years (Maturity-Old Age)', items: lifePeriods.maturityOld },
  ]

  const [openSegments, setOpenSegments] = useState<Record<number, boolean>>({})

  const toggle = (idx: number) =>
    setOpenSegments(prev => ({ ...prev, [idx]: !prev[idx] }))

  return (
    <div className="flex flex-col gap-10 py-12 animate-fade-up">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Life <span className="text-accent-purple">Prognosis</span>
        </h2>
        <p className="text-slate-500 text-sm">
          Energetic dynamics along the 80-year cycle based on the Destiny Matrix
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-6 items-start">
        {segments.map((segment, sIdx) => {
          const isOpen = !!openSegments[sIdx]
          return (
            <div key={sIdx} className="flex flex-col rounded-2xl border border-white/[0.08] bg-bg-card overflow-hidden shadow-xl w-full md:w-[calc(50%-12px)] lg:w-1/4 lg:min-w-0">
              <button
                onClick={() => toggle(sIdx)}
                className="flex items-center justify-between py-4 px-4 border-b border-white/[0.08] cursor-pointer transition-colors hover:bg-white/[0.03]"
              >
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {segment.title}
                </h3>
                <ChevronDown
                  size={18}
                  className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`transition-all duration-500 ease-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div>
                  <div className="flex flex-col divide-y divide-white/[0.04]">
                    <div className="grid grid-cols-3 px-4 py-2 bg-white/[0.02]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Age</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Theme</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Energy</span>
                    </div>

                    {segment.items.map((item, iIdx) => {
                      const cyclePos = iIdx % 4
                      const THEME_MAP = [
                        { Icon: Coins, color: 'text-emerald-500', label: '+4' },
                        { Icon: Heart, color: 'text-rose-500', label: '+2' },
                        { Icon: Sparkles, color: 'text-amber-400', label: '+4' },
                        { Icon: Heart, color: 'text-rose-500', label: '+4' },
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
              </div>
            </div>
          )
        })}
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
