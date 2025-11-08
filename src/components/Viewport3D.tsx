import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import { useSceneStore } from '../stores/sceneStore'
import SceneObjects from './SceneObjects'
import TransformControls from './TransformControls'
import CameraController from './CameraController'

function OrbitControlsWrapper() {
  const controlsRef = useRef<any>(null)
  const { gl } = useThree()

  useEffect(() => {
    const checkDragging = () => {
      if (controlsRef.current) {
        // @ts-ignore
        const isDragging = gl.domElement.dataset.isDragging === 'true'
        controlsRef.current.enabled = !isDragging
      }
    }

    const intervalId = setInterval(checkDragging, 50)
    return () => clearInterval(intervalId)
  }, [gl])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={50}
    />
  )
}

// Component to handle ESC key press for deselection
function KeyboardHandler() {
  const { clearSelection } = useSceneStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearSelection])

  return null
}

export default function Viewport3D() {
  const { sceneSettings, clearSelection } = useSceneStore()

  const handleCanvasClick = (e: any) => {
    // Only clear selection if clicking directly on the canvas (not on objects)
    // Check if the target is the canvas itself
    if (e.target.tagName === 'CANVAS') {
      clearSelection()
    }
  }

  return (
    <div className="w-full h-full bg-gray-950" onClick={handleCanvasClick}>
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        style={{ background: sceneSettings.backgroundColor }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={sceneSettings.ambientLightIntensity} />
        <directionalLight
          position={[
            sceneSettings.directionalLightPosition.x,
            sceneSettings.directionalLightPosition.y,
            sceneSettings.directionalLightPosition.z
          ]}
          intensity={sceneSettings.directionalLightIntensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Grid */}
        {sceneSettings.showGrid && (
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6b7280"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9ca3af"
            fadeDistance={50}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        {/* Scene Objects */}
        <SceneObjects />

        {/* Transform Controls */}
        <TransformControls />

        {/* Camera Controls */}
        <OrbitControlsWrapper />

        {/* Camera View Controller */}
        <CameraController />

        {/* Keyboard Handler */}
        <KeyboardHandler />
      </Canvas>
    </div>
  )
}
