import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TrophyIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import useSessionStore from '../../store/sessionStore'
import useParticipantesStore from '../../store/participantesStore'
import Avatar from '../ui/Avatar'

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

  return (
    <nav className="bg-cesped text-crema">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display font-black text-xl tracking-wider shrink-0">
          <TrophyIcon className="w-6 h-6 text-ocre" />
          MUNDIAL 26
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 text-sm font-semibold tracking-wide transition-opacity ${
                location.pathname === l.to
                  ? 'border-b-3 border-crema'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {userName && (
            <div className="hidden sm:flex items-center gap-2">
              <Avatar name={userName} size="sm" />
              <span className="text-sm text-crema/80 font-medium">{userName}</span>
            </div>
          )}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-crema/10 px-4 py-3 space-y-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm font-semibold tracking-wide rounded-lg transition-colors ${
                location.pathname === l.to
                  ? 'bg-crema/10 text-crema'
                  : 'text-crema/60 hover:text-crema hover:bg-crema/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {userName && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-crema/60">
              <Avatar name={userName} size="sm" />
              {userName}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
