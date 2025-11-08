import { create } from 'zustand'
import { PolygonPath, TechStackElement } from '../services/geminiAPI'

interface LayoutStore {
  elements: TechStackElement[]
  backgroundPolygons: PolygonPath[]
  selectedElementId: string | null
  selectedPolygonId: string | null

  // Layout management
  setLayout: (elements: TechStackElement[], backgroundPolygons: PolygonPath[]) => void
  clearLayout: () => void

  // Element management
  updateElementPosition: (elementId: string, position: { x: number; y: number }) => void

  // Selection
  selectElement: (elementId: string | null) => void
  selectPolygon: (polygonId: string | null) => void

  // Polygon editing
  updatePolygon: (polygonId: string, updates: Partial<PolygonPath>) => void

  // Get selected polygon
  getSelectedPolygon: () => PolygonPath | null

  // Get all polygons (for rendering)
  getAllPolygons: () => Array<PolygonPath & { parentId?: string; position?: { x: number; y: number } }>
}

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  elements: [],
  backgroundPolygons: [],
  selectedElementId: null,
  selectedPolygonId: null,

  setLayout: (elements, backgroundPolygons) => {
    set({ elements, backgroundPolygons, selectedElementId: null, selectedPolygonId: null })
  },

  clearLayout: () => {
    set({ elements: [], backgroundPolygons: [], selectedElementId: null, selectedPolygonId: null })
  },

  updateElementPosition: (elementId, position) => {
    set((state) => ({
      elements: state.elements.map(element =>
        element.id === elementId ? { ...element, position } : element
      )
    }))
  },

  selectElement: (elementId) => {
    set({ selectedElementId: elementId, selectedPolygonId: null })
  },

  selectPolygon: (polygonId) => {
    set({ selectedPolygonId: polygonId })
  },

  updatePolygon: (polygonId, updates) => {
    set((state) => {
      // Update in background polygons
      const updatedBackgroundPolygons = state.backgroundPolygons.map(polygon =>
        polygon.id === polygonId ? { ...polygon, ...updates } : polygon
      )

      // Update in elements
      const updatedElements = state.elements.map(element => ({
        ...element,
        polygons: element.polygons.map(polygon =>
          polygon.id === polygonId ? { ...polygon, ...updates } : polygon
        )
      }))

      return {
        backgroundPolygons: updatedBackgroundPolygons,
        elements: updatedElements
      }
    })
  },

  getSelectedPolygon: () => {
    const state = get()
    if (!state.selectedPolygonId) return null

    // Search in background polygons
    const bgPolygon = state.backgroundPolygons.find(p => p.id === state.selectedPolygonId)
    if (bgPolygon) return bgPolygon

    // Search in elements
    for (const element of state.elements) {
      const polygon = element.polygons.find(p => p.id === state.selectedPolygonId)
      if (polygon) return polygon
    }

    return null
  },

  getAllPolygons: () => {
    const state = get()
    const allPolygons: Array<PolygonPath & { parentId?: string; position?: { x: number; y: number } }> = []

    // Add background polygons
    state.backgroundPolygons.forEach(polygon => {
      allPolygons.push({ ...polygon, position: { x: 0, y: 0 } })
    })

    // Add element polygons
    state.elements.forEach(element => {
      element.polygons.forEach(polygon => {
        allPolygons.push({
          ...polygon,
          parentId: element.id,
          position: element.position
        })
      })
    })

    return allPolygons
  }
}))
