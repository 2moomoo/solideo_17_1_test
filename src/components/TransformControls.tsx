import { useEffect, useRef } from 'react'
import { TransformControls as DreiTransformControls } from '@react-three/drei'
import { useSceneStore } from '../stores/sceneStore'
import { useThree } from '@react-three/fiber'

export default function TransformControls() {
  const { objects, selectedObjectIds, transformMode, updateObject } = useSceneStore()
  const { scene } = useThree()
  const controlsRef = useRef<any>(null)

  const selectedObject = selectedObjectIds.length === 1
    ? objects.find(obj => obj.id === selectedObjectIds[0])
    : null

  useEffect(() => {
    if (controlsRef.current && selectedObject) {
      const controls = controlsRef.current

      const handleChange = () => {
        if (controls.object) {
          const { position, rotation, scale } = controls.object

          updateObject(selectedObject.id, {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
            scale: { x: scale.x, y: scale.y, z: scale.z }
          })
        }
      }

      controls.addEventListener('change', handleChange)
      return () => controls.removeEventListener('change', handleChange)
    }
  }, [selectedObject, updateObject])

  if (!selectedObject) return null

  // Find the Three.js object in the scene
  const object = scene.getObjectByProperty('uuid', selectedObject.id)

  if (!object) return null

  return (
    <DreiTransformControls
      ref={controlsRef}
      object={object}
      mode={transformMode}
      showX
      showY
      showZ
    />
  )
}
