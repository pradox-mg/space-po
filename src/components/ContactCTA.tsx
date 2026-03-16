import { useState } from 'react'

export function ContactCTA() {
  const [hovered, setHovered] = useState(false)

  const handleContact = () => {
    window.location.href = 'mailto:your-email@example.com?subject=I want a website like this!'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        pointerEvents: 'auto',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleContact}
        style={{
          padding: '12px 24px',
          background: hovered ? 'rgba(100, 80, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
          border: hovered ? '1px solid rgba(150, 130, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateX(-5px) scale(1.02)' : 'translateX(0) scale(1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            color: 'rgba(200, 190, 255, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '4px',
            fontFamily: "'Courier New', monospace",
          }}
        >
          Want a website like this?
        </span>
        <span
          style={{
            fontSize: '0.9rem',
            color: '#fff',
            fontWeight: 500,
            letterSpacing: '0.05em',
            fontFamily: "'Courier New', monospace",
          }}
        >
          Contact Us →
        </span>
      </div>

      {hovered && (
        <div
          style={{
            fontSize: '0.6rem',
            color: 'rgba(150, 140, 200, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: "'Courier New', monospace",
            animation: 'fadeIn 0.3s ease forwards',
          }}
        >
          Limited slots available for Q2
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
