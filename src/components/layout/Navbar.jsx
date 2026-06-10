import { Link, useLocation } from 'react-router-dom'
import useParticipantesStore from '../../store/participantesStore'

export default function Navbar() {
  const location = useLocation()
  const sesion = useParticipantesStore(s => s.sesion)
  const participantes = useParticipantesStore(s => s.participantes)

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/participantes', label: 'Participantes', icon: '👥' },
    { to: '/quiniela', label: 'Quiniela', icon: '📋' },
    { to: '/bolsa', label: 'Bolsa', icon: '💰' },
    { to: '/bracket', label: 'Bracket', icon: '🏆' },
    { to: '/resultados', label: 'Resultados', icon: '📈' },
  ]

  const userLabel = sesion.tipo === 'admin' ? '👑 Admin'
    : sesion.participanteId ? `🎯 ${participantes.find(p => p.id === sesion.participanteId)?.nombre || ''}`
    : null

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span>🏆</span>
            <span>Mundial 2026</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? 'bg-indigo-500 text-white'
                      : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  <span className="mr-1">{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>
            {userLabel && (
              <span className="text-xs text-indigo-200 hidden lg:inline">{userLabel}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
