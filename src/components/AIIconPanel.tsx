import React, { useState } from 'react'
import { generateTechStackIcon } from '../services/geminiAPI'
import { useIconStore } from '../stores/iconStore'

export default function AIIconPanel() {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addIcon = useIconStore(state => state.addIcon)

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateTechStackIcon({
        description: description.trim(),
        width: 200,
        height: 200
      })

      console.log('Generated icon:', result)

      // Add icon to canvas at a default position
      addIcon({
        name: result.name,
        description: result.description,
        position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
        polygons: result.polygons,
        viewBox: result.viewBox
      })

      setDescription('')
      setError(null)
    } catch (err) {
      console.error('Error generating icon:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate icon')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">AI Icon Designer</h2>
      <p className="text-xs text-gray-600 mb-4">
        Describe a tech stack icon and AI will generate editable polygon shapes
      </p>

      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., React logo with atomic symbol&#10;MongoDB database leaf icon&#10;Node.js hexagon logo"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !description.trim()}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
              Generate Icon
            </>
          )}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Examples</h3>
          <div className="space-y-2">
            {[
              'React logo with atomic electrons',
              'Angular shield icon',
              'Vue.js V-shaped logo',
              'Python snake symbol',
              'Docker whale container',
              'Kubernetes helm wheel'
            ].map((example) => (
              <button
                key={example}
                onClick={() => setDescription(example)}
                disabled={isGenerating}
                className="w-full text-left px-3 py-2 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">How it works</h3>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li>• AI generates individual polygon shapes</li>
            <li>• Each polygon can be edited separately</li>
            <li>• Adjust colors, stroke, opacity</li>
            <li>• Edit SVG path data directly</li>
            <li>• Move and resize polygons</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
