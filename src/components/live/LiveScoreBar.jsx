import { Link } from 'react-router-dom'
import useQuinielaStore from '../../store/quinielaStore'
import { getEquipo } from '../../data/grupos'
import { transmision } from '../../data/transmision'
import FlagIcon from '../ui/FlagIcon'

function getTeam(id) {
  if (!id) return null
  return getEquipo(id)
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getStatus(m) {
  if (m.actualizado) return 'ft'
  if (m.live_status === 'live') return 'live'
  if (m.live_status === 'ft') return 'ft'
  if (m.live_status === 'ns') return 'ns'
  if (!m.date || !m.time) return 'ns'
  const now = new Date()
  const matchTime = new Date(m.date + 'T' + m.time + ':00')
  const diffMin = (now - matchTime) / 60000
  if (diffMin < 0) return 'ns'
  if (diffMin <= 135) return 'live'
  return 'pd'
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  return `${h}:${m}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export default function LiveScoreBar() {
  const partidos = useQuinielaStore(s => s.partidos)
  const loaded = useQuinielaStore(s => s.loaded)

  if (!loaded || partidos.length === 0) return null

  const matches = partidos.map(p => {
    const tv = transmision[p.id] || {}
    return { ...p, ...tv, freeTV: tv.freeTV || [], stadium: tv.stadium || '', city: tv.city || '', time: tv.time || '', date: tv.date || p.fecha || '' }
  })

  const today = todayStr()

  const live = matches.find(m => getStatus(m) === 'live')
  const todayM = matches.filter(m => m.date === today && !m.actualizado && getStatus(m) !== 'live')
  const upcoming = matches.find(m => {
    const s = getStatus(m)
    return s === 'ns' && m.date > today
  })

  if (live) return <LiveBar match={live} />
  if (todayM.length > 0) return <TodayBar matches={todayM} />
  if (upcoming) return <NextBar match={upcoming} />
  return null
}

function LiveBar({ match: m }) {
  const local = getTeam(m.local)
  const visita = getTeam(m.visita)

  return (
    <Link to="/partidos" className="no-underline block mb-4">
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(74,222,128,0.02))',
          border: '1px solid rgba(74,222,128,0.35)',
          borderRadius: 12,
          padding: '11px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          animation: 'lbPulse 2s ease-in-out infinite',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            fontWeight: 700,
            color: '#4ade80',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 12 }}>🔴</span>
          <span>EN VIVO</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {local && <FlagIcon code={local.id} size={18} />}
          <span style={{ fontSize: 13, fontWeight: 700, color: '#16271A', whiteSpace: 'nowrap' }}>
            {local?.nombre || '—'}
          </span>

          <span style={{
            fontSize: 15,
            fontWeight: 900,
            color: '#14442B',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 1,
            margin: '0 2px',
          }}>
            {m.marcador_local !== null && m.marcador_visita !== null
              ? `${m.marcador_local} – ${m.marcador_visita}`
              : 'vs'}
          </span>

          <span style={{ fontSize: 13, fontWeight: 700, color: '#16271A', whiteSpace: 'nowrap' }}>
            {visita?.nombre || '—'}
          </span>
          {visita && <FlagIcon code={visita.id} size={18} />}
        </div>

        {m.stadium && (
          <span style={{ fontSize: 11, color: 'rgba(22,39,26,0.5)', display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>
            🏟 {m.stadium}
          </span>
        )}

        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(22,39,26,0.3)" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <style>{`
        @keyframes lbPulse { 0%,100% { opacity: 1 } 50% { opacity: 0.85 } }
      `}</style>
    </Link>
  )
}

function TodayBar({ matches }) {
  return (
    <Link to="/partidos" className="no-underline block mb-4">
      <div
        style={{
          background: 'rgba(30,107,67,0.04)',
          border: '1px solid rgba(30,107,67,0.18)',
          borderRadius: 12,
          padding: '10px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>📅</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#1E6B43',
            textTransform: 'uppercase',
          }}>
            Hoy · {matches.length} partido{matches.length !== 1 ? 's' : ''}
          </span>
        </div>
        {matches.slice(0, 3).map(m => {
          const local = getTeam(m.local)
          const visita = getTeam(m.visita)
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: 12 }}>
              {local && <FlagIcon code={local.id} size={14} />}
              <span style={{ fontWeight: 600, color: '#16271A' }}>{local?.nombre || '—'}</span>
              <span style={{ fontSize: 11, color: 'rgba(22,39,26,0.35)', fontWeight: 600 }}>vs</span>
              <span style={{ fontWeight: 600, color: '#16271A', marginRight: 'auto' }}>{visita?.nombre || '—'}</span>
              {visita && <FlagIcon code={visita.id} size={14} />}
              <span style={{ fontWeight: 700, color: '#1E6B43', fontSize: 11 }}>{formatTime(m.time)}</span>
              {m.freeTV.length > 0 && (
                <span style={{ fontSize: 10, color: '#D9A441', fontWeight: 700 }}>📺</span>
              )}
            </div>
          )
        })}
        {matches.length > 3 && (
          <div style={{ fontSize: 10, color: 'rgba(22,39,26,0.4)', marginTop: 2 }}>
            +{matches.length - 3} más
          </div>
        )}
      </div>
    </Link>
  )
}

function NextBar({ match: m }) {
  const local = getTeam(m.local)
  const visita = getTeam(m.visita)

  return (
    <Link to="/partidos" className="no-underline block mb-4">
      <div
        style={{
          background: 'rgba(20,68,43,0.04)',
          border: '1px solid rgba(20,68,43,0.15)',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#14442B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          🗓 {formatDate(m.date)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          {local && <FlagIcon code={local.id} size={16} />}
          <span style={{ fontSize: 12, fontWeight: 600, color: '#16271A' }}>{local?.nombre || '—'}</span>
          <span style={{ fontSize: 11, color: 'rgba(22,39,26,0.35)' }}>vs</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#16271A' }}>{visita?.nombre || '—'}</span>
          {visita && <FlagIcon code={visita.id} size={16} />}
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#1E6B43', fontSize: 11 }}>{formatTime(m.time)}</span>
          {m.freeTV?.length > 0 && (
            <span style={{ fontSize: 10, color: '#D9A441', fontWeight: 700 }}>📺</span>
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(22,39,26,0.3)" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  )
}
