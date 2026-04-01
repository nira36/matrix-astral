'use client'

import EsotericMatrix from '@/components/EsotericMatrix'
import { calcDestinyMatrix } from '@/lib/destinyMatrix'

export default function EsotericMatrixPage() {
  // Demo calculation for 24/03/1990
  const result = calcDestinyMatrix(24, 3, 1990)

  if (!result) return <div>Invalid Matrix Data</div>

  return (
    <main className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Esoteric Destiny Matrix</h1>
        <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold">Geometric Numerology Chart</p>
      </div>
      <EsotericMatrix result={result} />
      <div className="mt-12 max-w-2xl text-center text-slate-400 text-sm leading-relaxed">
        This diagram represents the energetic blueprint of the individual, 
        incorporating the Eightfold Path of the Octagram and the Generational Axes.
      </div>
    </main>
  )
}
