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

    // Mock AI response with generated assets
    const mockGeneratedAssets: Asset[] = [
      {
        id: `ai-${Date.now()}-1`,
        name: 'AI Generated Object 1',
        category: 'AI Generated',
        tags: ['ai', 'generated', feedback.toLowerCase()],
        thumbnail: '✨',
        description: `Generated based on: "${feedback}"`,
        geometryType: 'box',
        aiGenerated: true,
        aiPrompt: feedback
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
