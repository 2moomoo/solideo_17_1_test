import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import type { DiagramNodeData } from '../types'

function CustomNode({ data, selected }: NodeProps<DiagramNodeData>) {
  const hasCustomShape = data.customShape && data.customShape.svgPath

  return (
    <div
      className={`relative transition-all ${
        selected ? 'ring-2 ring-purple-500 ring-offset-2' : ''
      }`}
      style={{ minWidth: 120, minHeight: 80 }}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />

      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-lg border-2 border-gray-300">
        {/* Custom SVG Shape or Icon */}
        {hasCustomShape ? (
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            className="mb-2"
          >
            <path
              d={data.customShape!.svgPath}
              fill={data.customShape!.fill || '#4A90E2'}
              stroke={data.customShape!.stroke || '#2E5C8A'}
              strokeWidth={data.customShape!.strokeWidth || 2}
            />
          </svg>
        ) : (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-2"
            style={{ backgroundColor: data.color || '#4A90E2' }}
          >
            {data.icon || '📦'}
          </div>
        )}

        {/* Label */}
        <div className="text-sm font-semibold text-gray-800 text-center">
          {data.label}
        </div>

        {/* Category badge */}
        {data.category && (
          <div className="mt-1 px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-600">
            {data.category}
          </div>
        )}

        {/* Description (tooltip on hover) */}
        {data.description && (
          <div className="absolute hidden group-hover:block top-full mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 w-48">
            {data.description}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CustomNode)
