import { useState } from 'react'

export interface TechStack {
  id: string
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools'
  icon: string
}

const TECH_STACKS: TechStack[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', icon: '⚛️' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend', icon: '💚' },
  { id: 'angular', name: 'Angular', category: 'Frontend', icon: '🅰️' },
  { id: 'svelte', name: 'Svelte', category: 'Frontend', icon: '🧡' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: '💚' },
  { id: 'python', name: 'Python', category: 'Backend', icon: '🐍' },
  { id: 'java', name: 'Java', category: 'Backend', icon: '☕' },
  { id: 'go', name: 'Go', category: 'Backend', icon: '🐹' },

  // Database
  { id: 'mongodb', name: 'MongoDB', category: 'Database', icon: '🍃' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', icon: '🐘' },
  { id: 'mysql', name: 'MySQL', category: 'Database', icon: '🐬' },
  { id: 'redis', name: 'Redis', category: 'Database', icon: '🔴' },

  // DevOps
  { id: 'docker', name: 'Docker', category: 'DevOps', icon: '🐳' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', icon: '☸️' },
  { id: 'aws', name: 'AWS', category: 'DevOps', icon: '☁️' },
  { id: 'github', name: 'GitHub', category: 'DevOps', icon: '🐙' },

  // Tools
  { id: 'vscode', name: 'VS Code', category: 'Tools', icon: '📝' },
  { id: 'git', name: 'Git', category: 'Tools', icon: '🌿' },
  { id: 'npm', name: 'npm', category: 'Tools', icon: '📦' },
  { id: 'webpack', name: 'Webpack', category: 'Tools', icon: '📦' }
]

interface TechStackSelectorProps {
  selectedStacks: string[]
  onSelectionChange: (stacks: string[]) => void
}

export default function TechStackSelector({ selectedStacks, onSelectionChange }: TechStackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const categories: Array<TechStack['category']> = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools']

  const filteredStacks = TECH_STACKS.filter(stack =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleStack = (stackId: string) => {
    if (selectedStacks.includes(stackId)) {
      onSelectionChange(selectedStacks.filter(id => id !== stackId))
    } else {
      onSelectionChange([...selectedStacks, stackId])
    }
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  const selectAll = () => {
    onSelectionChange(TECH_STACKS.map(s => s.id))
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Select Tech Stack</h2>
        <p className="text-xs text-gray-600 mb-3">
          Choose technologies to include in your design
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search technologies..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Selection count and actions */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-600">
            {selectedStacks.length} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-600 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stack List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map(category => {
          const categoryStacks = filteredStacks.filter(s => s.category === category)
          if (categoryStacks.length === 0) return null

          return (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {categoryStacks.map(stack => (
                  <label
                    key={stack.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStacks.includes(stack.id)}
                      onChange={() => toggleStack(stack.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xl">{stack.icon}</span>
                    <span className="text-sm text-gray-800 font-medium">
                      {stack.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { TECH_STACKS }
