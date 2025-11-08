import { useState } from 'react'
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { useAIStore2D } from '../stores/aiStore2D'
import { useDiagramStore } from '../stores/diagramStore'

export default function AIPanel2D() {
  const { generateDiagramFromPrompt, generateCustomShape, isGenerating, error } = useAIStore2D()
  const { setNodes, setEdges, addNode } = useDiagramStore()

  const [input, setInput] = useState('')
  const [shapeDescription, setShapeDescription] = useState('')
  const [shapeLabel, setShapeLabel] = useState('')
  const [activeTab, setActiveTab] = useState<'diagram' | 'shape'>('diagram')

  const handleDiagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      try {
        const { nodes, edges } = await generateDiagramFromPrompt(input)
        setNodes(nodes)
        setEdges(edges)
        setInput('')
      } catch (err) {
        console.error('Failed to generate diagram:', err)
      }
    }
  }

  const handleShapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (shapeDescription.trim() && shapeLabel.trim() && !isGenerating) {
      try {
        const node = await generateCustomShape(shapeDescription, shapeLabel)
        addNode(node)
        setShapeDescription('')
        setShapeLabel('')
      } catch (err) {
        console.error('Failed to generate shape:', err)
      }
    }
  }

  const suggestions = [
    'Create a web application architecture with React, Node.js, and MongoDB',
    'Design a microservices system with API gateway',
    'Build a data pipeline with Kafka and Spark',
    'Show me a CI/CD workflow'
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Sparkles size={20} className="text-purple-400" />
          AI Assistant
        </h2>
        <p className="text-xs text-gray-400 mt-1">Powered by Gemini AI</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'diagram'
              ? 'bg-gray-700 text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => setActiveTab('diagram')}
        >
          Generate Diagram
        </button>
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'shape'
              ? 'bg-gray-700 text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          onClick={() => setActiveTab('shape')}
        >
          Custom Shape
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="m-4 p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-start gap-2">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">Error</p>
            <p className="text-xs text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'diagram' ? (
          <div className="space-y-4">
            <form onSubmit={handleDiagramSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Describe your system architecture
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="e.g., Create a web application with React frontend, Node.js backend, and PostgreSQL database"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={!input.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Generate Diagram
                  </>
                )}
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-left rounded text-sm transition-colors"
                    onClick={() => setInput(suggestion)}
                    disabled={isGenerating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleShapeSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Node Label
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Custom Server"
                  value={shapeLabel}
                  onChange={(e) => setShapeLabel(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Shape Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="e.g., hexagonal shape, or server icon, or cloud shape"
                  value={shapeDescription}
                  onChange={(e) => setShapeDescription(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={!shapeDescription.trim() || !shapeLabel.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Custom Shape
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-400">
                <strong className="text-white">Note:</strong> AI will generate a custom SVG shape based on your description.
                Without a Gemini API key, random shapes will be used.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Key Notice */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="p-4 border-t border-gray-700">
          <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
            <p className="text-xs text-yellow-400">
              <strong>No API Key:</strong> Add your Gemini API key to <code className="bg-gray-800 px-1 rounded">.env</code> file.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
