import { create } from 'zustand'
import type { SceneObject, SceneSettings, TransformMode } from '../types'

interface SceneState {
  objects: SceneObject[]
  selectedObjectIds: string[]
  sceneSettings: SceneSettings
  transformMode: TransformMode

  // Actions
  addObject: (object: SceneObject) => void
  removeObject: (id: string) => void
  updateObject: (id: string, updates: Partial<SceneObject>) => void
  selectObject: (id: string, multiSelect?: boolean) => void
  clearSelection: () => void
  setTransformMode: (mode: TransformMode) => void
  updateSceneSettings: (settings: Partial<SceneSettings>) => void
  duplicateObject: (id: string) => void
  autoLayout: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  objects: [],
  selectedObjectIds: [],
  sceneSettings: {
    backgroundColor: '#1a1a1a',
    showGrid: true,
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 1.0,
    directionalLightPosition: { x: 5, y: 10, z: 5 },
    layoutSpacing: 1.8
  },
  transformMode: 'translate',

  addObject: (object) => set((state) => ({
    objects: [...state.objects, object]
  })),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(obj => obj.id !== id),
    selectedObjectIds: state.selectedObjectIds.filter(objId => objId !== id)
  })),

  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    )
  })),

  selectObject: (id, multiSelect = false) => set((state) => {
    if (multiSelect) {
      const isSelected = state.selectedObjectIds.includes(id)
      return {
        selectedObjectIds: isSelected
          ? state.selectedObjectIds.filter(objId => objId !== id)
          : [...state.selectedObjectIds, id]
      }
    }
    return { selectedObjectIds: [id] }
  }),

  clearSelection: () => set({ selectedObjectIds: [] }),

  setTransformMode: (mode) => set({ transformMode: mode }),

  updateSceneSettings: (settings) => set((state) => ({
    sceneSettings: { ...state.sceneSettings, ...settings }
  })),

  duplicateObject: (id) => set((state) => {
    const original = state.objects.find(obj => obj.id === id)
    if (!original) return state

    const duplicate: SceneObject = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} Copy`,
      position: {
        x: original.position.x + 1,
        y: original.position.y,
        z: original.position.z + 1
      }
    }

    return {
      objects: [...state.objects, duplicate],
      selectedObjectIds: [duplicate.id]
    }
  }),

  autoLayout: () => set((state) => {
    if (state.objects.length === 0) return state

    // Calculate grid dimensions for compact layout
    const objectCount = state.objects.length
    const cols = Math.ceil(Math.sqrt(objectCount))
    const rows = Math.ceil(objectCount / cols)

    // Use spacing from settings
    const spacing = state.sceneSettings.layoutSpacing

    // Center the grid
    const offsetX = -(cols - 1) * spacing / 2
    const offsetZ = -(rows - 1) * spacing / 2

    // Layout objects in a grid
    const layoutedObjects = state.objects.map((obj, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      return {
        ...obj,
        position: {
          x: offsetX + col * spacing,
          y: 0.5,
          z: offsetZ + row * spacing
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    })

    return {
      objects: layoutedObjects
    }
  })
}))
