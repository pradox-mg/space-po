import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

/* ─── Deep-Space Nebula Shader ──────────────────────────────────────── */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    for(int i=0;i<7;i++){v+=a*noise(p);p*=2.08;a*=0.50;}
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.5 - 1.25;

    /* Two layers of warped FBM for real depth */
    vec2 q = uv + vec2(uTime*0.006, uTime*0.004);
    float n1 = fbm(q);
    float n2 = fbm(q + n1*0.9 + vec2(1.7, 9.2));
    float n3 = fbm(q + n2*0.7 + vec2(uTime*0.003));

    /* Cinema palette: void black → deep indigo → cosmic violet → gold veil */
    vec3 void_   = vec3(0.00, 0.00, 0.01);
    vec3 indigo  = vec3(0.02, 0.01, 0.09);
    vec3 violet  = vec3(0.06, 0.02, 0.16);
    vec3 cobalt  = vec3(0.02, 0.04, 0.18);
    vec3 gold    = vec3(0.20, 0.14, 0.04);
    vec3 teal    = vec3(0.01, 0.08, 0.12);

    float t = n3;
    vec3 col = void_;
    col = mix(col, indigo, smoothstep(0.18, 0.36, t));
    col = mix(col, cobalt, smoothstep(0.32, 0.50, t));
    col = mix(col, violet, smoothstep(0.46, 0.64, t));
    col = mix(col, teal,   smoothstep(0.60, 0.74, t));
    col = mix(col, gold,   smoothstep(0.80, 0.95, t) * 0.30);

    /* Stronger dark vignette — pulls hard to black at edges */
    float d = length(uv);
    col *= 1.0 - smoothstep(0.30, 0.90, d);
    col  = mix(col, vec3(0.0), smoothstep(0.55, 1.10, d));

    /* Subtle brightness pulse */
    col *= 0.80 + 0.06*sin(uTime*0.25 + n1*3.0);

    gl_FragColor = vec4(col, 1.0);
  }
`

export function Nebula() {
  const { camera } = useThree()
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta
    if (meshRef.current) meshRef.current.position.copy(camera.position)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[200, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
