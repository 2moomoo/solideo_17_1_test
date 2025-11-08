import { create } from 'zustand'
import type { SceneObject, SceneSettings, TransformMode, StylePreset, GeometryType } from '../types'

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
  applyStyleToObjects: (style: StylePreset) => void
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
    layoutSpacing: 1.2,
    showText: true,
    showEmoji: true
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
  }),

  applyStyleToObjects: (style) => set((state) => {
    console.log('Applying style to objects:', style)
    console.log('Current objects:', state.objects)

    // Update objects with new geometry based on style
    const updatedObjects = state.objects.map(obj => {
      console.log(`Processing object: ${obj.name}, category: ${obj.category}`)

      // Don't apply style to AI Generated objects
      if (obj.category === 'AI Generated') {
        console.log('  -> Skipping AI Generated object')
        return obj
      }

      // Check if the object's category exists in the style mappings
      if (obj.category && obj.category in style.categoryMappings) {
        const category = obj.category as keyof typeof style.categoryMappings
        const newGeometryType = style.categoryMappings[category]
        console.log(`  -> Applying style: ${obj.geometryType} -> ${newGeometryType}`)
        return {
          ...obj,
          geometryType: newGeometryType,
          geometryParams: getGeometryParams(newGeometryType)
        }
      }

      console.log('  -> No style mapping found')
      return obj
    })

    console.log('Updated objects:', updatedObjects)
    return { objects: updatedObjects }
  })
}))
