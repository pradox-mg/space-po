import { useState, useEffect } from 'react'

const GLOBE_SCENE = 'https://prod.spline.design/3Yz8z5fcd5fMZ6hs/scene.splinecode'

export function SplineGlobe() {
  const [showIframe, setShowIframe] = useState(false)

  // Delay loading the Spline iframe slightly so the main ThreeJS canvas mounts first.
  // This helps prevent WebGL context loss and "Too many active WebGL contexts" errors.
  useEffect(() => {
    setShowIframe(true)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.65,
        backgroundColor: '#01010a', // Solid fallback background
      }}
    >
      {/* 
        Using dangerouslySetInnerHTML with the raw spline-viewer web component 
        instead of @splinetool/react-spline.
        This forces the viewer into an isolated sandbox, preventing its internal 
        Three.js instance from colliding with our main @react-three/fiber canvas,
        which was causing the "WebGL context lost" crashes on weak GPUs.
      */}
      {showIframe && (
        <div
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          dangerouslySetInnerHTML={{
            __html: `<spline-viewer 
                 url="${GLOBE_SCENE}" 
                 style="width: 100%; height: 100%; display: block;"
               ></spline-viewer>`
          }}
        />
      )}

      {/* Loading overlay / fallback to prevent pure black screen */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, #0a0620 0%, #01010a 100%)',
        zIndex: -1,
      }} />
    </div>
  )
}
