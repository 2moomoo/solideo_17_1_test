import { create } from 'zustand'
import type { DiagramNode, DiagramEdge } from '../types'

interface DiagramState {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  selectedNodeIds: string[]

  // Actions
  setNodes: (nodes: DiagramNode[]) => void
  setEdges: (edges: DiagramEdge[]) => void
  addNode: (node: DiagramNode) => void
  addEdge: (edge: DiagramEdge) => void
  removeNode: (id: string) => void
  removeEdge: (id: string) => void
  updateNode: (id: string, updates: Partial<DiagramNode>) => void
  selectNode: (id: string, multiSelect?: boolean) => void
  clearSelection: () => void
  clearDiagram: () => void
}

export const useDiagramStore = create<DiagramState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),

  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge]
  })),

  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== id),
    edges: state.edges.filter(e => e.source !== id && e.target !== id),
    selectedNodeIds: state.selectedNodeIds.filter(nid => nid !== id)
  })),

  removeEdge: (id) => set((state) => ({
    edges: state.edges.filter(e => e.id !== id)
  })),

  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, ...updates } : node
    )
  })),

  selectNode: (id, multiSelect = false) => set((state) => {
    if (multiSelect) {
      const isSelected = state.selectedNodeIds.includes(id)
      return {
        selectedNodeIds: isSelected
          ? state.selectedNodeIds.filter(nid => nid !== id)
          : [...state.selectedNodeIds, id]
      }
    }
    return { selectedNodeIds: [id] }
  }),

  clearSelection: () => set({ selectedNodeIds: [] }),

  clearDiagram: () => set({ nodes: [], edges: [], selectedNodeIds: [] })
}))
