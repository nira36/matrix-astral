'use client'

import React from 'react'
import type { LifePhase } from '@/lib/numerology'

export default function PinnacleTimeline({ pinnacles }: { pinnacles: LifePhase[] }) {
  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-up">
      <div className="relative h-1 w-full bg-white/[0.05] rounded-full mt-10 mb-14">
        {pinnacles.map((p, i) => {
          // Approximate width based on years, capped at sensible bounds for visualization
          const duration = p.endAge - p.startAge
          const width = duration > 40 ? 40 : duration // Cap visual width of 4th pinnacle
          const left = (p.startAge / 80) * 100 // Normalize against age 80 roughly

          return (
            <div 
              key={i} 
              className="absolute top-0 h-full flex flex-col items-center group"
              style={{ left: `${left}%`, width: `${(width / 80) * 100}%` }}
            >
              {/* Vertical Tick */}
              <div className={`mt-[-4px] w-2 h-2 rounded-full border-2 border-bg-card transition-all ${p.isActive ? 'bg-pinnacle scale-125' : 'bg-slate-700 opacity-50'}`} />
              
              {/* Number Label (Floating Above) */}
              <div className={`absolute -top-10 flex flex-col items-center transition-all ${p.isActive ? 'scale-110' : 'opacity-40 group-hover:opacity-70'}`}>
                <span className={`text-xl font-black ${p.isActive ? 'text-pinnacle' : 'text-slate-600'}`}>
                  {p.number}
                </span>
              </div>

              {/* Range Label (Below) */}
              <div className="absolute top-4 flex flex-col items-center whitespace-nowrap">
                 <span className={`text-[10px] font-bold tracking-widest uppercase ${p.isActive ? 'text-accent-purple' : 'text-slate-700'}`}>
                   {p.label}
                 </span>
                 <span className="text-[9px] font-mono text-slate-800">
                   {p.startAge}-{p.endAge >= 100 ? '∞' : p.endAge}
                 </span>
              </div>

              {/* Active Highlight Line */}
              {p.isActive && (
                <div className="absolute top-0 h-full w-full bg-pinnacle/20 blur-[2px] rounded-full" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
