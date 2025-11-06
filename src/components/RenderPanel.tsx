import { Download, Loader2, Camera } from 'lucide-react'
import { useRenderStore } from '../stores/renderStore'

export default function RenderPanel() {
  const {
    renderSettings,
    updateRenderSettings,
    isRendering,
    setRendering,
    setRenderProgress,
    lastRenderedImage,
    setLastRenderedImage
  } = useRenderStore()

  const handleRender = async () => {
    setRendering(true)
    setRenderProgress(0)

    // Simulate rendering progress
    const interval = setInterval(() => {
      const currentProgress = useRenderStore.getState().renderProgress
      if (currentProgress >= 90) {
        clearInterval(interval)
      } else {
        setRenderProgress(currentProgress + 10)
      }
    }, 200)

    // Simulate actual rendering (in reality, this would capture the canvas)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get canvas and convert to image
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL(`image/${renderSettings.format}`, renderSettings.quality / 100)
      setLastRenderedImage(dataUrl)
    }

    clearInterval(interval)
    setRenderProgress(100)
    setRendering(false)
  }

  const handleDownload = () => {
    if (lastRenderedImage) {
      const link = document.createElement('a')
      link.download = `render-${Date.now()}.${renderSettings.format}`
      link.href = lastRenderedImage
      link.click()
    }
  }

  const resolutionPresets = [
    { name: 'HD', width: 1280, height: 720 },
    { name: 'FHD', width: 1920, height: 1080 },
    { name: '2K', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 }
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-white font-medium mb-4">Render Settings</h3>

        {/* Resolution Presets */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Resolution Preset</label>
          <div className="grid grid-cols-4 gap-2">
            {resolutionPresets.map((preset) => (
              <button
                key={preset.name}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  renderSettings.resolution.width === preset.width &&
                  renderSettings.resolution.height === preset.height
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() =>
                  updateRenderSettings({
                    resolution: { width: preset.width, height: preset.height }
                  })
                }
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Resolution */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Width</label>
            <input
              type="number"
              value={renderSettings.resolution.width}
              onChange={(e) =>
                updateRenderSettings({
                  resolution: {
                    ...renderSettings.resolution,
                    width: parseInt(e.target.value) || 1920
                  }
                })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Height</label>
            <input
              type="number"
              value={renderSettings.resolution.height}
              onChange={(e) =>
                updateRenderSettings({
                  resolution: {
                    ...renderSettings.resolution,
                    height: parseInt(e.target.value) || 1080
                  }
                })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>

        {/* Format */}
        <div className="mt-4">
          <label className="text-sm text-gray-300 mb-2 block">Format</label>
          <select
            value={renderSettings.format}
            onChange={(e) =>
              updateRenderSettings({ format: e.target.value as 'png' | 'jpg' | 'webp' })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        {/* Quality */}
        <div className="mt-4">
          <label className="text-xs text-gray-400 mb-1 block">
            Quality: {renderSettings.quality}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={renderSettings.quality}
            onChange={(e) => updateRenderSettings({ quality: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={renderSettings.transparentBackground}
              onChange={(e) =>
                updateRenderSettings({ transparentBackground: e.target.checked })
              }
              className="w-4 h-4"
            />
            Transparent Background
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={renderSettings.antialiasing}
              onChange={(e) => updateRenderSettings({ antialiasing: e.target.checked })}
              className="w-4 h-4"
            />
            Anti-aliasing
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={renderSettings.addWatermark}
              onChange={(e) => updateRenderSettings({ addWatermark: e.target.checked })}
              className="w-4 h-4"
            />
            Add Watermark
          </label>
        </div>

        {/* Shadow Quality */}
        <div className="mt-4">
          <label className="text-sm text-gray-300 mb-2 block">Shadow Quality</label>
          <select
            value={renderSettings.shadowQuality}
            onChange={(e) =>
              updateRenderSettings({
                shadowQuality: e.target.value as 'low' | 'medium' | 'high'
              })
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Render Button */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={handleRender}
          disabled={isRendering}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          {isRendering ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <Camera size={20} />
              Render Scene
            </>
          )}
        </button>

        {isRendering && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${useRenderStore.getState().renderProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {lastRenderedImage && (
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-300 font-medium text-sm">Last Render</h4>
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Download size={14} />
              Download
            </button>
          </div>
          <div className="bg-gray-700 rounded-lg p-2">
            <img
              src={lastRenderedImage}
              alt="Last render"
              className="w-full rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
