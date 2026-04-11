'use client'

import { MASTER_NUMBERS, NUMBER_MEANINGS } from '@/lib/numerology'
import { INTERPRETATIONS } from '@/lib/interpretations'
import { getArcana } from '@/lib/arcana'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, Shield, Zap, Heart, Briefcase } from 'lucide-react'
import Tooltip from './Tooltip'

interface NumberCardProps {
  label: string
  value: number
  tooltip: string
  color?: string
  delay?: number
}

export default function NumberCard({
  label,
  value,
  tooltip,
  color,
  delay = 0,
}: NumberCardProps) {
  // Derive color from the corresponding Major Arcana to match the Deck section
  const resolvedColor = color ?? getArcana(value)?.color ?? '#a8879d'
  const [isExpanded, setIsExpanded] = useState(false)
  const isMaster = MASTER_NUMBERS.has(value)
  const interp = INTERPRETATIONS[value]
  const meaning = NUMBER_MEANINGS[value] ?? ''

  const toggle = () => value > 0 && setIsExpanded(!isExpanded)

  return (
    <div
      onClick={toggle}
      className={`
        relative rounded-2xl border border-white/[0.07] bg-bg-card
        p-5 flex flex-col gap-3 overflow-hidden cursor-pointer
        transition-all duration-500 ease-in-out
        ${isExpanded ? 'ring-2 ring-accent-purple/50 shadow-2xl shadow-purple-950/40 md:col-span-2 lg:col-span-3' : 'hover:-translate-y-0.5 hover:border-white/[0.15]'}
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${resolvedColor}, transparent)` }}
      />

      <div className="flex justify-between items-start">
        <Tooltip content={tooltip}>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">
              {label}
            </span>
            <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Tooltip>
        {value > 0 && (
          <div className="text-slate-600 transition-colors group-hover:text-slate-400">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        )}
      </div>

      {value === 0 ? (
        <div className="text-slate-600 text-[10px] uppercase font-bold italic tracking-widest mt-2">requires name</div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-black tabular-nums leading-none tracking-tighter"
              style={{ color: resolvedColor }}
            >
              {value}
            </span>
            {isMaster && (
              <span
                className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border"
                style={{ color: resolvedColor, borderColor: `${resolvedColor}44`, background: `${resolvedColor}11` }}
              >
                master
              </span>
            )}
          </div>
          
          <p className="text-[11px] font-bold text-white uppercase tracking-widest">{interp?.archetype}</p>
          
          {!isExpanded && (
             <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 italic">
               {meaning}
             </p>
          )}

          {isExpanded && interp && (
            <div className="flex flex-col gap-6 mt-4 pt-4 border-t border-white/[0.05] animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#8b9d87' }}>
                    <Zap size={12} /> Light Side
                  </h5>
                  <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside" style={{ ['--marker-color' as string]: '#8b9d8780' }}>
                    {interp.positive.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#9d7a7a' }}>
                    <Shield size={12} /> Shadow Side
                  </h5>
                  <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                    {interp.shadow.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <h6 className="text-[8px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5"><Briefcase size={10} /> Career</h6>
                  <p className="text-[10px] text-slate-200">{interp.career}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <h6 className="text-[8px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5"><Heart size={10} /> Love</h6>
                  <p className="text-[10px] text-slate-200">{interp.love}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                   <h6 className="text-[8px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1.5"><Star size={10} /> Advice</h6>
                   <p className="text-[10px] text-slate-200">{interp.advice}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
