import { useSceneStore } from '../stores/sceneStore'
import { Eye, EyeOff } from 'lucide-react'

export default function PropertiesPanel() {
  const { objects, selectedObjectIds, updateObject } = useSceneStore()

  const selectedObject = selectedObjectIds.length === 1
    ? objects.find(obj => obj.id === selectedObjectIds[0])
    : null

  if (!selectedObject) {
    return (
      <div className="p-4">
        <p className="text-gray-400 text-center py-8">
          Select an object to view its properties
        </p>
      </div>
    )
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    updateObject(selectedObject.id, {
      position: { ...selectedObject.position, [axis]: numValue }
    })
  }

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    updateObject(selectedObject.id, {
      rotation: { ...selectedObject.rotation, [axis]: numValue }
    })
  }

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 1
    updateObject(selectedObject.id, {
      scale: { ...selectedObject.scale, [axis]: numValue }
    })
  }

  const handleMaterialChange = (property: string, value: any) => {
    updateObject(selectedObject.id, {
      materialProps: {
        ...selectedObject.materialProps!,
        [property]: value
      }
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Object Info */}
      <div>
        <h3 className="text-white font-medium mb-3 flex items-center justify-between">
          <span>{selectedObject.name}</span>
          <button
            onClick={() => updateObject(selectedObject.id, { visible: !selectedObject.visible })}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {selectedObject.visible ? (
              <Eye size={16} className="text-gray-400" />
            ) : (
              <EyeOff size={16} className="text-gray-400" />
            )}
          </button>
        </h3>
      </div>

      {/* Transform */}
      <div>
        <h4 className="text-gray-300 font-medium mb-2 text-sm">Position</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.position.x.toFixed(2)}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.position.y.toFixed(2)}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Z</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.position.z.toFixed(2)}
              onChange={(e) => handlePositionChange('z', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-gray-300 font-medium mb-2 text-sm">Rotation (rad)</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.rotation.x.toFixed(2)}
              onChange={(e) => handleRotationChange('x', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.rotation.y.toFixed(2)}
              onChange={(e) => handleRotationChange('y', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Z</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.rotation.z.toFixed(2)}
              onChange={(e) => handleRotationChange('z', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-gray-300 font-medium mb-2 text-sm">Scale</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.scale.x.toFixed(2)}
              onChange={(e) => handleScaleChange('x', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.scale.y.toFixed(2)}
              onChange={(e) => handleScaleChange('y', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Z</label>
            <input
              type="number"
              step="0.1"
              value={selectedObject.scale.z.toFixed(2)}
              onChange={(e) => handleScaleChange('z', e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Material */}
      {selectedObject.materialProps && (
        <>
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-gray-300 font-medium mb-3 text-sm">Material</h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Color</label>
                <input
                  type="color"
                  value={selectedObject.materialProps.color}
                  onChange={(e) => handleMaterialChange('color', e.target.value)}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Metalness: {selectedObject.materialProps.metalness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.materialProps.metalness}
                  onChange={(e) => handleMaterialChange('metalness', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Roughness: {selectedObject.materialProps.roughness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.materialProps.roughness}
                  onChange={(e) => handleMaterialChange('roughness', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
