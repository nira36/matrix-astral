'use client'

import React, { useState } from 'react'
import type { NatalChartData } from '@/lib/astrology'
import { generateInterpretation } from '@/lib/interpretation'

const SECTIONS: { key: string; title: string; subtitle: string }[] = [
  { key: 'opening', title: 'Who You Are', subtitle: 'Sun, Ascendant & Core Identity' },
  { key: 'engine', title: 'What Drives You', subtitle: 'Moon, Dominant Planet & Inner Machinery' },
  { key: 'challenge', title: 'Where You Struggle', subtitle: 'The Hardest Aspect in Your Chart' },
  { key: 'resource', title: 'What You Have', subtitle: 'Elemental Balance & Natural Strengths' },
  { key: 'evolution', title: 'Where You\'re Going', subtitle: 'North Node & Growth Direction' },
]

export default function NatalInterpretation({ data }: { data: NatalChartData }) {
  const [expandedIdx, setExpandedIdx] = useState<number>(0)
  const interp = generateInterpretation(data)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-1">Psychological Reading</h3>

      {SECTIONS.map((sec, i) => {
        const isOpen = expandedIdx === i
        const text = interp[sec.key as keyof typeof interp]
        const paragraphs = text.split('\n\n').filter(Boolean)

        return (
          <div key={sec.key}>
            <button
              onClick={() => setExpandedIdx(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 py-3 px-4 rounded-xl border border-white/[0.06] hover:border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-200 text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  {sec.title}
                </span>
                <span className="text-[10px] text-slate-600">{sec.subtitle}</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pt-3 pb-1 flex flex-col gap-3 animate-fade-up">
                {paragraphs.map((p, pi) => (
                  <p key={pi} className="text-[12px] text-slate-400 leading-[1.7]">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
