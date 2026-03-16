import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { SpaceScene } from './SpaceScene'
import { ContactCTA } from './ContactCTA'



export type AsteroidLinkId = 'instagram' | 'github' | 'whatsapp' | 'email' | 'portfolio';

const ASTEROID_LINKS: Record<AsteroidLinkId, string> = {
  instagram: 'https://pradoxpr.netlify.app',
  github: 'https://github.com/pradox-mg',
  whatsapp: 'https://wa.me/20127270326',
  email: 'https://wa.me/2027270326',
  portfolio: 'mailto:ahmedmakhlof950@gmail.com',
}

const ASTEROID_ORDER: AsteroidLinkId[] = ['instagram', 'github', 'whatsapp', 'email', 'portfolio']

export const ARABIC_LABELS: Record<AsteroidLinkId, string> = {
  instagram: 'إنستجرام',
  github: 'جيت هب',
  whatsapp: 'واتساب',
  email: 'إيميل',
  portfolio: 'الأعمال',
}

export function SpaceExperience() {
  // -1 = no focus, 0..4 = focused asteroid index
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isWarping, setIsWarping] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play warp sound
  const playWarp = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/warp-whoosh.mp3')
      audioRef.current.volume = 0.5
    }
    audioRef.current.currentTime = 0
    void audioRef.current.play().catch(() => { })
  }

  // Navigate to a specific asteroid index with warp
  const goTo = (idx: number) => {
    if (isWarping) return
    setIsWarping(true)
    playWarp()
    setCurrentIndex(idx)
    setTimeout(() => setIsWarping(false), 900)
  }

  // Arrow: go to prev / next
  const goPrev = () => {
    const next = currentIndex <= 0
      ? ASTEROID_ORDER.length - 1
      : currentIndex - 1
    goTo(next)
  }
  const goNext = () => {
    const next = currentIndex < 0
      ? 0
      : (currentIndex + 1) % ASTEROID_ORDER.length
    goTo(next)
  }

  // Single click on asteroid → ALWAYS open link directly, NEVER navigate/zoom
  const handleAsteroidClick = (index: number) => {
    if (isWarping) return

    const id = ASTEROID_ORDER[index]
    if (id && ASTEROID_LINKS[id]) {
      window.open(ASTEROID_LINKS[id], '_blank')
    }
  }

  // Click empty space → un-focus
  const handlePointerMissed = () => {
    if (!isWarping && currentIndex !== -1) {
      setIsWarping(true)
      setCurrentIndex(-1)
      setTimeout(() => setIsWarping(false), 700)
    }
  }

  const asteroidOrder: AsteroidLinkId[] = useMemo(() => ASTEROID_ORDER, [])

  const arrowBase: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.85)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'background 0.2s, border-color 0.2s',
    userSelect: 'none',
  }

  const currentLabel = currentIndex >= 0 ? ASTEROID_ORDER[currentIndex] : null

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* ── Arrow navigation overlay ── */}
      <button
        onClick={goPrev}
        style={{ ...arrowBase, left: '20px' }}
        title="Previous"
      >‹</button>

      <button
        onClick={goNext}
        style={{ ...arrowBase, right: '20px' }}
        title="Next"
      >›</button>

      {/* ── Current asteroid label + click-hint ── */}
      {currentLabel && (
        <div
          style={{
            position: 'fixed',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            fontFamily: "'Courier New', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: 'rgba(220,210,255,0.75)',
            textTransform: 'uppercase',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {ARABIC_LABELS[currentLabel]} &nbsp;·&nbsp; اضغط للفتح
        </div>
      )}

      {/* ── Contact CTA Overlay ── */}
      <ContactCTA />

      {/* Dot navigation */}
      <div
        style={{
          position: 'fixed',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
        }}
      >
        {ASTEROID_ORDER.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === currentIndex ? '8px' : '6px',
              height: i === currentIndex ? '8px' : '6px',
              borderRadius: '50%',
              background: i === currentIndex
                ? 'rgba(200,180,255,0.9)'
                : 'rgba(255,255,255,0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 58, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
        style={{ position: 'absolute', inset: 0 }}
        onPointerMissed={handlePointerMissed}
      >
        <fog attach="fog" args={['#060412', 20, 70]} />

        {/* ── Scene Canvas ── */}
        <Suspense fallback={
          <Html center>
            <div style={{
              position: 'absolute',
              width: '400px',
              textAlign: 'center',
              color: 'rgba(195, 131, 255, 0.7)',
              fontFamily: "'Courier New', monospace",
              fontSize: '0.9rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              جاري تحميل الكون...
            </div>
          </Html>
        }>
          <SpaceScene
            currentIndex={currentIndex}
            asteroidOrder={asteroidOrder}
            links={ASTEROID_LINKS}
            labels={ARABIC_LABELS}
            onAsteroidClick={handleAsteroidClick}
            isWarping={isWarping}
          />

          <EffectComposer multisampling={4}>
            <Bloom
              intensity={1.2} // Increased for "pop"
              luminanceThreshold={0.70}
              luminanceSmoothing={0.7}
              mipmapBlur
              radius={0.7} // Softer glow
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}
