import AIIconPanel from './components/AIIconPanel'
import PolygonCanvas from './components/PolygonCanvas'
import PolygonEditor from './components/PolygonEditor'
import { useIconStore } from './stores/iconStore'

function App() {
  const icons = useIconStore(state => state.icons)

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎨</div>
          <div>
            <h1 className="text-white font-semibold text-lg">Tech Stack Icon Designer</h1>
            <p className="text-xs text-gray-400">AI-Powered Polygon Editor</p>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {icons.length} icon{icons.length !== 1 ? 's' : ''} • {icons.reduce((sum, icon) => sum + icon.polygons.length, 0)} polygon{icons.reduce((sum, icon) => sum + icon.polygons.length, 0) !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Icon Generator */}
        <AIIconPanel />

        {/* Center - Canvas */}
        <PolygonCanvas />

        {/* Right Panel - Polygon Editor */}
        <PolygonEditor />
      </div>
    </div>
  )
}

export default App
