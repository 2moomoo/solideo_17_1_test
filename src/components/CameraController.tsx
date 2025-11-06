import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useRenderStore } from '../stores/renderStore'
import * as THREE from 'three'

export default function CameraController() {
  const { camera } = useThree()
  const { cameraView } = useRenderStore()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    // Get OrbitControls instance
    const controls = (camera as any).controls
    if (controls) {
      controlsRef.current = controls
    }

    const animateCamera = () => {
      let targetPosition: THREE.Vector3
      let targetLookAt = new THREE.Vector3(0, 0, 0)

      switch (cameraView) {
        case 'top':
          // Top view (looking down)
          targetPosition = new THREE.Vector3(0, 15, 0)
          break
        case 'front':
          // Front view
          targetPosition = new THREE.Vector3(0, 5, 15)
          break
        case 'side':
          // Side view
          targetPosition = new THREE.Vector3(15, 5, 0)
          break
        case 'perspective':
        default:
          // Perspective view
          targetPosition = new THREE.Vector3(5, 5, 5)
          break
      }

      // Smooth camera animation
      const startPosition = camera.position.clone()
      const duration = 800 // ms
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-in-out)
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        camera.position.lerpVectors(startPosition, targetPosition, eased)

        if (controls) {
          controls.target.lerp(targetLookAt, eased)
          controls.update()
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    animateCamera()
  }, [cameraView, camera])

  return null
}
