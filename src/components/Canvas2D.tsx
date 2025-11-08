import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from 'reactflow'
import 'reactflow/dist/style.css'

import CustomNode from './CustomNode'
import type { DiagramNodeData } from '../types'

const nodeTypes = {
  custom: CustomNode
}

interface Canvas2DProps {
  nodes: Node<DiagramNodeData>[]
  edges: Edge[]
  onNodesChange?: (nodes: Node<DiagramNodeData>[]) => void
  onEdgesChange?: (edges: Edge[]) => void
}

export default function Canvas2D({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange }: Canvas2DProps) {
  const [nodes, , handleNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, handleEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges)
      setEdges(newEdges)
      if (onEdgesChange) {
        onEdgesChange(newEdges)
      }
    },
    [edges, setEdges, onEdgesChange]
  )

  const handleNodesUpdate = useCallback(
    (changes: any) => {
      handleNodesChange(changes)
      if (onNodesChange) {
        onNodesChange(nodes)
      }
    },
    [handleNodesChange, nodes, onNodesChange]
  )

  const handleEdgesUpdate = useCallback(
    (changes: any) => {
      handleEdgesChange(changes)
      if (onEdgesChange) {
        onEdgesChange(edges)
      }
    },
    [handleEdgesChange, edges, onEdgesChange]
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesUpdate}
        onEdgesChange={handleEdgesUpdate}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={20}
          size={1}
          color="#cbd5e1"
          style={{ opacity: 0.3 }}
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as DiagramNodeData
            if (data.customShape?.fill) {
              return data.customShape.fill
            }
            return data.color || '#4A90E2'
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  )
}
