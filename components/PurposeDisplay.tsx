'use client'

import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

export default function PurposeDisplay({ result }: { result: DestinyMatrixResult }) {
  const p = result.purpose

  return (
    <div className="flex flex-col gap-10 py-8 animate-fade-up">
      {/* Title */}
      <h2 className="text-center text-3xl font-bold tracking-tight text-white">
        Purpose and <span className="text-accent-purple">Destiny</span>
      </h2>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Personal Purpose */}
        <PurposeCard title="Personal Purpose">
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The Personal Purpose is formed by the Line of Heaven and the Earth Line. 
            This purpose gives you the task of searching for your soul. 
            Harmonizing this purpose makes you feel like you have found your place in the world.
          </p>
          <div className="rounded-xl border border-white/[0.08] bg-bg-elevated p-5 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Heavens" value={p.heaven} />
              <MiniStat label="Earth" value={p.earth} />
            </div>
            <div className="w-full h-px bg-white/[0.06]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Personal Purpose</span>
              <span className="text-xl font-bold text-accent-purple">
                {p.personal} — {getArcana(p.personal).name}
              </span>
            </div>
          </div>
        </PurposeCard>

        {/* 2. Social Purpose */}
        <PurposeCard title="Social Purpose">
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The Social Purpose is formed by the Male's Line and the Women's Line. 
            This purpose gives you the task of balancing the male and female forces within you. 
            By arming this purpose, you will be able to find your place in the working world.
          </p>
          <div className="rounded-xl border border-white/[0.08] bg-bg-elevated p-5 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Male" value={p.male} />
              <MiniStat label="Feminine" value={p.female} />
            </div>
            <div className="w-full h-px bg-white/[0.06]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Social Purpose</span>
              <span className="text-xl font-bold text-accent-purple">
                {p.social} — {getArcana(p.social).name}
              </span>
            </div>
          </div>
        </PurposeCard>

        {/* 3. General Purpose */}
        <PurposeCard title="General Purpose">
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The General Purpose is the purpose based on one's spiritual path, 
            on one's task in the world, on your mission to connect with the divine. 
            It represents your ultimate destination.
          </p>
          <div className="rounded-xl border border-white/[0.08] bg-bg-elevated p-6 flex flex-col justify-center items-center gap-2">
            <span className="text-3xl font-black text-accent-purple">
              {p.spiritual}
            </span>
            <span className="text-sm font-bold text-white tracking-wide uppercase">
              {getArcana(p.spiritual).name}
            </span>
          </div>
        </PurposeCard>
      </div>
    </div>
  )
}

function PurposeCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.07] bg-bg-card p-6 md:p-8 transition-all hover:border-white/20">
      <h3 className="text-lg font-bold text-accent-purple mb-4">{title}</h3>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">{label}</span>
      <span className="text-lg font-bold text-white/90">
        {value} — {getArcana(value).name}
      </span>
    </div>
  )
}
