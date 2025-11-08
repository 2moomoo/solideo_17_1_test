import { create } from 'zustand'
import type { Asset, StylePreset, GeometryType } from '../types'
import { useSceneStore } from './sceneStore'

interface AssetState {
  assets: Asset[]
  filteredAssets: Asset[]
  selectedCategory: string | null
  searchQuery: string
  stylePresets: StylePreset[]
  currentStyleId: string

  // Actions
  setAssets: (assets: Asset[]) => void
  filterByCategory: (category: string | null) => void
  searchAssets: (query: string) => void
  addAsset: (asset: Asset) => void
  addStylePreset: (preset: StylePreset) => void
  setCurrentStyle: (styleId: string) => void
  applyStyleToAssets: (styleId: string) => void
}

// Tech Stack Assets
const techStackAssets: Asset[] = [
  // Language (언어) - Cylinder
  {
    id: 'tech-nodejs',
    name: 'Node.js',
    category: 'Language',
    tags: ['javascript', 'runtime', 'server'],
    thumbnail: '🟢',
    description: 'JavaScript runtime built on Chrome V8',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#339933',
    displayText: 'Node.js'
  },
  {
    id: 'tech-python',
    name: 'Python',
    category: 'Language',
    tags: ['language', 'ai', 'data'],
    thumbnail: '🐍',
    description: 'High-level programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#3776AB',
    displayText: 'Python'
  },
  {
    id: 'tech-java',
    name: 'Java',
    category: 'Language',
    tags: ['language', 'enterprise', 'jvm'],
    thumbnail: '☕',
    description: 'Object-oriented programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#007396',
    displayText: 'Java'
  },
  {
    id: 'tech-golang',
    name: 'Go',
    category: 'Language',
    tags: ['language', 'google', 'concurrent'],
    thumbnail: '🔷',
    description: 'Statically typed compiled language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#00ADD8',
    displayText: 'Go'
  },
  {
    id: 'tech-rust',
    name: 'Rust',
    category: 'Language',
    tags: ['language', 'performance', 'memory-safe'],
    thumbnail: '🦀',
    description: 'Fast and memory-efficient language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#CE422B',
    displayText: 'Rust'
  },
  {
    id: 'tech-swift',
    name: 'Swift',
    category: 'Language',
    tags: ['ios', 'apple', 'language'],
    thumbnail: '🍎',
    description: 'Powerful language for iOS development',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#FA7343',
    displayText: 'Swift'
  },
  {
    id: 'tech-kotlin',
    name: 'Kotlin',
    category: 'Language',
    tags: ['android', 'jvm', 'language'],
    thumbnail: '🤖',
    description: 'Modern language for Android development',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 },
    color: '#7F52FF',
    displayText: 'Kotlin'
  },

  // Framework (프레임워크) - Box
  {
    id: 'tech-react',
    name: 'React',
    category: 'Framework',
    tags: ['javascript', 'ui', 'library', 'meta'],
    thumbnail: '⚛️',
    description: 'JavaScript library for building user interfaces',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#61DAFB',
    displayText: 'React'
  },
  {
    id: 'tech-vue',
    name: 'Vue.js',
    category: 'Framework',
    tags: ['javascript', 'ui', 'framework', 'progressive'],
    thumbnail: '💚',
    description: 'Progressive JavaScript framework',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#42B883',
    displayText: 'Vue.js'
  },
  {
    id: 'tech-angular',
    name: 'Angular',
    category: 'Framework',
    tags: ['typescript', 'ui', 'framework', 'google'],
    thumbnail: '🅰️',
    description: 'Platform for building web applications',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#DD0031',
    displayText: 'Angular'
  },
  {
    id: 'tech-svelte',
    name: 'Svelte',
    category: 'Framework',
    tags: ['javascript', 'ui', 'framework', 'compiler'],
    thumbnail: '🔥',
    description: 'Cybernetically enhanced web apps',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#FF3E00',
    displayText: 'Svelte'
  },
  {
    id: 'tech-nextjs',
    name: 'Next.js',
    category: 'Framework',
    tags: ['react', 'ssr', 'framework', 'vercel'],
    thumbnail: '▲',
    description: 'React framework for production',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#000000',
    displayText: 'Next.js'
  },
  {
    id: 'tech-react-native',
    name: 'React Native',
    category: 'Framework',
    tags: ['react', 'ios', 'android', 'cross-platform'],
    thumbnail: '📱',
    description: 'Build native mobile apps using React',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#61DAFB',
    displayText: 'RN'
  },
  {
    id: 'tech-flutter',
    name: 'Flutter',
    category: 'Framework',
    tags: ['dart', 'google', 'cross-platform'],
    thumbnail: '🦋',
    description: 'UI toolkit for mobile, web, and desktop',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#02569B',
    displayText: 'Flutter'
  },

  // Database (데이터베이스) - Torus
  {
    id: 'tech-mongodb',
    name: 'MongoDB',
    category: 'Database',
    tags: ['nosql', 'document', 'database'],
    thumbnail: '🍃',
    description: 'Document-oriented NoSQL database',
    geometryType: 'torus',
    geometryParams: { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 100 },
    color: '#47A248',
    displayText: 'MongoDB'
  },
  {
    id: 'tech-postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    tags: ['sql', 'relational', 'database'],
    thumbnail: '🐘',
    description: 'Advanced open-source relational database',
    geometryType: 'torus',
    geometryParams: { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 100 },
    color: '#336791',
    displayText: 'PostgreSQL'
  },
  {
    id: 'tech-mysql',
    name: 'MySQL',
    category: 'Database',
    tags: ['sql', 'relational', 'database'],
    thumbnail: '🐬',
    description: 'Popular open-source relational database',
    geometryType: 'torus',
    geometryParams: { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 100 },
    color: '#4479A1',
    displayText: 'MySQL'
  },
  {
    id: 'tech-redis',
    name: 'Redis',
    category: 'Database',
    tags: ['cache', 'in-memory', 'key-value'],
    thumbnail: '🔴',
    description: 'In-memory data structure store',
    geometryType: 'torus',
    geometryParams: { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 100 },
    color: '#DC382D',
    displayText: 'Redis'
  },

  // Tools (도구) - Sphere
  {
    id: 'tech-docker',
    name: 'Docker',
    category: 'Tools',
    tags: ['container', 'deployment', 'virtualization'],
    thumbnail: '🐳',
    description: 'Platform for containerized applications',
    geometryType: 'sphere',
    geometryParams: { radius: 0.6, widthSegments: 32, heightSegments: 32 },
    color: '#2496ED',
    displayText: 'Docker'
  },
  {
    id: 'tech-kubernetes',
    name: 'Kubernetes',
    category: 'Tools',
    tags: ['orchestration', 'container', 'k8s'],
    thumbnail: '☸️',
    description: 'Container orchestration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 0.6, widthSegments: 32, heightSegments: 32 },
    color: '#326CE5',
    displayText: 'K8s'
  },
  {
    id: 'tech-aws',
    name: 'AWS',
    category: 'Tools',
    tags: ['cloud', 'amazon', 'infrastructure'],
    thumbnail: '☁️',
    description: 'Amazon Web Services cloud platform',
    geometryType: 'sphere',
    geometryParams: { radius: 0.6, widthSegments: 32, heightSegments: 32 },
    color: '#FF9900',
    displayText: 'AWS'
  },
  {
    id: 'tech-github',
    name: 'GitHub',
    category: 'Tools',
    tags: ['git', 'version-control', 'collaboration'],
    thumbnail: '🐙',
    description: 'Code hosting and collaboration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 0.6, widthSegments: 32, heightSegments: 32 },
    color: '#181717',
    displayText: 'GitHub'
  }
]

// Style Presets
const defaultStylePresets: StylePreset[] = [
  {
    id: 'default',
    name: 'Default Style',
    description: 'Original tech stack categorization',
    categoryMappings: {
      Language: 'cylinder',
      Framework: 'box',
      Database: 'torus',
      Tools: 'sphere'
    }
  }
]

// Helper function to get geometry params based on type
function getGeometryParams(geometryType: GeometryType): Record<string, any> {
  switch (geometryType) {
    case 'sphere':
      return { radius: 0.6, widthSegments: 32, heightSegments: 32 }
    case 'cylinder':
      return { radiusTop: 0.5, radiusBottom: 0.5, height: 1, radialSegments: 32 }
    case 'box':
      return { width: 1, height: 1, depth: 1 }
    case 'cone':
      return { radius: 0.6, height: 1, radialSegments: 32 }
    case 'torus':
      return { radius: 0.5, tube: 0.2, radialSegments: 16, tubularSegments: 100 }
    default:
      return { width: 1, height: 1, depth: 1 }
  }
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: techStackAssets,
  filteredAssets: techStackAssets,
  selectedCategory: null,
  searchQuery: '',
  stylePresets: defaultStylePresets,
  currentStyleId: 'default',

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
  })),

  addStylePreset: (preset) => set((state) => {
    // Check if preset already exists
    const exists = state.stylePresets.find(p => p.id === preset.id)
    if (exists) {
      console.log('Style preset already exists:', preset.id)
      return state
    }
    console.log('Adding new style preset:', preset)
    return {
      stylePresets: [...state.stylePresets, preset]
    }
  }),

  setCurrentStyle: (styleId) => {
    console.log('setCurrentStyle called with:', styleId)
    set({ currentStyleId: styleId })
    get().applyStyleToAssets(styleId)
  },

  applyStyleToAssets: (styleId) => {
    const { stylePresets, assets } = get()
    const style = stylePresets.find(s => s.id === styleId)

    if (!style) return

    console.log('Applying style to assets:', style)

    // Update assets with new geometry based on style
    const updatedAssets = assets.map(asset => {
      // Don't apply style to AI Generated assets
      if (asset.category === 'AI Generated') {
        return asset
      }

      // Check if the asset's category exists in the style mappings
      if (asset.category && asset.category in style.categoryMappings) {
        const category = asset.category as keyof typeof style.categoryMappings
        const newGeometryType = style.categoryMappings[category]
        console.log(`Asset ${asset.name}: ${asset.geometryType} -> ${newGeometryType}`)
        return {
          ...asset,
          geometryType: newGeometryType,
          geometryParams: getGeometryParams(newGeometryType)
        }
      }

      return asset
    })

    set({ assets: updatedAssets })

    // Reapply filters
    get().filterByCategory(get().selectedCategory)

    // Update scene objects with new style
    useSceneStore.getState().applyStyleToObjects(style)
  }
}))
