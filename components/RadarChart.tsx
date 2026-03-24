'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import type { CoreNumbers } from '@/lib/numerology'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend)

interface RadarChartProps {
  core: CoreNumbers
}

function normalize(n: number): number {
  if (n === 0) return 0
  if (n === 33) return 9
  if (n === 22) return 8
  if (n === 11) return 7
  return Math.min(9, Math.max(1, n))
}

export default function RadarChart({ core }: RadarChartProps) {
  const data = {
    labels: ['Life Path', 'Expression', 'Soul Urge', 'Personality', 'Birth Day', 'Maturity'],
    datasets: [
      {
        label: 'Core Numbers',
        data: [
          normalize(core.lifePath),
          normalize(core.expression),
          normalize(core.soulUrge),
          normalize(core.personality),
          normalize(core.birthDayNumber),
          normalize(core.maturityNumber),
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: 'rgba(139, 92, 246, 0.9)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: 'rgba(139, 92, 246, 0.5)',
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart' as const,
    },
    scales: {
      r: {
        min: 0,
        max: 9,
        ticks: {
          stepSize: 3,
          color: 'rgba(255,255,255,0.2)',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: {
          color: 'rgba(255,255,255,0.06)',
        },
        angleLines: {
          color: 'rgba(255,255,255,0.06)',
        },
        pointLabels: {
          color: 'rgba(255,255,255,0.5)',
          font: { size: 11, family: 'Inter' },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,15,30,0.95)',
        borderColor: 'rgba(139,92,246,0.3)',
        borderWidth: 1,
        titleColor: '#8b5cf6',
        bodyColor: '#cbd5e1',
        padding: 10,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            const rawValues = [
              core.lifePath, core.expression, core.soulUrge,
              core.personality, core.birthDayNumber, core.maturityNumber,
            ]
            const v = rawValues[ctx.dataIndex as number]
            return v === 0 ? ' — requires name' : ` ${v}`
          },
        },
      },
    },
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500">
        Core Numbers Radar
      </h3>
      <div className="w-full max-w-xs mx-auto">
        <Radar data={data} options={options} />
      </div>
    </div>
  )
}
