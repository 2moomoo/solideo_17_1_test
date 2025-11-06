import * as THREE from 'three'

export interface SceneObject {
  id: string
  name: string
  type: 'mesh' | 'light' | 'camera'
  mesh?: THREE.Mesh
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  materialProps?: MaterialProperties
  visible: boolean
  geometryType?: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'custom'
  geometryParams?: Record<string, any>
}

export interface MaterialProperties {
  color: string
  metalness: number
  roughness: number
  emissive: string
  emissiveIntensity: number
}

export interface Asset {
  id: string
  name: string
  category: string
  tags: string[]
  thumbnail: string
  description: string
  geometryType: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'custom'
  geometryParams?: Record<string, any>
  aiGenerated?: boolean
  aiPrompt?: string
}

export interface SceneSettings {
  backgroundColor: string
  showGrid: boolean
  ambientLightIntensity: number
  directionalLightIntensity: number
  directionalLightPosition: { x: number; y: number; z: number }
}

export interface RenderSettings {
  resolution: { width: number; height: number }
  format: 'png' | 'jpg' | 'webp'
  quality: number
  transparentBackground: boolean
  antialiasing: boolean
  shadowQuality: 'low' | 'medium' | 'high'
  addWatermark: boolean
}

export interface AIFeedback {
  id: string
  timestamp: number
  userInput: string
  generatedAssets: Asset[]
  context?: string
}

export type TransformMode = 'translate' | 'rotate' | 'scale'

export type CameraView = 'perspective' | 'top' | 'front' | 'side'

export interface CameraPreset {
  position: [number, number, number]
  lookAt: [number, number, number]
  fov?: number
}
