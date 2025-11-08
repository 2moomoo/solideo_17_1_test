import { useState } from 'react'
import { generateStyledLayout } from '../services/geminiAPI'
import { useLayoutStore } from '../stores/layoutStore'

interface AIStylePanelProps {
  selectedStacks: string[]
}

export default function AIStylePanel({ selectedStacks }: AIStylePanelProps) {
  const [styleDescription, setStyleDescription] = useState('Train station platform with each tech as a train car')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useDefaultStyle, setUseDefaultStyle] = useState(false)
  const hasApiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY)

  const setLayout = useLayoutStore(state => state.setLayout)

  const handleGenerate = async () => {
    if (selectedStacks.length === 0) {
      setError('Please select at least one tech stack')
      return
    }

    if (!useDefaultStyle && !styleDescription.trim()) {
      setError('Please enter a style description')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const finalDescription = useDefaultStyle
        ? 'Simple horizontal layout with colored boxes'
        : styleDescription.trim()

      const result = await generateStyledLayout({
        selectedStacks,
        styleDescription: finalDescription,
        canvasWidth: window.innerWidth - 640,
        canvasHeight: window.innerHeight - 56
      })

      console.log('Generated layout:', result)

      setLayout(result.elements, result.backgroundPolygons || [])
      setError(null)
    } catch (err) {
      console.error('Error generating layout:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate layout')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <h3 className="text-sm font-bold text-gray-800 mb-3">AI Design Style</h3>

      {!hasApiKey && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ℹ️ No API key - using mock design mode
        </div>
      )}

      <div className="mb-3">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={useDefaultStyle}
            onChange={(e) => setUseDefaultStyle(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-xs text-gray-600">Use default style (simple boxes)</span>
        </label>
      </div>

      {!useDefaultStyle && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Style Description
          </label>
          <textarea
            value={styleDescription}
            onChange={(e) => setStyleDescription(e.target.value)}
            placeholder="Describe how to visualize the tech stack..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={isGenerating}
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || selectedStacks.length === 0}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Design
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}

      {!useDefaultStyle && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Example Styles</h4>
          <div className="space-y-1">
            {[
              'Train station platform with each tech as a train car',
              'Solar system with each tech as a planet',
              'City skyline with each tech as a building',
              'Race track with each tech as a race car',
              'Garden with each tech as a flower'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setStyleDescription(example)}
                disabled={isGenerating}
                className="w-full text-left px-2 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
