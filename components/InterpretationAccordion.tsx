'use client'

import { useState } from 'react'
import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'
import { ChevronDown, Star, Gift } from 'lucide-react'


export default function InterpretationAccordion({ result }: { result: DestinyMatrixResult }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (idx: number) => setOpenIndex(openIndex === idx ? null : idx)

  const categories = [
    {
      name: "Roots & Identity",
      zones: [
        { id: 0, title: "Portrait Zone", importance: 5, color: "#F87171", isFree: true, content: (
          <div className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              The Portrait Zone is your 'business card', revealing your character, personality, and qualities received at birth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PointCard label="Portrait 0 years (Day)" value={result.points.A.number} />
              <PointCard label="Portrait 20 years (Month)" value={result.points.B.number} />
            </div>
            {/* Interpretation Arcana 3 Example */}
            {(result.points.A.number === 3 || result.points.B.number === 3) && <EmpressInterpretation />}
          </div>
        )},
        { id: 2, title: "Central Core", importance: 5, color: "#FBBF24", isFree: true, content: (
          <PointCard label="Inner Light (Center)" value={result.points.E.number} />
        )},
        { id: 5, title: "Soul Tasks", importance: 4, color: "#34D399", isFree: true, content: (
          <PointCard label="Spiritual Goal (60-80 years)" value={result.points.D.number} />
        )},
      ]
    },
    {
      name: "Karma & Ancestors",
      zones: [
        { id: 1, title: "Parent-Child Karma", importance: 4, color: "#34D399", content: (
          <div className="grid grid-cols-1 gap-3">
            <PointCard label="Parent/Child Karma" value={result.points.J.number} />
            <PointCard label="Ancestral Karma" value={result.points.O.number} />
          </div>
        )},
        { id: 3, title: "Ancestral Zone", importance: 4, color: "#F87171", content: (
          <div className="grid grid-cols-2 gap-3">
            <PointCard label="Male Line" value={result.points.F.number} />
            <PointCard label="Female Line" value={result.points.G.number} />
          </div>
        )},
        { id: 4, title: "Generational Talent", importance: 3, color: "#60A5FA", content: (
          <div className="grid grid-cols-2 gap-3">
            <PointCard label="Paternal Talent" value={result.points.F2.number} />
            <PointCard label="Maternal Talent" value={result.points.G2.number} />
          </div>
        )},
        { id: 6, title: "Karmic Tail", importance: 5, color: "#A78BFA", content: (
          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-slate-400 italic mb-2 text-center">The M-N-D sequence of past lives</p>
            <div className="grid grid-cols-3 gap-2">
              <PointValue label="Experience" value={result.points.M.number} />
              <PointValue label="Challenge" value={result.points.N.number} />
              <PointValue label="Root" value={result.points.D.number} />
            </div>
          </div>
        )},
      ]
    },
    {
      name: "Material Sphere",
      zones: [
        { id: 7, title: "Relationship Alchemy", importance: 3, color: "#F43F5E", isFree: true, content: (
          <div className="grid grid-cols-1 gap-3">
            <PointCard label="Relationship Entrance (R)" value={result.points.R.number} />
            <PointCard label="Compatibility Energy (R1)" value={result.points.R1.number} />
          </div>
        )},
        { id: 8, title: "Prosperity Flow", importance: 3, color: "#34D399", content: (
          <div className="grid grid-cols-1 gap-2">
            <PointCard label="Financial Flow (R)" value={result.points.R.number} />
            <PointCard label="Profession (R2)" value={result.points.R2.number} />
            <PointCard label="Money Channel (L)" value={result.points.L.number} />
          </div>
        )},
      ]
    },
    {
      name: "Evolution & Destiny",
      zones: [
        { id: 9, title: "The 7 Chakras", importance: 4, color: "#FBBF24", content: (
          <p className="text-sm text-slate-400">Brief analysis of energy centers alignment.</p>
        )},
        { id: 10, title: "Destiny Purposes", importance: 5, color: "#F87171", content: (
          <div className="grid grid-cols-1 gap-2">
            <DataRow label="Personal" value={result.purpose.personal} />
            <DataRow label="Social" value={result.purpose.social} />
            <DataRow label="Spiritual" value={result.purpose.spiritual} />
          </div>
        )},
        { id: 11, title: "Life Prognosis", importance: 5, color: "#6366F1", isFree: true, content: (
          <p className="text-sm text-slate-400">Temporal dynamics and energy cycles for 80 years.</p>
        )},
      ]
    }
  ]

  return (
    <div className="flex flex-col gap-16 py-16 animate-fade-up">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Zones <span className="text-accent-purple">Analysis</span>
        </h2>
        <p className="text-slate-500 text-sm italic font-medium">
          Explore the depths of your destiny by clicking on each area of interest.
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        {categories.map((cat, cIdx) => (
          <div key={cIdx} className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">{cat.name}</h3>
            </div>
            
            <div className="flex flex-col gap-4">
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

interface ZoneProps {
  title: string
  importance: number
  isFree?: boolean
  color: string
  children: React.ReactNode
  isOpen: boolean
  onClick: () => void
}

function ZoneItem({ title, importance, isFree, color, children, isOpen, onClick }: ZoneProps) {
  return (
    <div className={`border border-white/[0.08] rounded-2xl bg-bg-card overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-white/20' : ''}`}>
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-sm text-left text-white uppercase tracking-wider">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <ChevronDown size={18} className="text-slate-500 transition-transform duration-300 group-hover:text-slate-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 pb-6 pt-2 border-t border-white/[0.05]">
          {children}
        </div>
      </div>
    </div>
  )
}

function PointCard({ label, value }: { label: string, value: number }) {
  const arcana = getArcana(value)
  return (
    <div className="rounded-xl bg-bg-elevated border border-white/[0.04] px-4 py-3 flex justify-between items-center group hover:bg-white/[0.03] transition-colors">
      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
      <span className="text-xs font-bold text-accent-purple tracking-wide group-hover:scale-105 transition-transform">{value} — {arcana.name}</span>
    </div>
  )
}

function PointValue({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <span className="text-xl font-black text-accent-purple">{value}</span>
      <span className="text-[8px] text-slate-600 font-bold uppercase">{label}</span>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: number }) {
  const arcana = getArcana(value)
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
      <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
      <span className="text-xs font-bold text-accent-purple">{value} — {arcana.name}</span>
    </div>
  )
}

function EmpressInterpretation() {
  return (
    <div className="mt-8 space-y-6 p-6 rounded-2xl bg-bg-elevated border border-white/[0.05]">
      <h4 className="text-xs font-bold text-accent-purple uppercase tracking-widest mb-4">Interpretation Example:</h4>
      <div className="space-y-6">
        <div>
          <h5 className="text-lg font-black text-white mb-2 uppercase italic">Arcana 3 - The Empress</h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The energy of the 3rd arcana represents a strong feminine principle, material abundance, comfort, and protection.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h6 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">Positive</h6>
            <ul className="space-y-2 text-[10px] text-slate-300">
              <li>• Flourishing feminine principle</li>
              <li>• Abundance and fertility</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h6 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">Negative</h6>
            <ul className="space-y-2 text-[10px] text-slate-300">
              <li>• Rejection of femininity</li>
              <li>• Impatience and control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
