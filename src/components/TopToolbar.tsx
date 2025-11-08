import {
  Move,
  RotateCw,
  Maximize2,
  Copy,
  Trash2,
  Undo,
  Redo,
  Save,
  FolderOpen,
  LayoutGrid
} from 'lucide-react'
import { useSceneStore } from '../stores/sceneStore'

export default function TopToolbar() {
  const {
    transformMode,
    setTransformMode,
    selectedObjectIds,
    duplicateObject,
    removeObject,
    autoLayout,
    objects
  } = useSceneStore()

  const selectedId = selectedObjectIds[0]

  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      {/* Logo/Title */}
      <div className="flex items-center gap-2 mr-4">
        <div className="text-xl">🎨</div>
        <h1 className="text-white font-semibold text-sm">AI 3D Visualizer Studio</h1>
      </div>

      {/* File Operations */}
      <button className="toolbar-btn">
        <FolderOpen size={18} />
        <span>Open</span>
      </button>
      <button className="toolbar-btn">
        <Save size={18} />
        <span>Save</span>
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* History */}
      <button className="toolbar-btn" disabled>
        <Undo size={18} />
      </button>
      <button className="toolbar-btn" disabled>
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* Transform Mode */}
      <div className="flex gap-1 bg-gray-700 rounded p-1">
        <button
          className={`toolbar-icon-btn ${transformMode === 'translate' ? 'active' : ''}`}
          onClick={() => setTransformMode('translate')}
          title="Move (G)"
        >
          <Move size={18} />
        </button>
        <button
          className={`toolbar-icon-btn ${transformMode === 'rotate' ? 'active' : ''}`}
          onClick={() => setTransformMode('rotate')}
          title="Rotate (R)"
        >
          <RotateCw size={18} />
        </button>
        <button
          className={`toolbar-icon-btn ${transformMode === 'scale' ? 'active' : ''}`}
          onClick={() => setTransformMode('scale')}
          title="Scale (S)"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* Auto Layout */}
      <button
        className="toolbar-btn bg-purple-600 hover:bg-purple-700"
        disabled={objects.length === 0}
        onClick={autoLayout}
        title="Automatically arrange all objects in a grid"
      >
        <LayoutGrid size={18} />
        <span>Auto Layout</span>
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* Object Operations */}
      <button
        className="toolbar-btn"
        disabled={!selectedId}
        onClick={() => selectedId && duplicateObject(selectedId)}
      >
        <Copy size={18} />
        <span>Duplicate</span>
      </button>
      <button
        className="toolbar-btn text-red-400 hover:bg-red-900/20"
        disabled={!selectedId}
        onClick={() => selectedId && removeObject(selectedId)}
      >
        <Trash2 size={18} />
        <span>Delete</span>
      </button>
    </div>
  )
}
