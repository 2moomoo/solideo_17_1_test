import { useRef, useEffect } from 'react'
import { Stage, Layer, Path, Group, Transformer } from 'react-konva'
import { useIconStore } from '../stores/iconStore'
import Konva from 'konva'

export default function PolygonCanvas() {
  const { icons, selectedIconId, selectedPolygonId, selectIcon, selectPolygon, updateIconPosition } = useIconStore()
  const transformerRef = useRef<Konva.Transformer>(null)
  const selectedShapeRef = useRef<Konva.Path>(null)

  // Update transformer when selection changes
  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedPolygonId])

  const handleIconDragEnd = (iconId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    updateIconPosition(iconId, {
      x: node.x(),
      y: node.y()
    })
  }

  const handlePolygonClick = (iconId: string, polygonId: string) => {
    selectIcon(iconId)
    selectPolygon(polygonId)
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect when clicking on empty area
    if (e.target === e.target.getStage()) {
      selectIcon(null)
      selectPolygon(null)
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <Stage
        width={window.innerWidth - 500} // Leave space for right panel
        height={window.innerHeight}
        onClick={handleStageClick}
      >
        <Layer>
          {icons.map((icon) => (
            <Group
              key={icon.id}
              x={icon.position.x}
              y={icon.position.y}
              draggable
              onDragEnd={(e) => handleIconDragEnd(icon.id, e)}
            >
              {icon.polygons.map((polygon) => {
                const isSelected = selectedIconId === icon.id && selectedPolygonId === polygon.id

                return (
                  <Path
                    key={polygon.id}
                    ref={isSelected ? selectedShapeRef : null}
                    data={polygon.svgPath}
                    fill={polygon.fill}
                    stroke={polygon.stroke}
                    strokeWidth={polygon.strokeWidth}
                    opacity={polygon.opacity || 1}
                    onClick={() => handlePolygonClick(icon.id, polygon.id)}
                    onTap={() => handlePolygonClick(icon.id, polygon.id)}
                    draggable={false}
                    listening={true}
                    shadowColor={isSelected ? '#4A90E2' : undefined}
                    shadowBlur={isSelected ? 10 : 0}
                    shadowOpacity={isSelected ? 0.5 : 0}
                  />
                )
              })}
            </Group>
          ))}

          {/* Transformer for selected polygon */}
          {selectedPolygonId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
