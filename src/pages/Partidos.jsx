import { useState } from 'react'
import useQuinielaStore from '../store/quinielaStore'
import { gruposLetras, getEquipo, getEquiposDelGrupo } from '../data/grupos'
import { transmision } from '../data/transmision'
import FlagIcon from '../components/ui/FlagIcon'
import Card from '../components/ui/Card'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getTeam(id) {
  if (!id) return null
  return getEquipo(id)
}

function parseDate(dateStr, timeStr) {
  if (!dateStr) return null
  const t = timeStr || '12:00'
  const d = new Date(dateStr + 'T' + t + ':00')
  return d
}

function formatDate(dateStr, timeStr) {
  const d = parseDate(dateStr, timeStr)
  if (!d) return ''
  return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  return `${h}:${m} hrs`
}

function getStatus(m) {
  if (m.actualizado) return { type: 'ft', label: 'Finalizado', color: 'text-green-400' }
  if (!m.date) return { type: 'ns', label: 'Programado', color: 'text-blue-400' }
  const now = new Date()
  const matchTime = parseDate(m.date, m.time)
  if (!matchTime) return { type: 'ns', label: 'Programado', color: 'text-blue-400' }
  const diffMin = (now - matchTime) / 60000
  if (diffMin < 0) return { type: 'ns', label: 'Programado', color: 'text-blue-400' }
  if (diffMin <= 135) return { type: 'live', label: 'EN VIVO', color: 'text-green-400' }
  return { type: 'pd', label: 'Pendiente', color: 'text-yellow-500' }
}

export default function Partidos() {
  const partidos = useQuinielaStore(s => s.partidos)
  const loaded = useQuinielaStore(s => s.loaded)
  const liveUpdating = useQuinielaStore(s => s.liveUpdating)
  const lastLiveUpdate = useQuinielaStore(s => s.lastLiveUpdate)
  const fetchLiveScores = useQuinielaStore(s => s.fetchLiveScores)

  const [activeTab, setActiveTab] = useState('live')
  const [activeGroup, setActiveGroup] = useState('A')
  const [filter, setFilter] = useState('all')

  const matches = partidos.map(p => {
    const tv = transmision[p.id] || {}
    return {
      ...p,
      stadium: tv.stadium || '',
      city: tv.city || '',
      time: tv.time || '',
      date: tv.date || p.fecha || '',
      freeTV: tv.freeTV || [],
    }
  })

  const isMexicoMatch = (m) => {
    const local = getTeam(m.local)
    const visita = getTeam(m.visita)
    return local?.nombre === 'México' || visita?.nombre === 'México'
  }

  const filteredMatches = matches.filter(m => {
    if (filter === 'freeTV') return m.freeTV.length > 0
    if (filter === 'mexico') return isMexicoMatch(m)
    return true
  })

  const today = todayStr()

  const liveMatches = filteredMatches.filter(m => getStatus(m).type === 'live')
  const todayMatches = filteredMatches.filter(m => m.date === today && !m.actualizado && getStatus(m).type !== 'live')
  const completedMatches = filteredMatches.filter(m => m.actualizado)
  const upcomingMatches = filteredMatches.filter(m => {
    const s = getStatus(m)
    return s.type === 'ns' && m.date > today
  })

  const groupMatches = (group) => matches.filter(m => m.grupo === group)

  if (!loaded) {
    return (
      <Card variant="light">
        <div className="text-center py-12 text-cesped/40">
          <div className="text-3xl mb-3">🏆</div>
          <p className="font-semibold">Cargando partidos...</p>
        </div>
      </Card>
    )
  }

  return (
    <div>
      {/* HEADER */}
      <div className="rounded-xl overflow-hidden mb-5 bg-gradient-to-r from-[#006847] via-[#008b5e] to-[#ce1126] shadow-lg">
        <div className="px-5 py-5 text-center">
          <div className="text-[10px] tracking-[0.3em] text-white/60 mb-1 uppercase font-bold">
            FIFA &bull; Copa Mundial
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Mundial 2026
          </h1>
          <p className="text-xs text-white/70 mt-1">
            México &bull; EE.UU. &bull; Canadá &nbsp;|&nbsp; 11 Jun – 19 Jul
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={fetchLiveScores}
              disabled={liveUpdating || !import.meta.env.VITE_ANTHROPIC_API_KEY}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white
                bg-white/20 border border-white/30 hover:bg-white/30 transition-colors
                disabled:opacity-50 disabled:cursor-wait"
            >
              <span className={`inline-block ${liveUpdating ? 'animate-spin' : ''}`}>⟳</span>
              {liveUpdating ? 'Actualizando...' : 'Actualizar marcadores'}
            </button>
            {lastLiveUpdate && (
              <span className="text-[10px] text-white/50">
                {lastLiveUpdate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
              <span className="text-[10px] text-white/40 italic">
                (admin ingresa resultados en Quiniela)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-0 border-b border-cesped/10 mb-4 overflow-x-auto">
        {[
          { key: 'all', label: '🌍 Todos' },
          { key: 'freeTV', label: '📺 TV Abierta MX' },
          { key: 'mexico', label: '🇲🇽 México' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors
              ${filter === f.key
                ? 'text-pasto border-pasto'
                : 'text-cesped/50 border-transparent hover:text-cesped/70'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-0 border-b border-cesped/10 mb-5 overflow-x-auto">
        {[
          { key: 'live', label: `🔴 En Vivo (${liveMatches.length})` },
          { key: 'today', label: `📅 Hoy (${todayMatches.length})` },
          { key: 'results', label: `✅ Resultados (${completedMatches.length})` },
          { key: 'upcoming', label: `🗓 Próximos` },
          { key: 'groups', label: `📊 Grupos` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors
              ${activeTab === tab.key
                ? 'text-ocre border-ocre'
                : 'text-cesped/50 border-transparent hover:text-cesped/70'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── EN VIVO ── */}
      {activeTab === 'live' && (
        <div>
          {liveMatches.length === 0 && todayMatches.length === 0 ? (
            <EmptyState icon="📡" title="No hay partidos en vivo"
              subtitle={completedMatches.length > 0 ? 'Revisa Resultados o Próximos' : 'El torneo comienza 11 de junio'} />
          ) : (
            <>
              {liveMatches.map(m => <MatchCard key={m.id} match={m} highlight />)}
              {todayMatches.length > 0 && (
                <>
                  <SectionTitle>📅 También hoy</SectionTitle>
                  {todayMatches.map(m => <MatchCard key={m.id} match={m} />)}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── HOY ── */}
      {activeTab === 'today' && (
        <div>
          {todayMatches.length === 0 && liveMatches.length === 0
            ? <EmptyState icon="📅" title="No hay partidos hoy" subtitle="Revisa Próximos o Resultados" />
            : [...liveMatches, ...todayMatches].map(m => <MatchCard key={m.id} match={m} />)
          }
        </div>
      )}

      {/* ── RESULTADOS ── */}
      {activeTab === 'results' && (
        <div>
          {completedMatches.length === 0
            ? <EmptyState icon="✅" title="Sin resultados aún" subtitle="El torneo comienza el 11 de junio" />
            : completedMatches.toReversed().map(m => <MatchCard key={m.id} match={m} />)
          }
        </div>
      )}

      {/* ── PRÓXIMOS ── */}
      {activeTab === 'upcoming' && (
        <div>
          {upcomingMatches.length === 0
            ? <EmptyState icon="🗓" title="No hay próximos partidos" subtitle="Revisa Resultados o Grupos" />
            : upcomingMatches.slice(0, 30).map(m => <MatchCard key={m.id} match={m} />)
          }
          {upcomingMatches.length > 30 && (
            <p className="text-center text-xs text-cesped/40 mt-3">
              Mostrando 30 de {upcomingMatches.length} partidos
            </p>
          )}
        </div>
      )}

      {/* ── GRUPOS ── */}
      {activeTab === 'groups' && (
        <div>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {gruposLetras.map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors
                  ${activeGroup === g
                    ? 'bg-ocre text-white'
                    : 'bg-cesped/5 text-cesped/60 hover:bg-cesped/10'}`}
              >
                Grupo {g}
              </button>
            ))}
          </div>

          <Card variant="light">
            <h3 className="text-xs font-bold tracking-[0.15em] text-cesped/50 uppercase mb-3">
              Grupo {activeGroup} — Equipos
            </h3>
            {getEquiposDelGrupo(activeGroup).map(eq => (
              <div key={eq.id}
                className="flex items-center gap-3 py-2 border-b border-cesped/5 last:border-0">
                <FlagIcon code={eq.id} size={18} />
                <span className="text-sm font-semibold text-tinta">{eq.nombre}</span>
              </div>
            ))}
          </Card>

          <div className="mt-5">
            <SectionTitle>Partidos del Grupo {activeGroup}</SectionTitle>
            {groupMatches(activeGroup).map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}

      {/* TV LEGEND */}
      <div className="mt-6">
        <TVLegend />
      </div>
    </div>
  )
}

// ─── Match Card ──────────────────────────────────────────────────────────────

function MatchCard({ match: m, highlight }) {
  const status = getStatus(m)
  const isLive = status.type === 'live'
  const isFT = status.type === 'ft'
  const local = getTeam(m.local)
  const visita = getTeam(m.visita)
  const isMx = local?.nombre === 'México' || visita?.nombre === 'México'

  const scoreDisplay = m.marcador_local !== null && m.marcador_visita !== null

  return (
    <div className={`rounded-xl mb-2.5 overflow-hidden border transition-colors
      ${highlight ? 'border-pasto/40 bg-gradient-to-r from-pasto/[0.07] to-transparent' : ''}
      ${!highlight && isLive ? 'border-pasto/30' : ''}
      ${!highlight && !isLive && m.freeTV.length > 0 ? 'border-ocre/20' : ''}
      ${!highlight && !isLive && m.freeTV.length === 0 ? 'border-cesped/8 bg-cesped/[0.02]' : 'bg-cesped/[0.02]'}
    `}>
      {/* Mexico top stripe */}
      {isMx && (
        <div className="h-[2px] bg-gradient-to-r from-[#006847] via-white to-[#ce1126]" />
      )}

      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded
              bg-ocre/15 text-ocre">
              {m.grupo ? `GRUPO ${m.grupo}` : m.fase?.toUpperCase()}
            </span>
            {isLive && (
              <span className="text-[10px] font-bold text-pasto animate-pulse">
                🔴 EN VIVO
              </span>
            )}
          </div>
          {m.freeTV.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded
              bg-ocre/15 text-ocre border border-ocre/30">
              📺 TV Abierta
            </span>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center gap-2">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5 mb-1">
              {local && <FlagIcon code={local.id} size={20} />}
            </div>
            <span className={`text-xs leading-tight block
              ${isFT && scoreDisplay && m.marcador_local > m.marcador_visita ? 'font-black text-tinta' : 'font-medium text-cesped/70'}`}>
              {local?.nombre || m.local || '—'}
            </span>
          </div>

          <div className="shrink-0 text-center min-w-[60px]">
            {isFT || scoreDisplay ? (
              <div className="text-xl font-black font-mono tracking-wider text-tinta tabular-nums">
                {m.marcador_local} – {m.marcador_visita}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-[10px] text-cesped/40">{formatDate(m.date, m.time)}</div>
                <div className="text-xs font-bold text-tinta">{formatTime(m.time)}</div>
              </div>
            )}
            {isFT && (
              <div className="text-[10px] text-cesped/40 mt-0.5 font-mono">FT</div>
            )}
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              {visita && <FlagIcon code={visita.id} size={20} />}
            </div>
            <span className={`text-xs leading-tight block
              ${isFT && scoreDisplay && m.marcador_visita > m.marcador_local ? 'font-black text-tinta' : 'font-medium text-cesped/70'}`}>
              {visita?.nombre || m.visita || '—'}
            </span>
          </div>
        </div>

        {/* Stadium row */}
        {m.stadium && (
          <div className="mt-2.5 pt-2 border-t border-cesped/5 flex items-center justify-between text-[11px] text-cesped/40">
            <span>🏟 {m.stadium}</span>
            <span>📍 {m.city}</span>
          </div>
        )}

        {/* Free TV channels */}
        {m.freeTV.length > 0 && (
          <div className="mt-1.5 flex gap-1.5 flex-wrap">
            {m.freeTV.map(ch => (
              <span key={ch}
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-ocre/10 text-ocre">
                {ch}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.15em] text-cesped/40 uppercase mb-2.5 mt-4">
      {children}
    </div>
  )
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-16 text-cesped/40">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-base font-bold text-cesped/60 mb-1">{title}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  )
}

function TVLegend() {
  return (
    <Card variant="light" className="border border-ocre/20">
      <div className="p-1">
        <h3 className="text-xs font-bold text-ocre mb-2.5">📺 Televisión Abierta en México</h3>
        <div className="text-xs text-cesped/60 leading-relaxed space-y-1">
          <p>• <strong className="text-tinta">32+ partidos gratis</strong> en TV abierta mexicana</p>
          <p>• <strong className="text-tinta">Azteca 7 / Azteca Uno</strong> — TV Azteca (todos los de México, semis y final)</p>
          <p>• <strong className="text-tinta">Canal 5 / Las Estrellas / Nu9ve</strong> — TelevisaUnivision (TUDN)</p>
          <p>• <strong className="text-tinta">VIX Premium</strong> — los 104 partidos completos</p>
          <p className="text-[11px] text-cesped/40 pt-1">Usa el filtro "📺 TV Abierta MX" para ver los partidos gratuitos</p>
        </div>
      </div>
    </Card>
  )
}
