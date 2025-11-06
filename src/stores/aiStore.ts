import { create } from 'zustand'
import type { AIFeedback, Asset } from '../types'

interface AIState {
  feedbackHistory: AIFeedback[]
  currentFeedback: string
  isGenerating: boolean
  latestGeneration: AIFeedback | null

  // Actions
  setCurrentFeedback: (feedback: string) => void
  submitFeedback: (feedback: string) => Promise<void>
  setGenerating: (isGenerating: boolean) => void
  addToHistory: (feedback: AIFeedback) => void
  loadPreviousGeneration: (id: string) => void
}

export const useAIStore = create<AIState>((set, get) => ({
  feedbackHistory: [],
  currentFeedback: '',
  isGenerating: false,
  latestGeneration: null,

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
