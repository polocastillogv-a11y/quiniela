import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useSessionStore from '../../store/sessionStore'
import useParticipantesStore from '../../store/participantesStore'
import { TrophyIcon } from '../ui/Icons'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/participantes', label: 'Participantes' },
  { to: '/sorteo', label: 'Sorteo' },
  { to: '/quiniela', label: 'Quiniela' },
  { to: '/bolsa', label: 'Bolsa' },
  { to: '/bracket', label: 'Bracket' },
  { to: '/resultados', label: 'Resultados' },
]

export default function Navbar() {
  const location = useLocation()
  const sesion = useSessionStore(s => s)
  const participantes = useParticipantesStore(s => s.participantes)
  const [mobileOpen, setMobileOpen] = useState(false)

  const userName = sesion.tipo === 'admin'
    ? 'Admin'
    : sesion.participanteId
      ? participantes.find(p => p.id === sesion.participanteId)?.nombre || ''
      : null

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header
      style={{
        height: 62,
        padding: '0 26px',
        background: '#14442B',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 56px, rgba(0,0,0,.05) 56px 112px)',
      }}
      className="flex items-center justify-between w-full"
    >
      <Link to="/" className="flex items-center gap-[10px] shrink-0 no-underline">
        <TrophyIcon className="w-[22px] h-[22px] text-ocre" />
        <span className="font-display font-black text-[24px] text-crema-text leading-none tracking-normal" style={{ textTransform: 'uppercase' }}>
          MUNDIAL<span className="text-ocre">26</span>
        </span>
      </Link>

      <nav className="hidden lg:flex items-center gap-[22px]" style={{ letterSpacing: '.1em' }}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: location.pathname === l.to ? '#F3EAD0' : 'rgba(243,234,208,.6)',
              borderBottom: location.pathname === l.to ? '3px solid #D9A441' : '3px solid transparent',
              paddingBottom: 3,
              textDecoration: 'none',
              transition: 'color .2s',
            }}
            className="font-sans hover:text-crema-text"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {userName && (
        <div className="hidden sm:flex items-center gap-[9px]">
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#D9A441',
              color: '#14442B',
              fontWeight: 700,
              fontSize: 12,
            }}
            className="flex items-center justify-center font-sans"
          >
            {initials}
          </span>
          <span style={{ fontSize: 13, color: '#F3EAD0' }} className="font-sans font-medium">
            {userName}
          </span>
        </div>
      )}

      <button
        className="lg:hidden p-2 -mr-2 text-crema-text"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          {mobileOpen
            ? <path d="M6 6l12 12M6 18L18 6" />
            : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
          }
        </svg>
      </button>

      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 62,
            left: 0,
            right: 0,
            background: '#14442B',
            borderTop: '1px solid rgba(243,234,208,.1)',
            padding: 12,
            zIndex: 50,
          }}
          className="lg:hidden"
        >
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '10px 14px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: location.pathname === l.to ? '#F3EAD0' : 'rgba(243,234,208,.6)',
                borderRadius: 8,
                textDecoration: 'none',
              }}
              className="font-sans hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
          {userName && (
            <div className="flex items-center gap-[9px] px-[14px] py-[10px] text-crema-text/60 text-[12px] font-sans font-medium">
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#D9A441',
                  color: '#14442B',
                  fontWeight: 700,
                  fontSize: 11,
                }}
                className="flex items-center justify-center"
              >
                {initials}
              </span>
              {userName}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
