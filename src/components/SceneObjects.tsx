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
  // This would normally come from asset data, but for now we'll use basic shapes
  switch (object.name) {
    case 'Sphere':
      return <sphereGeometry args={[1, 32, 32]} />
    case 'Cylinder':
      return <cylinderGeometry args={[1, 1, 2, 32]} />
    case 'Cone':
      return <coneGeometry args={[1, 2, 32]} />
    case 'Torus':
      return <torusGeometry args={[1, 0.4, 16, 100]} />
    default:
      return <boxGeometry args={[1, 1, 1]} />
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
