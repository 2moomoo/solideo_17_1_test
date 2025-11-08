import { X } from 'lucide-react'
import Viewport3D from './Viewport3D'

interface Viewer3DModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function Viewer3DModal({ isOpen, onClose }: Viewer3DModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-7xl max-h-screen m-4 bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 bg-opacity-90">
          <h2 className="text-xl font-semibold text-white">3D Viewer</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 3D Viewport */}
        <div className="w-full h-full pt-16">
          <Viewport3D />
        </div>

        {/* Info */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-800 bg-opacity-90 rounded-lg text-sm text-gray-300">
          <p className="flex items-center gap-2">
            <span className="font-semibold">Controls:</span>
            <span>Left Click + Drag: Rotate</span>
            <span className="mx-2">|</span>
            <span>Right Click + Drag: Pan</span>
            <span className="mx-2">|</span>
            <span>Scroll: Zoom</span>
          </p>
        </div>
      </div>
    </div>
  )
}
