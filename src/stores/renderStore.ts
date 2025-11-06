import { create } from 'zustand'
import type { RenderSettings, CameraView } from '../types'

interface RenderState {
  renderSettings: RenderSettings
  isRendering: boolean
  renderProgress: number
  lastRenderedImage: string | null
  cameraView: CameraView

  // Actions
  updateRenderSettings: (settings: Partial<RenderSettings>) => void
  setRendering: (isRendering: boolean) => void
  setRenderProgress: (progress: number) => void
  setLastRenderedImage: (imageUrl: string) => void
  setCameraView: (view: CameraView) => void
}

export const useRenderStore = create<RenderState>((set) => ({
  renderSettings: {
    resolution: { width: 1920, height: 1080 },
    format: 'png',
    quality: 95,
    transparentBackground: false,
    antialiasing: true,
    shadowQuality: 'high',
    addWatermark: false
  },
  isRendering: false,
  renderProgress: 0,
  lastRenderedImage: null,
  cameraView: 'perspective',

  updateRenderSettings: (settings) => set((state) => ({
    renderSettings: { ...state.renderSettings, ...settings }
  })),

  setRendering: (isRendering) => set({ isRendering }),

  setRenderProgress: (progress) => set({ renderProgress: progress }),

  setLastRenderedImage: (imageUrl) => set({ lastRenderedImage: imageUrl }),

  setCameraView: (view) => set({ cameraView: view })
}))
