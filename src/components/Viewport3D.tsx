import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import { useSceneStore } from '../stores/sceneStore'
import SceneObjects from './SceneObjects'
import TransformControls from './TransformControls'
import CameraController from './CameraController'

export default function Viewport3D() {
  const { sceneSettings } = useSceneStore()

  return (
    <div className="w-full h-full bg-gray-950">
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
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={50}
        />

        {/* Camera View Controller */}
        <CameraController />
      </Canvas>
    </div>
  )
}
