import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import type { DiagramNodeData } from '../types'

function CustomNode({ data, selected }: NodeProps<DiagramNodeData>) {
  const hasCustomShape = data.customShape && data.customShape.svgPath
  const backgroundColor = data.color || '#3B82F6'

  return (
    <div
      className={`relative transition-all ${
        selected ? 'ring-4 ring-purple-400 ring-opacity-50' : ''
      }`}
      style={{ minWidth: 140, minHeight: 100 }}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />

      {hasCustomShape ? (
        /* Custom SVG Shape Node */
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-xl border-2 border-gray-200 hover:shadow-2xl transition-shadow">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="mb-3"
          >
            <path
              d={data.customShape!.svgPath}
              fill={data.customShape!.fill || '#4A90E2'}
              stroke={data.customShape!.stroke || '#2E5C8A'}
              strokeWidth={data.customShape!.strokeWidth || 2}
            />
          </svg>
          <div className="text-sm font-bold text-gray-800 text-center">
            {data.label}
          </div>
          {data.category && (
            <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              ✨ AI Generated
            </div>
          )}
        </div>
      ) : (
        /* Standard Icon Node with Color Background */
        <div
          className="flex flex-col items-center justify-center p-4 rounded-xl shadow-xl border-2 border-white hover:shadow-2xl transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${backgroundColor} 0%, ${adjustBrightness(backgroundColor, -20)} 100%)`,
            minWidth: 140,
            minHeight: 100
          }}
        >
          {/* Icon with white background circle */}
          <div className="w-14 h-14 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 shadow-lg">
            <div className="text-4xl filter drop-shadow-md">
              {data.icon || '📦'}
            </div>
          </div>

          {/* Label */}
          <div className="text-sm font-bold text-white text-center drop-shadow-md">
            {data.label}
          </div>

          {/* Category badge */}
          {data.category && (
            <div className="mt-2 px-3 py-1 bg-white bg-opacity-25 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
              {data.category}
            </div>
          )}
        </div>
      )}

      {/* Description tooltip on hover */}
      {data.description && (
        <div className="absolute hidden group-hover:block top-full mt-2 left-1/2 transform -translate-x-1/2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl z-50 w-64 whitespace-normal">
          <div className="font-semibold mb-1">{data.label}</div>
          <div className="text-gray-300">{data.description}</div>
        </div>
      )}
    </div>
  )
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default memo(CustomNode)
