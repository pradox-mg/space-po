import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const STAR_COUNT = 2200

export function Starfield() {
  const { camera } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const { positions, sizes, phases, brightness } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const phases = new Float32Array(STAR_COUNT) // twinkle phase offset
    const brightness = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute on a sphere - full 360° sphere
      const r = THREE.MathUtils.randFloat(30, 180)
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2))
      const phi = THREE.MathUtils.randFloat(0, Math.PI * 2)

      positions[i * 3]     = r * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = r * Math.cos(theta)

      // Star size distribution: mostly tiny, some medium, rare large
      const rand = Math.random()
      sizes[i] = rand < 0.70 ? THREE.MathUtils.randFloat(0.03, 0.08)
               : rand < 0.92 ? THREE.MathUtils.randFloat(0.09, 0.18)
               :                THREE.MathUtils.randFloat(0.22, 0.38)

      phases[i] = Math.random() * Math.PI * 2
      brightness[i] = THREE.MathUtils.randFloat(0.5, 1.0)
    }
    return { positions, sizes, phases, brightness }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    timeRef.current += delta

    // Follow camera so stars are always visible
    pointsRef.current.position.copy(camera.position)

    // Animate size attribute for twinkle
    const geo = pointsRef.current.geometry
    const sizeAttr = geo.getAttribute('size') as THREE.BufferAttribute
    const t = timeRef.current

    for (let i = 0; i < STAR_COUNT; i++) {
      const twinkle = 0.75 + 0.25 * Math.sin(t * (1.2 + brightness[i]) + phases[i])
      sizeAttr.array[i] = sizes[i] * twinkle
    }
    sizeAttr.needsUpdate = true
  })

  const vertexShader = `
    attribute float size;
    attribute float bright;
    varying float vBright;
    void main() {
      vBright = bright;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }
  `

  const fragmentShader = `
    varying float vBright;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      // Soft star disc with a bright core
      float alpha = smoothstep(0.5, 0.0, d) * vBright;
      // Slightly blue-white tint for distant stars, warm for close
      vec3 col = mix(vec3(0.72, 0.78, 1.0), vec3(1.0, 0.95, 0.85), vBright);
      gl_FragColor = vec4(col, alpha);
    }
  `

  const sizeAttr = useMemo(() => new Float32Array(sizes), [sizes])
  const brightAttr = useMemo(() => new Float32Array(brightness), [brightness])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={STAR_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-size"     args={[sizeAttr, 1]}  count={STAR_COUNT} itemSize={1} />
        <bufferAttribute attach="attributes-bright"   args={[brightAttr, 1]} count={STAR_COUNT} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
