import { create } from 'zustand'
import { generateDiagram, generateSVGShape } from '../services/geminiAPI'
import type { DiagramNode, DiagramEdge } from '../types'

interface AIState {
  isGenerating: boolean
  lastPrompt: string
  error: string | null

  // Actions
  generateDiagramFromPrompt: (prompt: string) => Promise<{ nodes: DiagramNode[]; edges: DiagramEdge[] }>
  generateCustomShape: (description: string, label: string) => Promise<DiagramNode>
  setGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
}

export const useAIStore2D = create<AIState>((set) => ({
  isGenerating: false,
  lastPrompt: '',
  error: null,

  generateDiagramFromPrompt: async (prompt: string) => {
    set({ isGenerating: true, lastPrompt: prompt, error: null })

    try {
      console.log('Generating diagram with Gemini AI:', prompt)
      const result = await generateDiagram(prompt)

      // Convert to React Flow format
      const nodes: DiagramNode[] = result.nodes.map((node, index) => ({
        id: node.id || `node-${index}`,
        type: 'custom',
        position: node.position || { x: index * 200 + 100, y: 200 },
        data: {
          label: node.label,
          category: node.category,
          description: node.description,
          icon: getIconForCategory(node.category),
          color: getColorForCategory(node.category),
          customShape: node.customShape
        }
      }))

      const edges: DiagramEdge[] = result.edges.map((edge, index) => ({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: true
      }))

      console.log('Generated nodes:', nodes)
      console.log('Generated edges:', edges)

      set({ isGenerating: false })
      return { nodes, edges }
    } catch (error) {
      console.error('Failed to generate diagram:', error)
      set({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate diagram'
      })
      throw error
    }
  },

  generateCustomShape: async (description: string, label: string) => {
    set({ isGenerating: true, error: null })

    try {
      console.log('Generating custom shape:', description)
      const shapeData = await generateSVGShape({ description, width: 100, height: 100 })

      const node: DiagramNode = {
        id: `custom-${Date.now()}`,
        type: 'custom',
        position: { x: 400, y: 200 },
        data: {
          label,
          customShape: shapeData,
          category: 'Custom'
        }
      }

      set({ isGenerating: false })
      return node
    } catch (error) {
      console.error('Failed to generate custom shape:', error)
      set({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate shape'
      })
      throw error
    }
  },

  setGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error })
}))

// Helper functions
function getIconForCategory(category?: string): string {
  const icons: Record<string, string> = {
    'Language': '💻',
    'Framework': '⚛️',
    'Database': '🗄️',
    'Tools': '🔧',
    'Custom': '✨'
  }
  return icons[category || 'Custom'] || '📦'
}

function getColorForCategory(category?: string): string {
  const colors: Record<string, string> = {
    'Language': '#61DAFB',
    'Framework': '#42B883',
    'Database': '#47A248',
    'Tools': '#2496ED',
    'Custom': '#9333EA'
  }
  return colors[category || 'Custom'] || '#4A90E2'
}
