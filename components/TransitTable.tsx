'use client'

import React from 'react'
import type { TransitYear } from '@/lib/numerology'
import { NUMBER_MEANINGS } from '@/lib/numerology'

export default function TransitTable({ transits }: { transits: TransitYear[] }) {
  if (!transits || transits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
        <span className="text-slate-500 text-sm">
          Enter a name to view transits analysis.
        </span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-bg-elevated/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/[0.08]">
            {['Year', 'Age', 'Pers. Year', 'Essence', 'Theme'].map(h => (
              <th key={h} className="py-3 px-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {transits.map((t, i) => (
            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 text-sm font-mono text-slate-300">{t.year}</td>
              <td className="py-3 px-4 text-xs text-slate-500">{t.age}</td>
              <td className="py-3 px-4">
                <span className="text-sm font-black text-accent-purple">
                  {t.personalYear}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                  {t.essence}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="text-[10px] text-slate-500 line-clamp-1 italic max-w-[200px]">
                  {NUMBER_MEANINGS[t.essence] || 'Generic influence'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
