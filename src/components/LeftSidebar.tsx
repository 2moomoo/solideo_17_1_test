import { useState } from 'react'
import { Package, Sparkles } from 'lucide-react'
import AssetLibrary from './AssetLibrary'
import AIPanel from './AIPanel'

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'assets' | 'ai'>('assets')

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'assets'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
          onClick={() => setActiveTab('assets')}
        >
          <Package size={18} />
          <span className="font-medium">Asset Library</span>
        </button>
        <button
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'ai'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-750'
          }`}
          onClick={() => setActiveTab('ai')}
        >
          <Sparkles size={18} />
          <span className="font-medium">AI Assistant</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'assets' ? <AssetLibrary /> : <AIPanel />}
      </div>
    </div>
  )
}
