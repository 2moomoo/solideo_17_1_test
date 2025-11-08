import { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { Stage, Layer, Path, Group, Text } from 'react-konva'
import { useLayoutStore } from '../stores/layoutStore'
import Konva from 'konva'

export interface PolygonCanvasRef {
  exportImage: () => string
}

const PolygonCanvas = forwardRef<PolygonCanvasRef>((_props, ref) => {
  const {
    elements,
    backgroundPolygons,
    selectedPolygonId,
    selectPolygon,
    updateElementPosition
  } = useLayoutStore()

  const selectedShapeRef = useRef<Konva.Path>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (stageRef.current) {
        return stageRef.current.toDataURL({ pixelRatio: 2 })
      }
      return ''
    }
  }))

  const handleElementDragEnd = (elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    updateElementPosition(elementId, {
      x: node.x(),
      y: node.y()
    })
  }

  const handlePolygonClick = (polygonId: string, e: Konva.KonvaEventObject<MouseEvent | TouchEvent | Event>) => {
    e.cancelBubble = true
    selectPolygon(polygonId)
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect when clicking on empty area
    if (e.target === e.target.getStage()) {
      selectPolygon(null)
    }
  }

  return (
    <div ref={containerRef} className="flex-1 bg-gradient-to-br from-sky-100 to-blue-200 overflow-hidden relative">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Background polygons (platform, rails, etc.) */}
          {backgroundPolygons.map((polygon) => {
            const isSelected = selectedPolygonId === polygon.id

            return (
              <Path
                key={polygon.id}
                ref={isSelected ? selectedShapeRef : null}
                data={polygon.svgPath}
                fill={polygon.fill}
                stroke={polygon.stroke}
                strokeWidth={polygon.strokeWidth}
                opacity={polygon.opacity || 1}
                onClick={(e) => handlePolygonClick(polygon.id, e)}
                onTap={(e) => handlePolygonClick(polygon.id, e)}
                listening={true}
                shadowColor={isSelected ? '#FFD700' : undefined}
                shadowBlur={isSelected ? 15 : 0}
                shadowOpacity={isSelected ? 0.8 : 0}
              />
            )
          })}

          {/* Tech stack elements (trains, etc.) */}
          {elements.map((element) => (
            <Group
              key={element.id}
              x={element.position.x}
              y={element.position.y}
              draggable
              onDragEnd={(e) => handleElementDragEnd(element.id, e)}
            >
              {element.polygons.map((polygon) => {
                const isSelected = selectedPolygonId === polygon.id

                return (
                  <Path
                    key={polygon.id}
                    ref={isSelected ? selectedShapeRef : null}
                    data={polygon.svgPath}
                    fill={polygon.fill}
                    stroke={polygon.stroke}
                    strokeWidth={polygon.strokeWidth}
                    opacity={polygon.opacity || 1}
                    onClick={(e) => handlePolygonClick(polygon.id, e)}
                    onTap={(e) => handlePolygonClick(polygon.id, e)}
                    listening={true}
                    shadowColor={isSelected ? '#FFD700' : undefined}
                    shadowBlur={isSelected ? 15 : 0}
                    shadowOpacity={isSelected ? 0.8 : 0}
                  />
                )
              })}

              {/* Label */}
              {element.label && (
                <Text
                  text={element.label}
                  x={0}
                  y={-40}
                  width={180}
                  align="center"
                  fontSize={16}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="#333333"
                  listening={false}
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>

      {/* Instructions overlay */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🚂</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Design!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select tech stacks on the left and click "Generate Design" to create your visualization
            </p>
            <div className="text-xs text-gray-500">
              Try: "Train station platform" style
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

PolygonCanvas.displayName = 'PolygonCanvas'

export default PolygonCanvas
