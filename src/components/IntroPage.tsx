import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function IntroPage() {
  const navigate = useNavigate()
  const [fading, setFading] = useState(false)

  const handleClick = () => {
    setFading(true)
    setTimeout(() => navigate('/experience'), 700) // wait for fade out
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
      onClick={handleClick}
    >
      {/* ── Spline Background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: '#000', // Immediate black background while loading
        }}
        // Inject spline-viewer as raw HTML so the custom element works
        // Added hint to hide the logo and optimize loading
        dangerouslySetInnerHTML={{
          __html: `<spline-viewer
            url="https://prod.spline.design/ASfdZiBeqTwEjzFe/scene.splinecode"
            style="width:100%;height:100%;display:block;"
            loading-el=""
            logo-layer="none"
          ></spline-viewer>`,
        }}
      />

      {/* ── Dark overlay to make text readable ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,6,0.3) 0%, rgba(0,0,12,0.65) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Text content ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.6rem',
          textAlign: 'center',
          padding: '2rem',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {/* Name / headline */}
        <h1
          style={{
            margin: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            fontWeight: 300,
            letterSpacing: '0.35em',
            color: '#ffffff',
            textShadow: '0 0 40px rgba(150,120,255,0.9), 0 0 80px rgba(100,80,200,0.5)',
            textTransform: 'uppercase',
          }}
        >
          Space Portfolio
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: 0,
            fontFamily: "'Courier New', monospace",
            fontSize: 'clamp(0.85rem, 1.6vw, 1.1rem)',
            letterSpacing: '0.22em',
            color: 'rgba(200,190,255,0.75)',
            textTransform: 'uppercase',
          }}
        >
          Navigate the cosmos · Discover my work
        </p>

        {/* CTA pulse button */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '0.8rem 2.8rem',
            border: '1px solid rgba(180,160,255,0.5)',
            borderRadius: '100px',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.8rem',
            letterSpacing: '0.3em',
            color: 'rgba(220,210,255,0.9)',
            textTransform: 'uppercase',
            background: 'rgba(80,50,150,0.15)',
            backdropFilter: 'blur(8px)',
            animation: 'pulseBorder 2.4s ease-in-out infinite',
          }}
        >
          Click anywhere to enter
        </div>
      </div>

      <style>{`
        @keyframes pulseBorder {
          0%,100% { box-shadow: 0 0 0 0 rgba(150,120,255,0); border-color: rgba(180,160,255,0.5); }
          50%      { box-shadow: 0 0 20px 4px rgba(150,120,255,0.4); border-color: rgba(200,180,255,0.9); }
        }
      `}</style>
    </div>
  )
}
