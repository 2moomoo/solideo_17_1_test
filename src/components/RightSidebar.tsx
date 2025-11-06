import { useState } from 'react'
import { Settings, Palette, Image } from 'lucide-react'
import PropertiesPanel from './PropertiesPanel'
import SceneSettingsPanel from './SceneSettingsPanel'
import RenderPanel from './RenderPanel'

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'properties' | 'scene' | 'render'>('properties')

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'properties'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          <Palette size={16} />
          <span className="font-medium text-sm">Properties</span>
        </button>
        <button
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'scene'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
          onClick={() => setActiveTab('scene')}
        >
          <Settings size={16} />
          <span className="font-medium text-sm">Scene</span>
        </button>
        <button
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'render'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
          onClick={() => setActiveTab('render')}
        >
          <Image size={16} />
          <span className="font-medium text-sm">Render</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && <PropertiesPanel />}
        {activeTab === 'scene' && <SceneSettingsPanel />}
        {activeTab === 'render' && <RenderPanel />}
      </div>
    </div>
  )
}
