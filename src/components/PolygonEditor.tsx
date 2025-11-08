import { useLayoutStore } from '../stores/layoutStore'

export default function PolygonEditor() {
  const { selectedPolygonId, getSelectedPolygon, updatePolygon } = useLayoutStore()

  const selectedPolygon = getSelectedPolygon()

  if (!selectedPolygonId || !selectedPolygon) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-sm font-medium">No polygon selected</p>
          <p className="text-xs mt-1">Click a polygon to edit its properties</p>
        </div>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<typeof selectedPolygon>) => {
    if (selectedPolygonId) {
      updatePolygon(selectedPolygonId, updates)
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Polygon</h2>

      <div className="space-y-4">
        {/* Polygon ID */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Polygon ID</label>
          <div className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded border border-gray-200">
            {selectedPolygon.id}
          </div>
        </div>

        {/* Fill Color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedPolygon.fill}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={selectedPolygon.fill}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stroke Color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Stroke Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedPolygon.stroke}
              onChange={(e) => handleUpdate({ stroke: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={selectedPolygon.stroke}
              onChange={(e) => handleUpdate({ stroke: e.target.value })}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Stroke Width: {selectedPolygon.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={selectedPolygon.strokeWidth}
            onChange={(e) => handleUpdate({ strokeWidth: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Opacity: {((selectedPolygon.opacity || 1) * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedPolygon.opacity || 1}
            onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* SVG Path Data */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">SVG Path Data</label>
          <textarea
            value={selectedPolygon.svgPath}
            onChange={(e) => handleUpdate({ svgPath: e.target.value })}
            className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="M 0 0 L 100 0 L 100 100 Z"
          />
          <p className="text-xs text-gray-500 mt-1">
            Edit SVG path commands directly (M, L, C, Q, A, Z)
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="block text-xs font-medium text-gray-600 mb-2">Preview</label>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '150px' }}>
          <svg viewBox="0 0 200 200" className="w-32 h-32">
            <path
              d={selectedPolygon.svgPath}
              fill={selectedPolygon.fill}
              stroke={selectedPolygon.stroke}
              strokeWidth={selectedPolygon.strokeWidth}
              opacity={selectedPolygon.opacity || 1}
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
