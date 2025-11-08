import { useState, useRef } from 'react'
import TechStackSelector from './components/TechStackSelector'
import AIStylePanel from './components/AIStylePanel'
import PolygonCanvas, { PolygonCanvasRef } from './components/PolygonCanvas'
import PolygonEditor from './components/PolygonEditor'
import { useLayoutStore } from './stores/layoutStore'

function App() {
  const [selectedStacks, setSelectedStacks] = useState<string[]>([])
  const { elements, backgroundPolygons, clearLayout } = useLayoutStore()
  const canvasRef = useRef<PolygonCanvasRef>(null)

  const totalPolygons = backgroundPolygons.length + elements.reduce((sum, el) => sum + el.polygons.length, 0)

  const handleExport = () => {
    if (!canvasRef.current) return

    const dataUrl = canvasRef.current.exportImage()

    // Download the image
    const link = document.createElement('a')
    link.download = `tech-stack-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚂</div>
          <div>
            <h1 className="text-white font-semibold text-lg">Tech Stack Visualizer</h1>
            <p className="text-xs text-gray-400">AI-Powered Design Tool</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {selectedStacks.length} selected • {elements.length} elements • {totalPolygons} polygons
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearLayout}
              disabled={elements.length === 0}
              className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <button
              onClick={handleExport}
              disabled={elements.length === 0}
              className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tech Stack Selection + AI Style */}
        <div className="flex flex-col">
          <TechStackSelector
            selectedStacks={selectedStacks}
            onSelectionChange={setSelectedStacks}
          />
          <AIStylePanel selectedStacks={selectedStacks} />
        </div>

        {/* Center - Canvas */}
        <PolygonCanvas ref={canvasRef} />

        {/* Right Panel - Polygon Editor */}
        <PolygonEditor />
      </div>
    </div>
  )
}

export default App
