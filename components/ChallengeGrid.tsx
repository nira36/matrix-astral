'use client'

import React from 'react'

export default function ChallengeGrid({ challenges }: { challenges: number[] }) {
  const labels = ['1st Challenge (Youth)', '2nd Challenge (Maturity)', '3rd Challenge (Main)', '4th Challenge (Late Life)']
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {challenges.map((c, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl border border-white/[0.06] bg-bg-elevated/40 hover:border-challenge/20 transition-all group">
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 group-hover:text-challenge transition-colors">
            {labels[i]}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">
              {c}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
