'use client'

import React, { useState } from 'react'
import type { DestinyMatrixResult, MatrixPoint } from '@/lib/destinyMatrix'
import { getArcana } from '@/lib/arcana'

// ─── Constants ──────────────────────────────────────────────────────────────
const VIEWBOX = 1000
const CTR = VIEWBOX / 2
const FONT_SANS = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

// ─── Coordinates Map ────────────────────────────────────────────────────────
type Coord = { x: number; y: number; r: number }

const COORDS: Record<string, Coord> = {
  // Main Diamond
  B: { x: 500, y: 100, r: 35 }, // Top
  C: { x: 900, y: 500, r: 35 }, // Right
  D: { x: 500, y: 900, r: 35 }, // Bottom
  A: { x: 100, y: 500, r: 35 }, // Left
  E: { x: 500, y: 500, r: 45 }, // Center
  
  // Main Square
  F: { x: 217, y: 217, r: 32 }, // Top-Left
  G: { x: 783, y: 217, r: 32 }, // Top-Right
  H: { x: 783, y: 783, r: 32 }, // Bottom-Right
  I: { x: 217, y: 783, r: 32 }, // Bottom-Left
  
  // Intermediate Diamond
  P: { x: 500, y: 200, r: 18 },
  K: { x: 500, y: 300, r: 24 },
  T: { x: 500, y: 400, r: 18 },
  
  Q: { x: 800, y: 500, r: 24 },
  L: { x: 700, y: 500, r: 24 },
  
  N: { x: 500, y: 800, r: 24 },
  M: { x: 500, y: 700, r: 24 },
  
  O: { x: 200, y: 500, r: 24 },
  J: { x: 300, y: 500, r: 24 },
  S: { x: 400, y: 500, r: 18 },

  // Intermediate Square
  G1: { x: 712, y: 288, r: 22 },
  G2: { x: 641, y: 359, r: 22 },
  F1: { x: 288, y: 288, r: 22 },
  F2: { x: 359, y: 359, r: 22 },
  H1: { x: 712, y: 712, r: 22 },
  H2: { x: 641, y: 641, r: 22 },
  I1: { x: 288, y: 712, r: 22 },
  I2: { x: 359, y: 641, r: 22 },
  
  L2: { x: 570, y: 500, r: 22 },
  L1: { x: 635, y: 500, r: 22 },
  
  // Bridge
  R:  { x: 600, y: 600, r: 22 },
  R1: { x: 550, y: 650, r: 18 },
  R2: { x: 650, y: 550, r: 18 },
}

interface NodeProps {
  point: MatrixPoint
  onEnter: (p: MatrixPoint) => void
  onLeave: () => void
}

const Node = ({ point, onEnter, onLeave }: NodeProps) => {
  const coord = COORDS[point.key] || { x: 0, y: 0, r: 20 }
  const isLarge = coord.r > 30

  return (
    <g 
      className="cursor-pointer transition-all duration-300 hover:scale-110 group"
      style={{ transformOrigin: `${coord.x}px ${coord.y}px` }}
      onMouseEnter={() => onEnter(point)}
      onMouseLeave={onLeave}
    >
      <g className="animate-node-pulse" style={{ transformOrigin: `${coord.x}px ${coord.y}px` }}>
        {/* Color-matched Aura Circle */}
        <circle 
          cx={coord.x} cy={coord.y} r={coord.r + 6} 
          fill={point.color} 
          className="animate-node-aura"
        />
        
        {/* Main Node Circle */}
        <circle cx={coord.x} cy={coord.y} r={coord.r} fill="white" stroke={point.color} strokeWidth={isLarge ? "3" : "2"} />
        
        {/* Number Label */}
        <text x={coord.x} y={coord.y} textAnchor="middle" dominantBaseline="middle" fill="#1e293b" fontSize={isLarge ? "20" : "14"} fontWeight="800">
          {point.number}
        </text>
      </g>
    </g>
  )
}

export default function EsotericMatrix({ result, className = "" }: { result: DestinyMatrixResult, className?: string }) {
  const [hoveredNode, setHoveredNode] = useState<MatrixPoint | null>(null)

  const handleEnter = (p: MatrixPoint) => setHoveredNode(p)
  const handleLeave = () => setHoveredNode(null)

  const renderStructuralLines = () => {
    const stroke = 'rgba(203, 213, 225, 0.4)'
    // Outer octagon: A-F-B-G-C-H-D-I-A
    const octPoints = `${COORDS.A.x},${COORDS.A.y} ${COORDS.F.x},${COORDS.F.y} ${COORDS.B.x},${COORDS.B.y} ${COORDS.G.x},${COORDS.G.y} ${COORDS.C.x},${COORDS.C.y} ${COORDS.H.x},${COORDS.H.y} ${COORDS.D.x},${COORDS.D.y} ${COORDS.I.x},${COORDS.I.y}`
    
    return (
      <g id="geometry-lines" stroke={stroke} strokeWidth="1.5" fill="none">
        {/* Aura Layer 1: Full Octagon Breath (Continuous Glow) */}
        <polygon
          points={octPoints}
          className="animate-aura-breathe"
          stroke="#8B5CF6"
          strokeWidth="10"
          filter="url(#aura-blur)"
          strokeLinecap="round"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />

        {/* Aura Layer 2: Flowing Energy (Clockwise Trace) */}
        <polygon
          points={octPoints}
          className="animate-aura-trace"
          stroke="#8B5CF6"
          strokeWidth="14"
          strokeDasharray="600 1850"
          filter="url(#aura-blur)"
          strokeLinecap="round"
          opacity="0.35"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />

        {/* Outer Octagon Shell */}
        <polygon points={octPoints} strokeWidth="2" />
        
        {/* Main Diamond (A-B-C-D) - Rotating CW */}
        <g className="animate-rotate-slow" style={{ transformOrigin: `${CTR}px ${CTR}px` }}>
          <polygon points={`${COORDS.B.x},${COORDS.B.y} ${COORDS.C.x},${COORDS.C.y} ${COORDS.D.x},${COORDS.D.y} ${COORDS.A.x},${COORDS.A.y}`} strokeWidth="2.5" />
        </g>
        
        {/* Main Square (F-G-H-I) - Rotating CCW */}
        <g className="animate-rotate-ccw" style={{ transformOrigin: `${CTR}px ${CTR}px` }}>
          <polygon points={`${COORDS.F.x},${COORDS.F.y} ${COORDS.G.x},${COORDS.G.y} ${COORDS.H.x},${COORDS.H.y} ${COORDS.I.x},${COORDS.I.y}`} strokeWidth="2.5" />
        </g>
        
        {/* Radial Axes (dashed) - Flowing */}
        <line x1={COORDS.A.x} y1={COORDS.A.y} x2={COORDS.C.x} y2={COORDS.C.y} strokeDasharray="6 4" opacity="0.5" className="animate-dash-scroll" />
        <line x1={COORDS.B.x} y1={COORDS.B.y} x2={COORDS.D.x} y2={COORDS.D.y} strokeDasharray="6 4" opacity="0.5" className="animate-dash-scroll" />
        <line x1={COORDS.F.x} y1={COORDS.F.y} x2={COORDS.H.x} y2={COORDS.H.y} strokeDasharray="6 4" opacity="0.5" className="animate-dash-scroll" />
        <line x1={COORDS.G.x} y1={COORDS.G.y} x2={COORDS.I.x} y2={COORDS.I.y} strokeDasharray="6 4" opacity="0.5" className="animate-dash-scroll" />
      </g>
    )
  }

  const renderChakraLines = () => {
    return (
      <g id="chakra-lines" strokeWidth="4" opacity="0.3" fill="none">
        {Object.values(result.chakraMap).map((chakra) => {
          const p1 = COORDS[chakra.points[0]]
          const p2 = COORDS[chakra.points[1]]
          if (!p1 || !p2 || (chakra.points[0] === chakra.points[1] && chakra.points[0] === 'E')) {
             return null // Center chakra (Manipura) is just the node
          }
          return (
            <line 
              key={chakra.name}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={chakra.color}
            />
          )
        })}
      </g>
    )
  }

  const renderAgeCircleDigits = () => {
    const sequence = ['A', 'F', 'B', 'G', 'C', 'H', 'D', 'I']
    
    // Helper to format the years based on the photo style
    const getYearLabel = (age: number) => {
      const rem = age % 10
      const r = Math.round(rem * 100) / 100 
      // Show major .5 points and sub-points with 1 decimal to keep them compact
      if (r === 0) return "" // Main points (0, 10...) are labeled separately
      return age.toString()
    }

    return (
      <g id="age-circle-layer" className="animate-rotate-slow" style={{ transformOrigin: `${CTR}px ${CTR}px` }}>
        <style>
          {`
            @keyframes rotate-outer {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes glow-subtle {
              0% { opacity: 0.4; }
              50% { opacity: 0.8; }
              100% { opacity: 0.4; }
            }
            .animate-rotate-slow {
              animation: rotate-outer 100s linear infinite;
            }
            .animate-glow-pulse {
              animation: glow-subtle 4s ease-in-out infinite;
            }
            @keyframes aura-trace {
              from { stroke-dashoffset: 2500; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes aura-breath {
              0%, 100% { stroke-opacity: 0.15; stroke-width: 10px; }
              50% { stroke-opacity: 0.45; stroke-width: 18px; }
            }
            .animate-aura-trace {
              animation: aura-trace 15s linear infinite;
            }
            .animate-aura-breathe {
              animation: aura-breath 4s ease-in-out infinite;
            }
            @keyframes rotate-ccw {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .animate-rotate-ccw {
              animation: rotate-ccw 100s linear infinite;
            }
            @keyframes node-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.04); }
            }
            @keyframes node-aura-pulse {
              0%, 100% { fill-opacity: 0.08; }
              50% { fill-opacity: 0.25; }
            }
            .animate-node-pulse {
              animation: node-pulse 3s ease-in-out infinite;
              animation-delay: inherit;
            }
            .animate-node-aura {
              animation: node-aura-pulse 3s ease-in-out infinite;
              animation-delay: inherit;
            }
            @keyframes dash-scroll {
              from { stroke-dashoffset: 60; }
              to { stroke-dashoffset: 0; }
            }
            .animate-dash-scroll {
              animation: dash-scroll 3s linear infinite;
            }
          `}
        </style>
        {sequence.map((startKey, idx) => {
          const endKey = sequence[(idx + 1) % 8]
          const p1 = COORDS[startKey]
          const p2 = COORDS[endKey]
          if (!p1 || !p2) return null

          // Perpendicular angle for rotation of internal text
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)

          return [1, 2, 3, 4, 5, 6, 7].map((j) => {
            const t = j / 8
            const x = p1.x + (p2.x - p1.x) * t
            const y = p1.y + (p2.y - p1.y) * t
            
            // Shared outward direction
            const dx = x - CTR
            const dy = y - CTR
            const len = Math.sqrt(dx * dx + dy * dy)
            const ux = dx / len
            const uy = dy / len

            const point = result.ageCircle[idx * 8 + j]
            if (!point) return null

            // 1. External Arcana Digit (Outward)
            const offOut = 30
            const oxO = x + ux * offOut
            const oyO = y + uy * offOut

            // 2. Internal Age Label (Inward)
            const offIn = 34
            const oxI = x - ux * offIn
            const oyI = y - uy * offIn
            const yearText = getYearLabel(point.age)

            return (
              <g key={`${startKey}-${j}`} className="animate-glow-pulse">
                {/* External Arcanum */}
                <text x={oxO} y={oyO} fill="#8B5CF6" fontSize="13" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                  {point.number}
                </text>
                
                {/* Internal Age Range (Rotated) */}
                {yearText && (
                  <text 
                    x={oxI} y={oyI} fill="#C4B5FD" fontSize="10" fontWeight="800" opacity="1"
                    textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${angle}, ${oxI}, ${oyI})`}
                  >
                    {yearText}
                  </text>
                )}
              </g>
            )
          })
        })}
      </g>
    )
  }

  return (
    <div className={`relative w-full max-w-4xl mx-auto p-4 bg-transparent ${className}`}>
      {/* Custom Tooltip */}
      {hoveredNode && (() => {
        const c = COORDS[hoveredNode.key]
        return (
          <div 
            className="absolute z-[9999] pointer-events-none -translate-x-1/2 -translate-y-[calc(100%+20px)]
                       bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] border border-slate-100
                       p-4 w-64 animate-fade-up"
            style={{ left: `${(c.x / VIEWBOX) * 100}%`, top: `${(c.y / VIEWBOX) * 100}%` }}
          >
            <div className="flex flex-col gap-2">
              <div className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400">
                Punto {hoveredNode.key} · {hoveredNode.formula}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  {hoveredNode.number}
                </div>
                <div className="flex flex-col">
                  <div className="text-base font-bold text-slate-800 leading-tight">
                    {hoveredNode.label}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {getArcana(hoveredNode.number).name}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
          </div>
        )
      })()}

      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="w-full h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT_SANS }}
      >
        <defs>
          <filter id="aura-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" result="blur" />
          </filter>
          <radialGradient id="grad-center-esoteric" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CTR} cy={CTR} r={400} fill="url(#grad-center-esoteric)" />

        {/* 1. Structural Layer */}
        {renderStructuralLines()}

        {/* 2. Chakra Map Layer (Page 108) */}
        {renderChakraLines()}

        {/* 3. Bridge Line - Flowing */}
        <line x1={COORDS.M.x} y1={COORDS.M.y} x2={COORDS.L.x} y2={COORDS.L.y} stroke="#f472b6" strokeWidth="2.5" strokeDasharray="8 4" opacity="0.6" className="animate-dash-scroll" />

        {/* 4. Nodes Layer */}
        {Object.values(result.points).map((point, i) => (
          <g key={point.key} style={{ animationDelay: `${(i % 12) * 0.1}s` }}>
             <Node point={point} onEnter={handleEnter} onLeave={handleLeave} />
          </g>
        ))}

        {/* 5. Age Cycle Layer (The 80 numbers) */}
        {renderAgeCircleDigits()}
        
        {/* Age Labels (Increased distance from schema) */}
        <g fill="#94A3B8" fontSize="13" fontWeight="700">
          <text x="500" y="55" textAnchor="middle">20 years</text>
          <text x="940" y="500" textAnchor="start">40 years</text>
          <text x="500" y="945" textAnchor="middle">60 years</text>
          <text x="60" y="500" textAnchor="end">0 years</text>
          <text x="175" y="175" textAnchor="middle" transform="rotate(-45, 175, 175)">10 years</text>
          <text x="825" y="175" textAnchor="middle" transform="rotate(45, 825, 175)">30 years</text>
          <text x="825" y="825" textAnchor="middle" transform="rotate(-45, 825, 825)">50 years</text>
          <text x="175" y="825" textAnchor="middle" transform="rotate(45, 175, 825)">70 years</text>
        </g>
      </svg>
    </div>
  )
}
