import { SpaceExperience } from './SpaceExperience'

export function ExperiencePage() {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', animation: 'pageFadeIn 1.2s ease forwards' }}>
      {/* Layer 0: Background Fallback (SplineGlobe removed due to remote resource error) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(circle at center, #0a0620 0%, #01010a 100%)',
          pointerEvents: 'none',
          opacity: 0.8
        }}
      />

      {/* Layer 1: Three.js Main Scene */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
        }}
      >
        <SpaceExperience />
      </div>

      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
