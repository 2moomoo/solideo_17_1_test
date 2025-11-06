import { useSceneStore } from '../stores/sceneStore'

export default function SceneSettingsPanel() {
  const { sceneSettings, updateSceneSettings } = useSceneStore()

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-white font-medium mb-4">Scene Settings</h3>

        {/* Background */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Background Color</label>
            <input
              type="color"
              value={sceneSettings.backgroundColor}
              onChange={(e) => updateSceneSettings({ backgroundColor: e.target.value })}
              className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sceneSettings.showGrid}
                onChange={(e) => updateSceneSettings({ showGrid: e.target.checked })}
                className="w-4 h-4"
              />
              Show Grid
            </label>
          </div>
        </div>
      </div>

      {/* Lighting */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-gray-300 font-medium mb-3 text-sm">Lighting</h4>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Ambient Light: {sceneSettings.ambientLightIntensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={sceneSettings.ambientLightIntensity}
              onChange={(e) =>
                updateSceneSettings({ ambientLightIntensity: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Directional Light: {sceneSettings.directionalLightIntensity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={sceneSettings.directionalLightIntensity}
              onChange={(e) =>
                updateSceneSettings({ directionalLightIntensity: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Light Position</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">X</label>
                <input
                  type="number"
                  step="0.5"
                  value={sceneSettings.directionalLightPosition.x}
                  onChange={(e) =>
                    updateSceneSettings({
                      directionalLightPosition: {
                        ...sceneSettings.directionalLightPosition,
                        x: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Y</label>
                <input
                  type="number"
                  step="0.5"
                  value={sceneSettings.directionalLightPosition.y}
                  onChange={(e) =>
                    updateSceneSettings({
                      directionalLightPosition: {
                        ...sceneSettings.directionalLightPosition,
                        y: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Z</label>
                <input
                  type="number"
                  step="0.5"
                  value={sceneSettings.directionalLightPosition.z}
                  onChange={(e) =>
                    updateSceneSettings({
                      directionalLightPosition: {
                        ...sceneSettings.directionalLightPosition,
                        z: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
