import { create } from 'zustand'
import type { Asset } from '../types'

interface AssetState {
  assets: Asset[]
  filteredAssets: Asset[]
  selectedCategory: string | null
  searchQuery: string

  // Actions
  setAssets: (assets: Asset[]) => void
  filterByCategory: (category: string | null) => void
  searchAssets: (query: string) => void
  addAsset: (asset: Asset) => void
}

// Mock assets data
const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Cube',
    category: 'Primitives',
    tags: ['basic', 'geometry', '3d'],
    thumbnail: '📦',
    description: 'Basic cube primitive',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },
  {
    id: 'asset-2',
    name: 'Sphere',
    category: 'Primitives',
    tags: ['basic', 'geometry', 'round'],
    thumbnail: '🔮',
    description: 'Basic sphere primitive',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 }
  },
  {
    id: 'asset-3',
    name: 'Cylinder',
    category: 'Primitives',
    tags: ['basic', 'geometry', 'column'],
    thumbnail: '🛢️',
    description: 'Basic cylinder primitive',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 2, radialSegments: 32 }
  },
  {
    id: 'asset-4',
    name: 'Cone',
    category: 'Primitives',
    tags: ['basic', 'geometry', 'pyramid'],
    thumbnail: '🔺',
    description: 'Basic cone primitive',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 2, radialSegments: 32 }
  },
  {
    id: 'asset-5',
    name: 'Torus',
    category: 'Primitives',
    tags: ['basic', 'geometry', 'donut'],
    thumbnail: '🍩',
    description: 'Basic torus primitive',
    geometryType: 'torus',
    geometryParams: { radius: 1, tube: 0.4, radialSegments: 16, tubularSegments: 100 }
  }
]

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: mockAssets,
  filteredAssets: mockAssets,
  selectedCategory: null,
  searchQuery: '',

  setAssets: (assets) => set({ assets, filteredAssets: assets }),

  filterByCategory: (category) => {
    set({ selectedCategory: category })
    const { assets, searchQuery } = get()

    let filtered = category
      ? assets.filter(asset => asset.category === category)
      : assets

    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    set({ filteredAssets: filtered })
  },

  searchAssets: (query) => {
    set({ searchQuery: query })
    const { assets, selectedCategory } = get()

    let filtered = selectedCategory
      ? assets.filter(asset => asset.category === selectedCategory)
      : assets

    if (query) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }

    set({ filteredAssets: filtered })
  },

  addAsset: (asset) => set((state) => ({
    assets: [...state.assets, asset],
    filteredAssets: [...state.filteredAssets, asset]
  }))
}))
