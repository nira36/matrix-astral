'use client'

import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

export default function MatrixSummary({ result }: { result: DestinyMatrixResult }) {
  const { points, purpose, chakraMap } = result

  return (
    <div className="flex flex-col gap-12 py-16 animate-fade-up">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Matrix <span className="text-accent-purple">Summary</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          A holistic view of your dominant energies, from personal identity to 
          material prosperity and ancestral karma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto w-full">

        {/* ROW 1: CORE & IDENTITY */}
        <div className="md:col-span-4 h-full">
          <SummaryCard title="Central Core" primaryNumber={points.E.number} subtitle="Comfort Zone">
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-4xl font-black" style={{ color: getArcana(points.E.number)?.color ?? '#8b5cf6' }}>
                {points.E.number}
              </span>
              <span className="text-sm font-bold text-slate-300">
                {getArcana(points.E.number).name}
              </span>
              <p className="text-[10px] text-slate-600 leading-tight mt-2">
                Your energetic center and the zone where you feel most protected and effective.
              </p>
            </div>
          </SummaryCard>
        </div>

        <div className="md:col-span-8">
          <SummaryCard title="Identity Path" primaryNumber={points.D.number} subtitle="Pillars of Destiny">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataRow label="0 years (Day):" value={points.A.number} />
              <DataRow label="20 years (Month):" value={points.B.number} />
              <DataRow label="40 years (Year):" value={points.C.number} />
              <DataRow label="60 years (Karma):" value={points.D.number} />
            </div>
          </SummaryCard>
        </div>

        {/* ROW 2: EVOLUTION & KARMA */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard title="Evolutionary Arcs" primaryNumber={points.L2.number} subtitle="Milestones of Growth">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl border"
                style={{ background: `${getArcana(points.L2.number)?.color ?? '#8b5cf6'}10`, borderColor: `${getArcana(points.L2.number)?.color ?? '#8b5cf6'}25` }}>
                <span className="text-xs font-semibold text-slate-400">Light Point (30-50):</span>
                <span className="text-sm font-bold" style={{ color: getArcana(points.L2.number)?.color ?? '#8b5cf6' }}>
                  {points.L2.number} — {getArcana(points.L2.number).name}
                </span>
              </div>
              <DataRow label="Paternal Talent:" value={points.F2.number} />
              <DataRow label="Maternal Talent:" value={points.G2.number} />
            </div>
          </SummaryCard>

          <SummaryCard title="Karmic Channel" primaryNumber={points.M.number} subtitle="Past & Heritage">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-6 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                {[points.M.number, points.N.number, points.D.number].map((n, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-2xl font-black" style={{ color: getArcana(n)?.color ?? '#8b5cf6' }}>{n}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">{['Lesson', 'Challenge', 'Root'][idx]}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 text-center italic px-4">
                The M-N-D sequence describes how to resolve past debts through awareness.
              </p>
            </div>
          </SummaryCard>
        </div>

        {/* ROW 3: TALENTI (Full Width with new design) */}
        <div className="md:col-span-12">
          <div className="rounded-2xl border border-white/[0.07] bg-bg-card p-1 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <TalentBox title="Paternal Root" value={points.F2.number} />
              <TalentBox title="Personal Potential" value={points.K.number} highlight />
              <TalentBox title="Maternal Root" value={points.G2.number} />
            </div>
          </div>
        </div>

        {/* ROW 4: MATERIAL CHANNELS */}
        <div className="md:col-span-6 h-full">
          <SummaryCard title="Relationship Alchemy" primaryNumber={points.R.number} subtitle="Connections & Affection">
            <div className="space-y-2">
              <DataRow label="Meeting (M):" value={points.M.number} />
              <DataRow label="Nature (R1):" value={points.R1.number} />
              <DataRow label="Challenge (R):" value={points.R.number} />
            </div>
          </SummaryCard>
        </div>

        <div className="md:col-span-6 h-full">
          <SummaryCard title="Prosperity Flow" primaryNumber={points.R2.number} subtitle="Work & Abundance">
            <div className="space-y-2">
              <DataRow label="Flow (R):" value={points.R.number} />
              <DataRow label="Profession (R2):" value={points.R2.number} />
              <DataRow label="Channel (L):" value={points.L.number} />
            </div>
          </SummaryCard>
        </div>

        {/* ROW 5: PURPOSE & ENERGY */}
        <div className="md:col-span-6">
          <SummaryCard title="Destiny Purpose" primaryNumber={purpose.personal} subtitle="Your Mission">
            <div className="space-y-2">
              <DataRow label="Personal:" value={purpose.personal} />
              <DataRow label="Social:" value={purpose.social} />
              <DataRow label="Spiritual:" value={purpose.spiritual} />
            </div>
          </SummaryCard>
        </div>

        <div className="md:col-span-6">
          <SummaryCard title="Sahasrara Vibration" primaryNumber={chakraMap.sahasrara.emot} subtitle="Crown Chakra">
            <div className="space-y-2">
              <DataRow label="Physical (A):" value={points.A.number} />
              <DataRow label="Energy (B):" value={points.B.number} />
              <DataRow label="Emotion (Total):" value={chakraMap.sahasrara.emot} />
            </div>
          </SummaryCard>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, subtitle, primaryNumber, children }: { title: string; subtitle?: string; primaryNumber: number; children: React.ReactNode }) {
  const color = getArcana(primaryNumber)?.color ?? '#8b5cf6'
  return (
    <div className="h-full rounded-2xl border border-white/[0.07] bg-bg-card p-6 shadow-xl transition-all hover:border-white/10 flex flex-col">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-bold text-lg text-white">{title}</h3>
        </div>
        {subtitle && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 ml-5">{subtitle}</span>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function TalentBox({ title, value, highlight }: { title: string; value: number; highlight?: boolean }) {
  const arcana = getArcana(value)
  const color = arcana?.color ?? '#8b5cf6'
  return (
    <div
      className="p-6 flex flex-col items-center gap-2 transition-colors"
      style={highlight ? { background: `${color}12` } : undefined}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</span>
      <span className="text-4xl font-black" style={{ color }}>{value}</span>
      <span className="text-xs font-semibold text-slate-400">{arcana.name}</span>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: number }) {
  const arcana = getArcana(value)
  const color = arcana?.color ?? '#8b5cf6'
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.03] last:border-0 group transition-colors">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-400">{label}</span>
      <span className="text-xs font-bold text-right group-hover:scale-105 transition-transform" style={{ color }}>
        {value} — {arcana.name}
      </span>
    </div>
  )
}
