import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, Text } from '@react-three/drei'
import type { AsteroidLinkId } from '../SpaceExperience'

interface AsteroidProps {
  id: AsteroidLinkId
  label: string
  link: string
  position: [number, number, number]
  scale: number
  index: number
  isLast: boolean
  onClick: () => void
  mousePos: { x: number; y: number }
}

const GLTF_MODEL_PATH = '/model.glb'

export function Asteroid({ label, position, scale, onClick, mousePos }: AsteroidProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(GLTF_MODEL_PATH)

  // Get the first mesh geometry from the loaded GLTF model
  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    scene.traverse((child: THREE.Object3D) => {
      if (!geo && (child as THREE.Mesh).isMesh) {
        geo = (child as THREE.Mesh).geometry
      }
    })
    return geo
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return

    // ── Gentle self-rotation
    groupRef.current.rotation.y += 0.0025
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -mousePos.y * 0.10, 0.04,
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z, mousePos.x * 0.08, 0.04,
    )
  })

  return (
    <group position={position}>
      {geometry && (
        <mesh
          ref={groupRef}
          geometry={geometry}
          scale={scale}
          castShadow
          receiveShadow
          onClick={(ev: any) => {
            ev.stopPropagation()
            onClick()
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <meshStandardMaterial
            color="#4a3a6a"
            roughness={0.8}
            metalness={0.4}
            envMapIntensity={1.2}
          />
        </mesh>
      )}

      {/* ── Persistent Label ── */}
      <Text
        position={[0, -scale * 0.45 - 1.2, 0]}
        fontSize={0.24}
        color="#f5ebff"
        anchorX="center"
        anchorY="top"
        maxWidth={3}
      >
        <meshStandardMaterial 
          color="#f5ebff" 
          emissive="#c383ff" 
          emissiveIntensity={4} 
          toneMapped={false}
        />
        {label.toUpperCase()}
      </Text>
    </group>
  )
}

useGLTF.preload(GLTF_MODEL_PATH)
