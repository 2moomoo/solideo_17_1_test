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
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#61DAFB',
    displayText: 'React'
  },
  {
    id: 'tech-vue',
    name: 'Vue.js',
    category: 'Frontend',
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
    category: 'Frontend',
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
    category: 'Frontend',
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
    category: 'Frontend',
    tags: ['react', 'ssr', 'framework', 'vercel'],
    thumbnail: '▲',
    description: 'React framework for production',
    geometryType: 'box',
    geometryParams: { width: 1, height: 1, depth: 1 },
    color: '#000000',
    displayText: 'Next.js'
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
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 },
    color: '#339933',
    displayText: 'Node.js'
  },
  {
    id: 'tech-python',
    name: 'Python',
    category: 'Backend',
    tags: ['language', 'ai', 'data'],
    thumbnail: '🐍',
    description: 'High-level programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 },
    color: '#3776AB',
    displayText: 'Python'
  },
  {
    id: 'tech-java',
    name: 'Java',
    category: 'Backend',
    tags: ['language', 'enterprise', 'jvm'],
    thumbnail: '☕',
    description: 'Object-oriented programming language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 },
    color: '#007396',
    displayText: 'Java'
  },
  {
    id: 'tech-golang',
    name: 'Go',
    category: 'Backend',
    tags: ['language', 'google', 'concurrent'],
    thumbnail: '🔷',
    description: 'Statically typed compiled language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 },
    color: '#00ADD8',
    displayText: 'Go'
  },
  {
    id: 'tech-rust',
    name: 'Rust',
    category: 'Backend',
    tags: ['language', 'performance', 'memory-safe'],
    thumbnail: '🦀',
    description: 'Fast and memory-efficient language',
    geometryType: 'cylinder',
    geometryParams: { radiusTop: 1, radiusBottom: 1, height: 1.5, radialSegments: 32 },
    color: '#CE422B',
    displayText: 'Rust'
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
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 },
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
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 },
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
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 },
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
    geometryParams: { radius: 0.8, tube: 0.3, radialSegments: 16, tubularSegments: 100 },
    color: '#DC382D',
    displayText: 'Redis'
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
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 },
    color: '#2496ED',
    displayText: 'Docker'
  },
  {
    id: 'tech-kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    tags: ['orchestration', 'container', 'k8s'],
    thumbnail: '☸️',
    description: 'Container orchestration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 },
    color: '#326CE5',
    displayText: 'K8s'
  },
  {
    id: 'tech-aws',
    name: 'AWS',
    category: 'DevOps',
    tags: ['cloud', 'amazon', 'infrastructure'],
    thumbnail: '☁️',
    description: 'Amazon Web Services cloud platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 },
    color: '#FF9900',
    displayText: 'AWS'
  },
  {
    id: 'tech-github',
    name: 'GitHub',
    category: 'DevOps',
    tags: ['git', 'version-control', 'collaboration'],
    thumbnail: '🐙',
    description: 'Code hosting and collaboration platform',
    geometryType: 'sphere',
    geometryParams: { radius: 1, widthSegments: 32, heightSegments: 32 },
    color: '#181717',
    displayText: 'GitHub'
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
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 },
    color: '#61DAFB',
    displayText: 'RN'
  },
  {
    id: 'tech-flutter',
    name: 'Flutter',
    category: 'Mobile',
    tags: ['dart', 'google', 'cross-platform'],
    thumbnail: '🦋',
    description: 'UI toolkit for mobile, web, and desktop',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 },
    color: '#02569B',
    displayText: 'Flutter'
  },
  {
    id: 'tech-swift',
    name: 'Swift',
    category: 'Mobile',
    tags: ['ios', 'apple', 'language'],
    thumbnail: '🍎',
    description: 'Powerful language for iOS development',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 },
    color: '#FA7343',
    displayText: 'Swift'
  },
  {
    id: 'tech-kotlin',
    name: 'Kotlin',
    category: 'Mobile',
    tags: ['android', 'jvm', 'language'],
    thumbnail: '🤖',
    description: 'Modern language for Android development',
    geometryType: 'cone',
    geometryParams: { radius: 1, height: 1.5, radialSegments: 32 },
    color: '#7F52FF',
    displayText: 'Kotlin'
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
