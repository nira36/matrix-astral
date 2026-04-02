'use client'

import React from 'react'
import type { LetterFrequency } from '@/lib/numerology'

export default function LetterAnalysis({ data }: { data: LetterFrequency[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
        <span className="text-slate-500 text-sm text-center">
          Enter a name to view letter frequency analysis.
        </span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
      {data.map((item) => (
        <div 
          key={item.num}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/[0.05] bg-bg-elevated/50 group hover:border-accent-purple/30 transition-all"
        >
          <span className="text-xs font-bold text-slate-500 group-hover:text-accent-purple transition-colors">
            Number {item.num}
          </span>
          <div className="relative w-full h-12 bg-white/[0.03] rounded-lg overflow-hidden flex items-end">
            <div 
              className="w-full bg-accent-purple/40 transition-all duration-1000"
              style={{ height: `${item.intensity}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
              {item.count}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">
            {item.intensity}%
          </span>
        </div>
      ))}
    </div>
  )
}
