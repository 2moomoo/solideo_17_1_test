import { useState } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { useAIStore } from '../stores/aiStore'
import { useAssetStore } from '../stores/assetStore'

export default function AIPanel() {
  const {
    submitFeedback,
    isGenerating,
    latestGeneration,
    feedbackHistory
  } = useAIStore()

  const { addAsset } = useAssetStore()

  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating) {
      await submitFeedback(input)
      setInput('')
    }
  }

  const handleAddToLibrary = () => {
    if (latestGeneration) {
      latestGeneration.generatedAssets.forEach(asset => addAsset(asset))
    }
  }

  const suggestions = [
    "Create a futuristic building",
    "Make it more vintage",
    "Change material to wood",
    "Generate abstract shapes",
    "Create nature elements"
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Latest Generation Display */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          Latest AI Generation
        </h3>

        {latestGeneration ? (
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-300 mb-2">
              "{latestGeneration.userInput}"
            </p>
            <div className="flex gap-2 mb-3">
              {latestGeneration.generatedAssets.map(asset => (
                <div
                  key={asset.id}
                  className="flex-1 bg-gray-600 rounded p-2 text-center"
                >
                  <div className="text-2xl mb-1">{asset.thumbnail}</div>
                  <div className="text-xs text-white">{asset.name}</div>
                </div>
              ))}
            </div>
            <button
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              onClick={handleAddToLibrary}
            >
              Add to Library
            </button>
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400 text-sm">
            No AI generations yet. Submit your first request below!
          </div>
        )}
      </div>

      {/* Feedback Input */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium mb-3">AI Feedback</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
            placeholder="Describe what you want to create or modify..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
          />
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
                Generate
              </>
            )}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                onClick={() => setInput(suggestion)}
                disabled={isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-white font-medium mb-3">History</h3>
        <div className="space-y-3">
          {feedbackHistory.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No history yet
            </p>
          ) : (
            feedbackHistory.slice().reverse().map((item) => (
              <div
                key={item.id}
                className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <p className="text-sm text-gray-300 mb-1">"{item.userInput}"</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
                <div className="mt-2 flex gap-1">
                  {item.generatedAssets.map(asset => (
                    <span key={asset.id} className="text-lg">
                      {asset.thumbnail}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
