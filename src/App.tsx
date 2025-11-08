import { useState } from 'react'
import { Box, Library } from 'lucide-react'
import Canvas2D from './components/Canvas2D'
import Viewer3DModal from './components/Viewer3DModal'
import AIPanel2D from './components/AIPanel2D'
import AssetLibrary2D from './components/AssetLibrary2D'
import { useDiagramStore } from './stores/diagramStore'

function App() {
  const { nodes, edges, setNodes, setEdges } = useDiagramStore()
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [leftPanel, setLeftPanel] = useState<'ai' | 'library'>('ai')

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎨</div>
          <div>
            <h1 className="text-white font-semibold text-lg">AI Diagram Studio</h1>
            <p className="text-xs text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>

        {/* 3D Viewer Button */}
        <button
          onClick={() => setShow3DViewer(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Box size={18} />
          View in 3D
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Panel / Asset Library */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                leftPanel === 'ai'
                  ? 'bg-gray-700 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setLeftPanel('ai')}
            >
              <Box size={16} />
              AI Assistant
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                leftPanel === 'library'
                  ? 'bg-gray-700 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => setLeftPanel('library')}
            >
              <Library size={16} />
              Library
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {leftPanel === 'ai' ? <AIPanel2D /> : <AssetLibrary2D />}
          </div>
        </div>

        {/* 2D Canvas (Main) */}
        <div className="flex-1 relative bg-gray-100">
          <Canvas2D
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
        </div>

        {/* Right Sidebar - Properties/Info (future) */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <h3 className="text-white font-semibold mb-4">Properties</h3>
          <div className="text-gray-400 text-sm">
            <p>Select a node to edit properties</p>
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-xs">
                <strong className="text-white">Quick Start:</strong>
              </p>
              <ol className="text-xs mt-2 space-y-1 list-decimal list-inside">
                <li>Use AI panel to generate diagrams</li>
                <li>Drag nodes to rearrange</li>
                <li>Click nodes to connect them</li>
                <li>View in 3D for presentations</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewer Modal */}
      <Viewer3DModal
        isOpen={show3DViewer}
        onClose={() => setShow3DViewer(false)}
      />
    </div>
  )
}

export default App
