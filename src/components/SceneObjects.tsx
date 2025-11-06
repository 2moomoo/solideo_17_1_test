import { useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '../stores/sceneStore'
import type { SceneObject } from '../types'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

function SceneObjectMesh({ object }: { object: SceneObject }) {
  const { selectObject, selectedObjectIds, updateObject, objects } = useSceneStore()
  const isSelected = selectedObjectIds.includes(object.id)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, raycaster, pointer, gl } = useThree()
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5))
  const dragOffset = useRef(new THREE.Vector3())

  const checkCollision = (newPos: { x: number; y: number; z: number }): { x: number; y: number; z: number } => {
    const collisionRadius = 1.0

    for (const obj of objects) {
      if (obj.id === object.id) continue

      const objPos = new THREE.Vector3(obj.position.x, 0, obj.position.z)
      const checkPos = new THREE.Vector3(newPos.x, 0, newPos.z)
      const distance = objPos.distanceTo(checkPos)

      if (distance < collisionRadius * 2) {
        // Calculate slide direction
        const slideDir = new THREE.Vector3()
          .subVectors(checkPos, objPos)
          .normalize()

        // Push away to avoid collision
        const slidePos = objPos.clone().add(slideDir.multiplyScalar(collisionRadius * 2.1))
        return { x: slidePos.x, y: newPos.y, z: slidePos.z }
      }
    }

    return newPos
  }

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    setIsDragging(true)
    selectObject(object.id, e.shiftKey)

    // Calculate offset from object center to intersection point
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(dragPlane.current, intersection)
    dragOffset.current.set(
      intersection.x - object.position.x,
      0,
      intersection.z - object.position.z
    )

    // @ts-ignore
    gl.domElement.style.cursor = 'grabbing'
  }

  const handlePointerMove = (e: any) => {
    if (!isDragging) return
    e.stopPropagation()

    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(dragPlane.current, intersection)

    const newPos = {
      x: intersection.x - dragOffset.current.x,
      y: object.position.y,
      z: intersection.z - dragOffset.current.z
    }

    // Check collision and adjust position
    const finalPos = checkCollision(newPos)

    updateObject(object.id, { position: finalPos })
  }

  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    setIsDragging(false)
    // @ts-ignore
    gl.domElement.style.cursor = 'auto'
  }

  const handleClick = (e: any) => {
    if (isDragging) return
    e.stopPropagation()
    selectObject(object.id, e.shiftKey)
  }

  const material = object.materialProps ? (
    <meshStandardMaterial
      color={object.materialProps.color}
      metalness={object.materialProps.metalness}
      roughness={object.materialProps.roughness}
      emissive={object.materialProps.emissive}
      emissiveIntensity={object.materialProps.emissiveIntensity}
    />
  ) : (
    <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} />
  )

  return (
    <group
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
    >
      <mesh
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerMissed={handlePointerUp}
        visible={object.visible}
        castShadow
        receiveShadow
      >
        {renderGeometry(object)}
        {material}
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="#fbbf24" linewidth={2} />
          </lineSegments>
        )}
      </mesh>

      {/* Top Text Label (for aerial view) */}
      {object.displayText && (
        <Text
          position={[0, 1.2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {object.displayText}
        </Text>
      )}

      {/* Bottom Text Label */}
      {object.displayText && (
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {object.displayText}
        </Text>
      )}

      {/* Top Emoji (for aerial view) */}
      {object.thumbnail && (
        <Text
          position={[0, 1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {object.thumbnail}
        </Text>
      )}

      {/* Front Emoji Icon */}
      {object.thumbnail && (
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {object.thumbnail}
        </Text>
      )}
    </group>
  )
}

function renderGeometry(object: SceneObject) {
  const geometryType = object.geometryType || 'box'
  const params = object.geometryParams || {}

  switch (geometryType) {
    case 'sphere':
      return <sphereGeometry args={[
        params.radius || 1,
        params.widthSegments || 32,
        params.heightSegments || 32
      ]} />
    case 'cylinder':
      return <cylinderGeometry args={[
        params.radiusTop || 1,
        params.radiusBottom || 1,
        params.height || 2,
        params.radialSegments || 32
      ]} />
    case 'cone':
      return <coneGeometry args={[
        params.radius || 1,
        params.height || 2,
        params.radialSegments || 32
      ]} />
    case 'torus':
      return <torusGeometry args={[
        params.radius || 1,
        params.tube || 0.4,
        params.radialSegments || 16,
        params.tubularSegments || 100
      ]} />
    case 'box':
    default:
      return <boxGeometry args={[
        params.width || 1,
        params.height || 1,
        params.depth || 1
      ]} />
  }
}

export default function SceneObjects() {
  const { objects, clearSelection } = useSceneStore()

  return (
    <group onClick={() => clearSelection()}>
      {objects.map((object) => (
        <SceneObjectMesh key={object.id} object={object} />
      ))}
    </group>
  )
}
