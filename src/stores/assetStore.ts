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

// Tech Stack Assets
const techStackAssets: Asset[] = [
  // Frontend
  {
    id: 'tech-react',
    name: 'React',
    category: 'Frontend',
    tags: ['javascript', 'ui', 'library', 'meta'],
    thumbnail: '⚛️',
    description: 'JavaScript library for building user interfaces',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },
  {
    id: 'tech-vue',
    name: 'Vue.js',
    category: 'Frontend',
    tags: ['javascript', 'ui', 'framework', 'progressive'],
    thumbnail: '💚',
    description: 'Progressive JavaScript framework',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },
  {
    id: 'tech-angular',
    name: 'Angular',
    category: 'Frontend',
    tags: ['typescript', 'ui', 'framework', 'google'],
    thumbnail: '🅰️',
    description: 'Platform for building web applications',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },
  {
    id: 'tech-svelte',
    name: 'Svelte',
    category: 'Frontend',
    tags: ['javascript', 'ui', 'framework', 'compiler'],
    thumbnail: '🔥',
    description: 'Cybernetically enhanced web apps',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },
  {
    id: 'tech-nextjs',
    name: 'Next.js',
    category: 'Frontend',
    tags: ['react', 'ssr', 'framework', 'vercel'],
    thumbnail: '▲',
    description: 'React framework for production',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 }
  },

  // Backend
  {
    id: 'tech-nodejs',
    name: 'Node.js',
    category: 'Backend',
    tags: ['javascript', 'runtime', 'server'],
    thumbnail: '🟢',
    description: 'JavaScript runtime built on Chrome V8',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-python',
    name: 'Python',
    category: 'Backend',
    tags: ['language', 'ai', 'data'],
    thumbnail: '🐍',
    description: 'High-level programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-java',
    name: 'Java',
    category: 'Backend',
    tags: ['language', 'enterprise', 'jvm'],
    thumbnail: '☕',
    description: 'Object-oriented programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-golang',
    name: 'Go',
    category: 'Backend',
    tags: ['language', 'google', 'concurrent'],
    thumbnail: '🔷',
    description: 'Statically typed compiled language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-rust',
    name: 'Rust',
    category: 'Backend',
    tags: ['language', 'performance', 'memory-safe'],
    thumbnail: '🦀',
    description: 'Fast and memory-efficient language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 }
  },

  // Database
  {
    id: 'tech-mongodb',
    name: 'MongoDB',
    category: 'Database',
    tags: ['nosql', 'document', 'database'],
    thumbnail: '🍃',
    description: 'Document-oriented NoSQL database',
    geometryType: 'torus',
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 }
  },
  {
    id: 'tech-postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    tags: ['sql', 'relational', 'database'],
    thumbnail: '🐘',
    description: 'Advanced open-source relational database',
    geometryType: 'torus',
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 }
  },
  {
    id: 'tech-mysql',
    name: 'MySQL',
    category: 'Database',
    tags: ['sql', 'relational', 'database'],
    thumbnail: '🐬',
    description: 'Popular open-source relational database',
    geometryType: 'torus',
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 }
  },
  {
    id: 'tech-redis',
    name: 'Redis',
    category: 'Database',
    tags: ['cache', 'in-memory', 'key-value'],
    thumbnail: '🔴',
    description: 'In-memory data structure store',
    geometryType: 'torus',
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 }
  },

  // DevOps
  {
    id: 'tech-docker',
    name: 'Docker',
    category: 'DevOps',
    tags: ['container', 'deployment', 'virtualization'],
    thumbnail: '🐳',
    description: 'Platform for containerized applications',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 }
  },
  {
    id: 'tech-kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    tags: ['orchestration', 'container', 'k8s'],
    thumbnail: '☸️',
    description: 'Container orchestration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 }
  },
  {
    id: 'tech-aws',
    name: 'AWS',
    category: 'DevOps',
    tags: ['cloud', 'amazon', 'infrastructure'],
    thumbnail: '☁️',
    description: 'Amazon Web Services cloud platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 }
  },
  {
    id: 'tech-github',
    name: 'GitHub',
    category: 'DevOps',
    tags: ['git', 'version-control', 'collaboration'],
    thumbnail: '🐙',
    description: 'Code hosting and collaboration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 }
  },

  // Mobile
  {
    id: 'tech-react-native',
    name: 'React Native',
    category: 'Mobile',
    tags: ['react', 'ios', 'android', 'cross-platform'],
    thumbnail: '📱',
    description: 'Build native mobile apps using React',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-flutter',
    name: 'Flutter',
    category: 'Mobile',
    tags: ['dart', 'google', 'cross-platform'],
    thumbnail: '🦋',
    description: 'UI toolkit for mobile, web, and desktop',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-swift',
    name: 'Swift',
    category: 'Mobile',
    tags: ['ios', 'apple', 'language'],
    thumbnail: '🍎',
    description: 'Powerful language for iOS development',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 }
  },
  {
    id: 'tech-kotlin',
    name: 'Kotlin',
    category: 'Mobile',
    tags: ['android', 'jvm', 'language'],
    thumbnail: '🤖',
    description: 'Modern language for Android development',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 }
  }
]

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: techStackAssets,
  filteredAssets: techStackAssets,
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
