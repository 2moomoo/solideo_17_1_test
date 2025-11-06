import { useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '../stores/sceneStore'
import * as THREE from 'three'

export default function DragControls() {
  const { objects, updateObject } = useSceneStore()
  const { camera, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const intersection = useRef(new THREE.Vector3())
  const offset = useRef(new THREE.Vector3())
  const dragging = useRef<string | null>(null)

  const checkCollision = (newPos: THREE.Vector3, currentId: string): THREE.Vector3 => {
    const collisionRadius = 1.0 // Collision detection radius

    for (const obj of objects) {
      if (obj.id === currentId) continue

      const objPos = new THREE.Vector3(obj.position.x, 0, obj.position.z)
      const distance = objPos.distanceTo(new THREE.Vector3(newPos.x, 0, newPos.z))

      if (distance < collisionRadius * 2) {
        // Calculate slide direction
        const slideDir = new THREE.Vector3()
          .subVectors(new THREE.Vector3(newPos.x, 0, newPos.z), objPos)
          .normalize()

        // Push away to avoid collision
        const slidePos = objPos.clone().add(slideDir.multiplyScalar(collisionRadius * 2))
        return new THREE.Vector3(slidePos.x, newPos.y, slidePos.z)
      }
    }

    return newPos
  }

  return null
}
