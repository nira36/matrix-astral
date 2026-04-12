'use client'

import { useState } from 'react'
import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'
import { interpretations } from '@/lib/matrixData1'
import type { ArcanaInterpretation } from '@/lib/matrixInterpretations'
import { ChevronDown, Star, Gift, Shield, Zap, Heart, Coins, History, Users, Compass, Eye, Info } from 'lucide-react'

export default function InterpretationAccordion({ result }: { result: DestinyMatrixResult }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx)

  const categories = [
    {
      name: "Roots & Identity",
      zones: [
        { id: 0, title: "Portrait Zone (0-20 Years)", importance: 5, color: "#F87171", isFree: true, content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-accent-purple/30 pl-4 py-1">
              Your "business card" to the world. Reveal your innate character, your starting gear, and the primary lens through which you experience reality.
            </p>
            <div className="space-y-6">
              <PointInterpretation 
                label="Primary Character (Day)" 
                value={result.points.A.number} 
                section="portrait" 
              />
              <PointInterpretation 
                label="Mental Landscape (Month)" 
                value={result.points.B.number} 
                section="portrait" 
              />
            </div>
          </div>
        )},
        { id: 2, title: "Central Core", importance: 5, color: "#FBBF24", isFree: true, content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-amber-400/30 pl-4 py-1">
              The sun at the center of your system. This is your engine, your stability, and the source of your willpower.
            </p>
            <PointInterpretation 
              label="Heart of the Matrix" 
              value={result.points.E.number} 
              section="center" 
            />
          </div>
        )},
        { id: 5, title: "Soul Tasks (60-80 Years)", importance: 4, color: "#34D399", isFree: true, content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-emerald-400/30 pl-4 py-1">
              The "final exam" of your incarnation. The wisdom you are here to integrate in the second half of life.
            </p>
            <PointInterpretation 
              label="Spiritual Maturity" 
              value={result.points.D.number} 
              section="soul" 
            />
          </div>
        )},
      ]
    },
    {
      name: "Karma & Ancestors",
      zones: [
        { id: 6, title: "Karmic Tail (Previous Lives)", importance: 5, color: "#a8879d", content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-purple-400/30 pl-4 py-1">
              The weight of past experiences. These are the patterns, mistakes, and unresolved nodes you carry into this lifetime.
            </p>
            <div className="space-y-6">
              <PointInterpretation label="Core Challenge" value={result.points.N.number} section="karma" />
              <PointInterpretation label="Root Defect" value={result.points.M.number} section="karma" />
            </div>
          </div>
        )},
        { id: 3, title: "Ancestral Heritage", importance: 4, color: "#F87171", content: (
          <div className="space-y-8">
             <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-rose-400/30 pl-4 py-1">
              The genetic and spiritual baggage received through bloodlines. What your ancestors left unsaid or undone.
            </p>
            <div className="space-y-6">
              <PointInterpretation label="Paternal Line (Strength & Order)" value={result.points.F.number} section="masculine" />
              <PointInterpretation label="Maternal Line (Emotion & Care)" value={result.points.G.number} section="feminine" />
            </div>
          </div>
        )},
        { id: 4, title: "Generational Talent", importance: 3, color: "#60A5FA", content: (
           <div className="grid grid-cols-2 gap-4">
            <PointCard label="Paternal Gift" value={result.points.F2.number} />
            <PointCard label="Maternal Gift" value={result.points.G2.number} />
          </div>
        )},
      ]
    },
    {
      name: "Material Sphere",
      zones: [
        { id: 7, title: "Relationship Alchemy", importance: 5, color: "#F43F5E", isFree: true, content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-rose-500/30 pl-4 py-1">
              How you interact with the 'other'. Your needs, your pitfalls in love, and the partner profile that challenges you.
            </p>
            <PointInterpretation label="Love Entrance" value={result.points.R.number} section="love" />
          </div>
        )},
        { id: 8, title: "Prosperity Flow", importance: 4, color: "#34D399", content: (
          <div className="space-y-8">
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-1">
              Your relationship with money and professional realization. The conditions that unlock abundance.
            </p>
            <PointInterpretation label="Money Channel" value={result.points.L.number} section="money" />
            <PointInterpretation label="Preferred Profession" value={result.points.R2.number} section="money" />
          </div>
        )},
      ]
    },
    {
      name: "Evolution & Destiny",
      zones: [
        { id: 10, title: "The 3 Purposes", importance: 5, color: "#FBBF24", content: (
          <div className="space-y-6">
            <PurposeInterpretation label="Personal Purpose" value={result.purpose.personal} />
            <PurposeInterpretation label="Social Purpose" value={result.purpose.social} />
            <PurposeInterpretation label="Spiritual Purpose" value={result.purpose.spiritual} />
          </div>
        )},
        { id: 11, title: "The 7 Chakras", importance: 4, color: "#a8879d", content: (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-xs text-slate-400">Detailed Chakra Analysis is currently in development.</p>
          </div>
        )},
      ]
    }
  ]

  return (
    <div className="flex flex-col gap-16 py-16 animate-fade-up">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Zones <span className="text-accent-purple">Analysis</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto">
          Discard the generic spiritual jargon. Here is the raw psychological mechanism of your destiny matrix.
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
        {categories.map((cat, cIdx) => (
          <div key={cIdx} className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white/50 uppercase tracking-[0.2em]">{cat.name}</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              {cat.zones.map((zone) => (
                <ZoneItem 
                  key={zone.id}
                  title={zone.title}
                  importance={zone.importance}
                  isFree={zone.isFree}
                  color={zone.color}
                  isOpen={openIndex === zone.id}
                  onClick={() => toggle(zone.id)}
                >
                  {zone.content}
                </ZoneItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ZoneItem({ title, significance, isFree, color, children, isOpen, onClick }: any) {
  return (
    <div className={`group transition-all duration-500 rounded-3xl ${isOpen ? 'bg-bg-card ring-1 ring-white/10 shadow-2xl' : 'bg-transparent border border-white/5 hover:border-white/20'}`}>
      <button 
        onClick={onClick}
        className="w-full px-8 py-6 flex items-center justify-between transition-colors gap-6"
      >
        <div className="flex items-center gap-5">
          <div className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: color }} />
          <span className={`font-black text-sm text-left uppercase tracking-widest transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
            {title}
          </span>
        </div>

        <ChevronDown size={20} className={`text-slate-600 transition-all duration-500 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-slate-300'}`} />
      </button>

      <div className={`transition-all duration-700 ease-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
        <div className="overflow-hidden">
          <div className="px-8 pb-8 pt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function PointInterpretation({ label, value, section }: { label: string, value: number, section: string }) {
  const data = interpretations[value]
  if (!data) return <PointCard label={label} value={value} />

  let content = ""
  let Icon = Info
  let labelColor = "text-accent-purple"

  switch (section) {
    case "portrait":
      content = data.general + "\n\nTalents: " + data.talents
      Icon = Eye
      break
    case "center":
      content = data.center
      Icon = Zap
      labelColor = "text-amber-400"
      break
    case "love":
      content = data.love
      Icon = Heart
      labelColor = "text-rose-400"
      break
    case "money":
      content = data.money
      Icon = Coins
      labelColor = "text-emerald-400"
      break
    case "karma":
      content = data.karma
      Icon = History
      labelColor = "text-purple-400"
      break
    case "masculine":
      content = data.masculineLine
      Icon = Shield
      labelColor = "text-blue-400"
      break
    case "feminine":
      content = data.feminineLine
      Icon = Users
      labelColor = "text-pink-400"
      break
    case "soul":
      content = data.integration + "\n\nAdvice: " + data.advice
      Icon = Compass
      labelColor = "text-indigo-400"
      break
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-3">
          <Icon size={16} className={labelColor} />
          <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${labelColor}`}>{label}</h4>
        </div>
        <span className="text-xs font-black text-white/40 italic">Arcana {value} — {data.name}</span>
      </div>

      <div className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        <p className="text-[12px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
          {content?.replace(/\*\*/g, '').replace(/\s*—\s*/g, ', ')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Strengths</span>
            <ul className="text-[10px] text-emerald-200/70 space-y-1">
              {data.strengths.map((s: string, i: number) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Weaknesses</span>
            <ul className="text-[10px] text-orange-200/70 space-y-1">
              {data.weaknesses.map((w: string, i: number) => <li key={i}>• {w}</li>)}
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-2">
          <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">The Shadow (Secret Obstacle)</span>
          <p className="text-[10px] text-rose-200/70 leading-relaxed italic">
            {data.shadow?.replace(/\*\*/g, '').replace(/\s*—\s*/g, ', ')}
          </p>
        </div>
      </div>
    </div>
  )
}

function PurposeInterpretation({ label, value }: { label: string, value: number }) {
  const data = interpretations[value]
  return (
    <div className="p-6 rounded-2xl bg-bg-elevated border border-white/5 space-y-3">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-accent-purple uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-bold text-white/40">Arcana {value}</span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap italic">
        {(data?.integration || "Purposive energy for growth and realization.").replace(/\*\*/g, '').replace(/\s*—\s*/g, ', ')}
      </p>
    </div>
  )
}

function PointCard({ label, value }: { label: string, value: number }) {
  const arcana = getArcana(value)
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/5 px-6 py-4 flex justify-between items-center group hover:bg-white/[0.05] transition-all">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{label}</span>
      <span className="text-xs font-black text-accent-purple tracking-wide">{value} — {arcana.name}</span>
    </div>
  )
}
