export type NodeGroup = 'earth' | 'growth' | 'mental' | 'karmic' | 'secondary'

export type NodeSize = 'large' | 'medium' | 'small'

export interface MatrixNode {
  id: string
  number: number
  group: NodeGroup
  size: NodeSize
  angle: number // 0 to 360, 0 is North
  radius: number // percentage of outer radius (0 to 1)
  label?: string
}

export interface EsotericMatrixData {
  centerNumber: number
  nodes: MatrixNode[]
}

export const NODE_COLORS: Record<NodeGroup, string> = {
  earth: '#8B5E3C',     // Warm Brown
  growth: '#2D6a4f',    // Forest Green
  mental: '#1A759F',    // Ocean Blue
  karmic: '#BC4749',    // Soft Red
  secondary: '#94A3B8', // Slate Grey
}

export const DEFAULT_MATRIX_DATA: EsotericMatrixData = {
  centerNumber: 15,
  nodes: [
    // Main vertices (Large)
    { id: 'north', number: 5, group: 'earth', size: 'large', angle: 0, radius: 1, label: 'Ancestrale' },
    { id: 'ne', number: 8, group: 'growth', size: 'large', angle: 45, radius: 1, label: 'Spirito' },
    { id: 'east', number: 21, group: 'mental', size: 'large', angle: 90, radius: 1, label: 'Mondo' },
    { id: 'se', number: 10, group: 'karmic', size: 'large', angle: 135, radius: 1, label: 'Fortuna' },
    { id: 'south', number: 3, group: 'earth', size: 'large', angle: 180, radius: 1, label: 'Radici' },
    { id: 'sw', number: 18, group: 'growth', size: 'large', angle: 225, radius: 1, label: 'Luna' },
    { id: 'west', number: 7, group: 'mental', size: 'large', angle: 270, radius: 1, label: 'Carro' },
    { id: 'nw', number: 11, group: 'karmic', size: 'large', angle: 315, radius: 1, label: 'Forza' },

    // Middle nodes (Medium)
    { id: 'm1', number: 14, group: 'secondary', size: 'medium', angle: 0, radius: 0.5 },
    { id: 'm2', number: 22, group: 'secondary', size: 'medium', angle: 90, radius: 0.5 },
    { id: 'm3', number: 9, group: 'secondary', size: 'medium', angle: 180, radius: 0.5 },
    { id: 'm4', number: 4, group: 'secondary', size: 'medium', angle: 270, radius: 0.5 },

    // Secondary nodes (Small)
    { id: 's1', number: 12, group: 'secondary', size: 'small', angle: 22.5, radius: 0.75 },
    { id: 's2', number: 16, group: 'secondary', size: 'small', angle: 112.5, radius: 0.75 },
    { id: 's3', number: 2, group: 'secondary', size: 'small', angle: 202.5, radius: 0.75 },
    { id: 's4', number: 6, group: 'secondary', size: 'small', angle: 292.5, radius: 0.75 },
  ]
}
