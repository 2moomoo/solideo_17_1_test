import { useSceneStore } from '../stores/sceneStore'
import type { SceneObject } from '../types'
import * as THREE from 'three'

function SceneObjectMesh({ object }: { object: SceneObject }) {
  const { selectObject, selectedObjectIds } = useSceneStore()
  const isSelected = selectedObjectIds.includes(object.id)

  const handleClick = (e: any) => {
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
    <mesh
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      onClick={handleClick}
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
