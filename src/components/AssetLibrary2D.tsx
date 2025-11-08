import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAssetStore } from '../stores/assetStore'
import { useDiagramStore } from '../stores/diagramStore'
import type { DiagramNode } from '../types'

export default function AssetLibrary2D() {
  const { filteredAssets, searchAssets, filterByCategory, selectedCategory } = useAssetStore()
  const { addNode } = useDiagramStore()
  const [searchValue, setSearchValue] = useState('')

  const categories = ['All', 'Language', 'Framework', 'Database', 'Tools']

  const handleSearch = (value: string) => {
    setSearchValue(value)
    searchAssets(value)
  }

  const handleCategoryClick = (category: string) => {
    filterByCategory(category === 'All' ? null : category)
  }

  const handleAssetClick = (asset: any) => {
    // Create a new 2D node from the asset
    const newNode: DiagramNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 150
      },
      data: {
        label: asset.displayText || asset.name,
        icon: asset.thumbnail,
        category: asset.category,
        description: asset.description,
        color: asset.color,
        geometry3D: {
          type: asset.geometryType,
          params: asset.geometryParams
        }
      }
    }
    addNode(newNode)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg mb-1">Asset Library</h2>
        <p className="text-xs text-gray-400">Click to add to canvas</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              (selectedCategory === category) || (category === 'All' && !selectedCategory)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              className="aspect-square bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center justify-center p-3 group cursor-pointer"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="text-4xl mb-2">{asset.thumbnail}</div>
              <div className="text-white text-sm font-medium text-center">{asset.name}</div>
              {asset.aiGenerated && (
                <div className="text-xs text-purple-400 mt-1">✨ AI</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
