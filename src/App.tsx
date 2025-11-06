import Viewport3D from './components/Viewport3D'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import TopToolbar from './components/TopToolbar'

function App() {
  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <TopToolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Viewport3D />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  )
}

export default App
