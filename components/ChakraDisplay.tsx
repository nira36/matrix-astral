'use client'

import type { DestinyMatrixResult } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

export default function ChakraDisplay({ result }: { result: DestinyMatrixResult }) {
  const chakraList = Object.values(result.chakraMap)
  const total = result.chakraTotal

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-bg-card shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.08]">
              <th className="py-4 px-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">Chakra</th>
              <th className="py-4 px-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 text-center">Physical</th>
              <th className="py-4 px-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 text-center">Energy</th>
              <th className="py-4 px-6 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 text-center">Emotions (Result)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {chakraList.map((chakra) => (
              <tr 
                key={chakra.name} 
                className="group transition-colors hover:bg-white/[0.02]"
                style={{ background: `${chakra.color}15` }}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ background: chakra.color }} />
                    <span className="text-[12px] font-bold tracking-wide" style={{ color: chakra.color }}>
                      {chakra.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-white">
                      {chakra.phys} — {getArcana(chakra.phys).name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-white">
                      {chakra.ener} — {getArcana(chakra.ener).name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-white">
                      {chakra.emot} — {getArcana(chakra.emot).name}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Row Generale */}
            <tr style={{ background: '#a8879d1a', borderTop: '2px solid #a8879d33' }}>
              <td className="py-5 px-6">
                <span className="text-[12px] font-black tracking-widest uppercase" style={{ color: '#a8879d' }}>
                  General
                </span>
              </td>
              <td className="py-5 px-6 text-center">
                <span className="text-sm font-black text-white">
                  {total.phys} — {getArcana(total.phys).name}
                </span>
              </td>
              <td className="py-5 px-6 text-center">
                <span className="text-sm font-black text-white">
                  {total.ener} — {getArcana(total.ener).name}
                </span>
              </td>
              <td className="py-5 px-6 text-center">
                <span className="text-sm font-black text-white">
                  {total.emot} — {getArcana(total.emot).name}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
