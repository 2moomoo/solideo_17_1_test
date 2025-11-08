import { create } from 'zustand'
import { PolygonPath } from '../services/geminiAPI'

export interface IconObject {
  id: string
  name: string
  description: string
  position: { x: number; y: number }
  polygons: PolygonPath[]
  viewBox: { width: number; height: number }
}

interface IconStore {
  icons: IconObject[]
  selectedIconId: string | null
  selectedPolygonId: string | null

  // Icon management
  addIcon: (icon: Omit<IconObject, 'id'>) => void
  removeIcon: (iconId: string) => void
  updateIconPosition: (iconId: string, position: { x: number; y: number }) => void

  // Selection
  selectIcon: (iconId: string | null) => void
  selectPolygon: (polygonId: string | null) => void

  // Polygon editing
  updatePolygon: (iconId: string, polygonId: string, updates: Partial<PolygonPath>) => void

  // Get selected polygon
  getSelectedPolygon: () => PolygonPath | null
}

export const useIconStore = create<IconStore>((set, get) => ({
  icons: [],
  selectedIconId: null,
  selectedPolygonId: null,

  addIcon: (icon) => {
    const newIcon: IconObject = {
      ...icon,
      id: `icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    set((state) => ({
      icons: [...state.icons, newIcon]
    }))
  },

  removeIcon: (iconId) => {
    set((state) => ({
      icons: state.icons.filter(icon => icon.id !== iconId),
      selectedIconId: state.selectedIconId === iconId ? null : state.selectedIconId
    }))
  },

  updateIconPosition: (iconId, position) => {
    set((state) => ({
      icons: state.icons.map(icon =>
        icon.id === iconId ? { ...icon, position } : icon
      )
    }))
  },

  selectIcon: (iconId) => {
    set({ selectedIconId: iconId, selectedPolygonId: null })
  },

  selectPolygon: (polygonId) => {
    set({ selectedPolygonId: polygonId })
  },

  updatePolygon: (iconId, polygonId, updates) => {
    set((state) => ({
      icons: state.icons.map(icon => {
        if (icon.id !== iconId) return icon

        return {
          ...icon,
          polygons: icon.polygons.map(polygon =>
            polygon.id === polygonId
              ? { ...polygon, ...updates }
              : polygon
          )
        }
      })
    }))
  },

  getSelectedPolygon: () => {
    const state = get()
    if (!state.selectedIconId || !state.selectedPolygonId) return null

    const icon = state.icons.find(icon => icon.id === state.selectedIconId)
    if (!icon) return null

    return icon.polygons.find(polygon => polygon.id === state.selectedPolygonId) || null
  }
}))
