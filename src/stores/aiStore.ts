import { create } from 'zustand'
import type { AIFeedback, Asset, StylePreset, GeometryType } from '../types'

interface AIState {
  feedbackHistory: AIFeedback[]
  currentFeedback: string
  isGenerating: boolean
  latestGeneration: AIFeedback | null
  latestStylePreset: StylePreset | null

  // Actions
  setCurrentFeedback: (feedback: string) => void
  submitFeedback: (feedback: string) => Promise<void>
  generateStyle: (stylePrompt: string) => Promise<StylePreset>
  setGenerating: (isGenerating: boolean) => void
  addToHistory: (feedback: AIFeedback) => void
  loadPreviousGeneration: (id: string) => void
}

// Mock AI style generation logic
function generateMockStyle(prompt: string): StylePreset {
  const lowercasePrompt = prompt.toLowerCase()

  // Simple keyword-based style generation
  let categoryMappings: StylePreset['categoryMappings']

  if (lowercasePrompt.includes('minimal') || lowercasePrompt.includes('simple')) {
    categoryMappings = {
      Language: 'box',
      Framework: 'box',
      Database: 'box',
      Tools: 'box'
    }
  } else if (lowercasePrompt.includes('futuristic') || lowercasePrompt.includes('modern')) {
    categoryMappings = {
      Language: 'cone',
      Framework: 'torus',
      Database: 'sphere',
      Tools: 'cylinder'
    }
  } else if (lowercasePrompt.includes('organic') || lowercasePrompt.includes('natural')) {
    categoryMappings = {
      Language: 'sphere',
      Framework: 'sphere',
      Database: 'torus',
      Tools: 'sphere'
    }
  } else if (lowercasePrompt.includes('angular') || lowercasePrompt.includes('sharp')) {
    categoryMappings = {
      Language: 'cone',
      Framework: 'box',
      Database: 'cone',
      Tools: 'cone'
    }
  } else {
    // Random style
    const geometries: GeometryType[] = ['box', 'sphere', 'cylinder', 'cone', 'torus']
    categoryMappings = {
      Language: geometries[Math.floor(Math.random() * geometries.length)],
      Framework: geometries[Math.floor(Math.random() * geometries.length)],
      Database: geometries[Math.floor(Math.random() * geometries.length)],
      Tools: geometries[Math.floor(Math.random() * geometries.length)]
    }
  }

  return {
    id: `ai-style-${Date.now()}`,
    name: `AI Style: ${prompt.substring(0, 30)}`,
    description: `Generated from prompt: "${prompt}"`,
    categoryMappings,
    aiGenerated: true,
    aiPrompt: prompt
  }
}

export const useAIStore = create<AIState>((set, get) => ({
  feedbackHistory: [],
  currentFeedback: '',
  isGenerating: false,
  latestGeneration: null,
  latestStylePreset: null,

  setCurrentFeedback: (feedback) => set({ currentFeedback: feedback }),

  submitFeedback: async (feedback) => {
    set({ isGenerating: true })

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate meaningful name based on prompt
    const generateAssetName = (prompt: string): string => {
      const lowercasePrompt = prompt.toLowerCase()

      // Extract key words
      if (lowercasePrompt.includes('building')) return 'AI Building'
      if (lowercasePrompt.includes('tree') || lowercasePrompt.includes('nature')) return 'AI Tree'
      if (lowercasePrompt.includes('car') || lowercasePrompt.includes('vehicle')) return 'AI Vehicle'
      if (lowercasePrompt.includes('furniture') || lowercasePrompt.includes('chair') || lowercasePrompt.includes('table')) return 'AI Furniture'
      if (lowercasePrompt.includes('abstract')) return 'AI Abstract'
      if (lowercasePrompt.includes('vintage') || lowercasePrompt.includes('retro')) return 'AI Vintage Object'
      if (lowercasePrompt.includes('futuristic') || lowercasePrompt.includes('modern')) return 'AI Modern Object'
      if (lowercasePrompt.includes('wood')) return 'AI Wooden Object'
      if (lowercasePrompt.includes('metal')) return 'AI Metal Object'

      // Default: use first meaningful word + "Object"
      const words = prompt.split(' ').filter(w => w.length > 3)
      if (words.length > 0) {
        return `AI ${words[0].charAt(0).toUpperCase() + words[0].slice(1)} Object`
      }

      return 'AI Custom Object'
    }

    // Determine geometry type based on prompt
    const geometryType = (() => {
      const lowercasePrompt = feedback.toLowerCase()
      if (lowercasePrompt.includes('round') || lowercasePrompt.includes('ball') || lowercasePrompt.includes('sphere')) return 'sphere'
      if (lowercasePrompt.includes('box') || lowercasePrompt.includes('cube')) return 'box'
      if (lowercasePrompt.includes('cylinder') || lowercasePrompt.includes('tube') || lowercasePrompt.includes('pillar')) return 'cylinder'
      if (lowercasePrompt.includes('cone') || lowercasePrompt.includes('pyramid')) return 'cone'
      if (lowercasePrompt.includes('torus') || lowercasePrompt.includes('donut') || lowercasePrompt.includes('ring')) return 'torus'
      return 'box' // default
    })()

    // Mock AI response with generated assets
    const mockGeneratedAssets: Asset[] = [
      {
        id: `ai-${Date.now()}-1`,
        name: generateAssetName(feedback),
        category: 'AI Generated',
        tags: ['ai', 'generated', feedback.toLowerCase()],
        thumbnail: '✨',
        description: `Generated based on: "${feedback}"`,
        geometryType,
        aiGenerated: true,
        aiPrompt: feedback,
        color: '#9333ea' // purple for AI generated
      }
    ]

    const newFeedback: AIFeedback = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      userInput: feedback,
      generatedAssets: mockGeneratedAssets,
      context: 'User requested new assets'
    }

    set({
      isGenerating: false,
      latestGeneration: newFeedback,
      feedbackHistory: [...get().feedbackHistory, newFeedback],
      currentFeedback: ''
    })
  },

  generateStyle: async (stylePrompt) => {
    set({ isGenerating: true })

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    const stylePreset = generateMockStyle(stylePrompt)

    set({
      isGenerating: false,
      latestStylePreset: stylePreset
    })

    return stylePreset
  },

  setGenerating: (isGenerating) => set({ isGenerating }),

  addToHistory: (feedback) => set((state) => ({
    feedbackHistory: [...state.feedbackHistory, feedback]
  })),

  loadPreviousGeneration: (id) => {
    const feedback = get().feedbackHistory.find(f => f.id === id)
    if (feedback) {
      set({ latestGeneration: feedback })
    }
  }
}))
