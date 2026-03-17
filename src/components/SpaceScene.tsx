import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import type { AsteroidLinkId } from './SpaceExperience'
import { Asteroid } from './objects/Asteroid'
import { Nebula } from './objects/Nebula'
import { Starfield } from './objects/Starfield'

interface SpaceSceneProps {
  currentIndex: number
  asteroidOrder: AsteroidLinkId[]
  links: Record<AsteroidLinkId, string>
  labels: Record<AsteroidLinkId, string>
  onAsteroidClick: (index: number) => void
  isWarping: boolean
}

type AsteroidConfig = {
  id: AsteroidLinkId
  position: [number, number, number]
  scale: number
}

export function SpaceScene({
  currentIndex,
  asteroidOrder,
  links,
  labels,
  onAsteroidClick,
  isWarping,
}: SpaceSceneProps) {
  const { camera, mouse } = useThree()
  const mouseLightRef = useRef<THREE.PointLight>(null!)

  const mousePosRef = useRef({ x: 0, y: 0 })

  const asteroidConfigs: AsteroidConfig[] = useMemo(
    () => [
      { id: 'portfolio', position: [0, 0.2, -2], scale: 3.0 },
      { id: 'instagram', position: [-7.2, 3.8, -5], scale: 2.2 },
      { id: 'github', position: [10.98, -4.14, -7.12], scale: 2.2 },
      { id: 'whatsapp', position: [-10.89, -2.8, -8], scale: 2.2 },
      { id: 'email', position: [8.96, 2.86, -9], scale: 2.2 },
    ],
    [],
  )

  useFrame((_state, delta) => {
    const targetIndex = asteroidOrder[currentIndex]
    const targetConfig = asteroidConfigs.find((a) => a.id === targetIndex)

    mousePosRef.current.x = mouse.x
    mousePosRef.current.y = mouse.y

    if (mouseLightRef.current) {
      mouseLightRef.current.position.x = THREE.MathUtils.lerp(
        mouseLightRef.current.position.x,
        mouse.x * 10,
        0.10,
      )
      mouseLightRef.current.position.y = THREE.MathUtils.lerp(
        mouseLightRef.current.position.y,
        mouse.y * 6,
        0.10,
      )
    }

    if (targetConfig) {
      const [x, y, z] = targetConfig.position
      // Scale-aware zoom that leaves room for labels
      const zoomFactor = 1.4
      const desiredZ = z + (targetConfig.scale * zoomFactor)
      const mouseX = mouse.x * 0.3
      const mouseY = mouse.y * 0.2
      const speed = isWarping ? 5.5 : 2.5

      camera.position.x = THREE.MathUtils.damp(camera.position.x, x + mouseX, speed, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, y + mouseY, speed, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, speed, delta)
      camera.lookAt(x, y, z)
    } else {
      const mouseX = mouse.x * 0.3
      const mouseY = mouse.y * 0.2

      camera.position.x = THREE.MathUtils.damp(camera.position.x, mouseX, 2.0, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, mouseY, 2.0, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 8, 2.0, delta)
      camera.lookAt(0, 0, -10)
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} color="#120820" />
      <directionalLight
        position={[-5, 9, 5]}
        intensity={2.0}
        color="#ffe0a0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[8, -3, 3]}
        intensity={0.5}
        color="#5060d0"
      />
      <pointLight
        position={[0, 3, -28]}
        intensity={10.0}
        distance={55}
        decay={2}
        color="#7733cc"
      />

      <pointLight
        ref={mouseLightRef}
        position={[0, 0, -2]}
        intensity={45.0} // Signficantly brighter
        distance={22}   // Larger radius
        decay={2}
        color="#f5b0ff"
      />

      <Nebula />
      <Starfield />

      <group>
        {asteroidConfigs.map((config, index) => (
          <Asteroid
            key={config.id}
            id={config.id}
            label={labels[config.id]} // Pass the Arabic label
            link={links[config.id]}
            position={config.position}
            scale={config.scale}
            index={index}
            isLast={index === asteroidConfigs.length - 1}
            onClick={() => onAsteroidClick(index)}
            mousePos={mousePosRef.current}
          />
        ))}
      </group>
    </>
  )
}
