import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import useSorteoStore from '../store/sorteoStore'
import useSessionStore from '../store/sessionStore'
import { fases, jornadas } from '../data/partidos'
import { getEquipo as getEquipoData } from '../data/grupos'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import FlagIcon from '../components/ui/FlagIcon'
import Avatar from '../components/ui/Avatar'

const nEq = (id) => getEquipoData(id)

function formatDate(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Quiniela() {
  const sesion = useSessionStore(s => s)
  const loginParticipante = useSessionStore(s => s.loginParticipante)
  const loginAdmin = useSessionStore(s => s.loginAdmin)
  const participantes = useParticipantesStore(s => s.participantes)
  const getByToken = useParticipantesStore(s => s.getByToken)
  const partidos = useQuinielaStore(s => s.partidos)
  const loaded = useQuinielaStore(s => s.loaded)
  const actualizarResultado = useQuinielaStore(s => s.actualizarResultado)
  const setPrediccion = useQuinielaStore(s => s.setPrediccion)
  const getPrediccion = useQuinielaStore(s => s.getPrediccion)
  const predicciones = useQuinielaStore(s => s.predicciones)
  const getEquipos = useSorteoStore(s => s.getEquipos)
  const sorteado = useSorteoStore(s => s.sorteado)
  const sorteoLoaded = useSorteoStore(s => s.loaded)

  const [faseActiva, setFaseActiva] = useState('grupos')
  const [jornadaActiva, setJornadaActiva] = useState(1)
  const [tokenInput, setTokenInput] = useState('')
  const [errorLogin, setErrorLogin] = useState('')

  const eqParticipante = sesion.tipo === 'participante' && sorteoLoaded ? getEquipos(sesion.participanteId) : []

  const partidosFase = partidos.filter(p => {
    if (p.fase !== faseActiva) return false
    if (sesion.tipo === 'participante') {
      if (!sorteoLoaded) return false
      if (p.fase !== 'grupos') return true
      return eqParticipante.length === 0 || eqParticipante.includes(p.local) || eqParticipante.includes(p.visita)
    }
    return true
  })
  const grupos = [...new Set(partidosFase.filter(p => p.grupo).map(p => p.grupo))]

  const partidosJornada = faseActiva === 'grupos'
    ? partidosFase.filter(p => p.jornada === jornadaActiva)
    : partidosFase

  const grouped = faseActiva === 'grupos'
    ? grupos.reduce((acc, g) => {
        const pjs = partidosJornada.filter(p => p.grupo === g)
        if (pjs.length > 0) acc[g] = pjs
        return acc
      }, {})
    : { '_': partidosFase }

  const handleLogin = () => {
    const t = tokenInput.trim()
    if (!t) return
    if (t === 'admin2026') { loginAdmin(); setTokenInput(''); setErrorLogin(''); return }
    const p = getByToken(t)
    if (p) { loginParticipante(p.id, t); setTokenInput(''); setErrorLogin(''); return }
    setErrorLogin('Token invalido')
  }

  const sinSorteo = sesion.tipo === 'participante' && eqParticipante.length === 0 && !sorteado

  if (!sesion.tipo) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card variant="light">
          <div className="text-center mb-6">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-cesped/20" />
            <h1 className="text-2xl font-display font-black text-cesped">Quiniela</h1>
            <p className="text-sm text-cesped/60 mt-1">Ingresa tu token para acceder</p>
          </div>
          <div className="space-y-4">
            {errorLogin && <p className="text-tinto text-xs text-center">{errorLogin}</p>}
            <Input type="text" value={tokenInput} onChange={e => { setTokenInput(e.target.value); setErrorLogin('') }}
              placeholder="Tu token" className="text-center text-lg" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <Button variant="primary" size="lg" className="w-full" onClick={handleLogin}>
              Entrar
            </Button>
            <p className="text-xs text-cesped/40 text-center">
              No tienes token? <Link to="/participantes" className="text-ocre hover:underline font-semibold">Registrate aqui</Link>
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (!loaded) {
    return <Card variant="light"><div className="text-center py-8 text-cesped/30"><p>Cargando datos...</p></div></Card>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-display font-black text-cesped tracking-tight">Quiniela</h1>
          <p className="text-sm text-cesped/60">
            {sesion.tipo === 'admin'
              ? 'Administrador — ingresa resultados'
              : `${participantes.find(p => p.id === sesion.participanteId)?.nombre || 'Participante'} — ${faseActiva === 'grupos' ? 'toca el escudo o "Empate"' : 'toca el escudo del que avanza'}`}
          </p>
        </div>
      </div>

      {sinSorteo && (
        <Card className="mb-6 border border-tinto/20 bg-tinto/5" variant="crema">
          <div className="text-center py-4">
            <p className="text-tinto font-semibold">El administrador aun no realiza el sorteo de equipos</p>
            <p className="text-tinto/60 text-sm">Una vez sorteado, veras aqui solo los partidos de tus equipos</p>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-wrap">
        {fases.map(f => (
          <button key={f.id}
            onClick={() => { setFaseActiva(f.id); setJornadaActiva(1) }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold tracking-wide transition-colors ${faseActiva === f.id ? 'bg-ocre text-white' : 'bg-cesped/5 text-cesped/60 hover:bg-cesped/10 hover:text-cesped'}`}
          >
            {f.nombre} <span className="text-xs opacity-60 font-mono">{f.mult === 1 ? '(1 pts)' : `(${Math.round(1 * f.mult)} pts)`}</span>
          </button>
        ))}
        {sesion.tipo === 'admin' && faseActiva === 'r32' && (
          <GenerarR32Btn />
        )}
      </div>

      {faseActiva === 'grupos' && (
        <div className="flex gap-2 mb-4">
          {jornadas.map(j => (
            <button key={j.id}
              onClick={() => setJornadaActiva(j.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-colors ${jornadaActiva === j.id ? 'bg-cesped text-crema' : 'bg-cesped/5 text-cesped/60 hover:bg-cesped/10'}`}
            >
              {j.nombre} <span className="font-mono">({j.dias})</span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cesped/70 bg-cesped/5 px-4 py-2 rounded-full">
          Cada pronóstico acertado en esta fase vale <span className="text-ocre font-black font-mono">{Math.round(1 * (fases.find(f => f.id === faseActiva)?.mult || 1))}</span> puntos
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([grupo, pjs]) => (
          <div key={grupo}>
            {faseActiva === 'grupos' && (
              <h3 className="text-xs font-bold tracking-[0.15em] text-cesped/40 uppercase mb-2 flex items-center gap-2">
                Grupo {grupo}
                <span className="text-xs font-normal text-cesped/30 font-mono">
                  {pjs[0]?.fecha ? formatDate(pjs[0].fecha) : ''}
                  {pjs[1]?.fecha && pjs[0]?.fecha !== pjs[1]?.fecha ? ` - ${formatDate(pjs[1].fecha)}` : ''}
                </span>
              </h3>
            )}
            <Card variant="light">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-cesped/50 border-b border-cesped/10">
                      <th className="pb-3 font-semibold pr-4">#</th>
                      {faseActiva === 'grupos' && <th className="pb-3 font-semibold pr-4">Fecha</th>}
                      <th className="pb-3 font-semibold pr-4">Local</th>
                      <th className="pb-3 font-semibold pr-4 text-center">Resultado</th>
                      <th className="pb-3 font-semibold pr-4">Visita</th>
                      {sesion.tipo === 'participante' && <th className="pb-3 font-semibold text-center">Tu pronostico</th>}
                      <th className="pb-3 font-semibold text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pjs.map((p, i) => (
                      sesion.tipo === 'admin' ? (
                        <FilaAdmin key={p.id} partido={p} index={i} actualizarResultado={actualizarResultado} mostrarFecha={faseActiva === 'grupos'} />
                      ) : (
                        <FilaParticipante key={p.id} partido={p} index={i} participanteId={sesion.participanteId}
                          getPrediccion={getPrediccion} setPrediccion={setPrediccion} mostrarFecha={faseActiva === 'grupos'} />
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {sesion.tipo === 'admin' && (
        <div className="mt-10">
          <h2 className="text-xl font-display font-black text-cesped mb-4">Pronosticos de Participantes</h2>
          <div className="space-y-4">
            {participantes.filter(p => p.activo !== false && predicciones[p.id] && Object.keys(predicciones[p.id]).length > 0).map(participante => {
              const preds = predicciones[participante.id] || {}
              const eqt = getEquipos(participante.id)
              const misPartidos = eqt.length > 0 ? partidos.filter(p => eqt.includes(p.local) || eqt.includes(p.visita)) : partidos
              const total = misPartidos.filter(p => p.actualizado).length
              const hechos = Object.keys(preds).filter(k => misPartidos.find(p => p.id === k)?.actualizado).length
              return (
                <Card key={participante.id} variant="light">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Avatar name={participante.nombre} size="sm" />
                      <span className="font-bold text-tinta">{participante.nombre}</span>
                    </div>
                    <span className="text-sm text-cesped/50 font-mono">{hechos}/{total} pronosticados</span>
                  </div>
                  {eqt.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {eqt.map(eqId => <FlagIcon key={eqId} code={eqId} size={12} />)}
                      <span className="text-xs text-cesped/40 ml-1">{eqt.length} equipos</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {misPartidos.filter(p => p.fase === faseActiva && (faseActiva !== 'grupos' || p.jornada === jornadaActiva)).filter(p => preds[p.id]).map(p => {
                      const v = preds[p.id]
                      return (
                        <span key={p.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          p.actualizado
                            ? ((p.marcador_local > p.marcador_visita && v === '1') || (p.marcador_visita > p.marcador_local && v === '2') || (p.marcador_local === p.marcador_visita && v === 'X')
                              ? 'bg-pasto/10 text-pasto' : 'bg-tinto/10 text-tinto')
                            : 'bg-cesped/5 text-cesped/60'
                        }`}>
                          {v === '1' ? <FlagIcon code={p.local} size={12} /> : v === '2' ? <FlagIcon code={p.visita} size={12} /> : <span className="font-mono">X</span>}
                        </span>
                      )
                    })}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function GenerarR32Btn() {
  const generarR32 = useQuinielaStore(s => s.generarR32)
  const partidos = useQuinielaStore(s => s.partidos)
  const [loading, setLoading] = useState(false)
  const r32listos = partidos.filter(p => p.id.startsWith('r32-') && p.local && p.visita).length

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await generarR32()
      if (res.length > 0) alert(`Ronda de 32 generada con ${res.length} partidos`)
    } catch (e) {
      alert('Error al generar: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading}
      className={`ml-auto px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-colors
        ${r32listos > 0 ? 'bg-pasto/20 text-pasto border border-pasto/30' : 'bg-tinto/10 text-tinto border border-tinto/30'}
        hover:opacity-80 disabled:opacity-50 disabled:cursor-wait`}
    >
      {loading ? 'Generando...' : r32listos > 0 ? `Volver a generar R32 (${r32listos}/16)` : 'Generar Ronda de 32'}
    </button>
  )
}

function FilaAdmin({ partido: p, index, actualizarResultado, mostrarFecha }) {
  const [local, setLocal] = useState(p.marcador_local ?? '')
  const [visita, setVisita] = useState(p.marcador_visita ?? '')
  const [penalLocal, setPenalLocal] = useState(p.penal_local ?? '')
  const [penalVisita, setPenalVisita] = useState(p.penal_visita ?? '')
  const esKnockout = p.fase !== 'grupos'

  const guardar = () => actualizarResultado(p.id, local === '' ? null : Number(local), visita === '' ? null : Number(visita), penalLocal === '' ? null : Number(penalLocal), penalVisita === '' ? null : Number(penalVisita))

  return (
    <tr className="border-b border-cesped/5 last:border-0 hover:bg-cesped/[0.02]">
      <td className="py-3 pr-4 text-cesped/40 font-mono text-xs">{index + 1}</td>
      {mostrarFecha && <td className="py-3 pr-4 text-xs text-cesped/50 font-mono">{p.fecha || '—'}</td>}
      <td className="py-3 pr-4 font-semibold text-tinta"><span className="inline-flex items-center gap-1.5">{p.local && <FlagIcon code={p.local} size={14} />}{nEq(p.local)?.nombre || p.local || '—'}</span></td>
      <td className="py-3 pr-4 text-center">
        <span className="inline-flex items-center gap-1">
          <input type="number" className="w-12 px-2 py-1 bg-crema border border-cesped/30 rounded text-center text-sm font-mono text-cesped focus:outline-none focus:ring-2 focus:ring-ocre/40" value={local} onChange={e => setLocal(e.target.value)} onBlur={guardar} min="0" />
          <span className="text-cesped/30 font-bold">-</span>
          <input type="number" className="w-12 px-2 py-1 bg-crema border border-cesped/30 rounded text-center text-sm font-mono text-cesped focus:outline-none focus:ring-2 focus:ring-ocre/40" value={visita} onChange={e => setVisita(e.target.value)} onBlur={guardar} min="0" />
          {esKnockout && (
            <span className="ml-2 text-xs text-cesped/40">
              <span className="font-mono">PEN</span>
              <input type="number" className="w-10 px-1 py-1 ml-1 bg-tinto/5 border border-cesped/20 rounded text-center text-xs font-mono text-cesped focus:outline-none focus:ring-2 focus:ring-ocre/40" value={penalLocal} onChange={e => setPenalLocal(e.target.value)} onBlur={guardar} min="0" />
              <span className="mx-0.5 text-cesped/20">-</span>
              <input type="number" className="w-10 px-1 py-1 bg-tinto/5 border border-cesped/20 rounded text-center text-xs font-mono text-cesped focus:outline-none focus:ring-2 focus:ring-ocre/40" value={penalVisita} onChange={e => setPenalVisita(e.target.value)} onBlur={guardar} min="0" />
            </span>
          )}
        </span>
      </td>
      <td className="py-3 pr-4 font-semibold text-tinta"><span className="inline-flex items-center gap-1.5">{p.visita && <FlagIcon code={p.visita} size={14} />}{nEq(p.visita)?.nombre || p.visita || '—'}</span></td>
      <td className="py-3 text-center">{p.actualizado ? <span className="inline-flex items-center gap-1 text-xs text-pasto font-semibold"><CheckCircleIcon className="w-3.5 h-3.5" /> Jugado</span> : <span className="inline-flex items-center gap-1 text-xs text-cesped/40 font-semibold"><ClockIcon className="w-3.5 h-3.5" /> {p.fecha || 'Pendiente'}</span>}</td>
    </tr>
  )
}

function FilaParticipante({ partido: p, index, participanteId, getPrediccion, setPrediccion, mostrarFecha }) {
  const valor = getPrediccion(participanteId, p.id)
  const esGrupos = p.fase === 'grupos'

  const realLabel = p.actualizado
    ? (p.marcador_local > p.marcador_visita ? '1' : p.marcador_visita > p.marcador_local ? '2' : 'X')
    : null

  const acierto = realLabel && valor === realLabel
  const hoy = new Date()
  const fechaHora = p.fecha && p.hora ? new Date(p.fecha + 'T' + p.hora) : null
  const empezado = fechaHora ? fechaHora <= hoy : (p.fecha ? new Date(p.fecha + 'T23:59') <= hoy : false)
  const bloqueado = valor !== null || empezado || p.actualizado || p.live_status === 'live'
  const eqLocal = p.local ? nEq(p.local) : null
  const eqVisita = p.visita ? nEq(p.visita) : null

  return (
    <tr className={`border-b border-cesped/5 last:border-0 hover:bg-cesped/[0.02] ${p.actualizado && valor ? (acierto ? 'bg-pasto/[0.03]' : 'bg-tinto/[0.03]') : ''}`}>
      <td className="py-3 pr-4 text-cesped/40 font-mono text-xs">{index + 1}</td>
      {mostrarFecha && <td className="py-3 pr-4 text-xs text-cesped/50 font-mono">{p.fecha || '—'}</td>}
      <td className="py-3 pr-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta">
          {p.local && <FlagIcon code={p.local} size={14} />}
          {eqLocal?.nombre || p.local || '—'}
        </span>
      </td>
      <td className="py-3 pr-4 text-center font-display font-bold text-cesped">
        {p.actualizado ? `${p.marcador_local} - ${p.marcador_visita}` : <span className="text-cesped/20">? - ?</span>}
      </td>
      <td className="py-3 pr-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-tinta">
          {p.visita && <FlagIcon code={p.visita} size={14} />}
          {eqVisita?.nombre || p.visita || '—'}
        </span>
      </td>
      <td className="py-3 text-center">
        {p.local && p.visita ? (
          esGrupos ? (
            <div className="inline-flex border border-cesped/20 rounded-lg overflow-hidden text-xs">
              <button disabled={bloqueado} onClick={() => setPrediccion(participanteId, p.id, valor === '1' ? null : '1')}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-r border-cesped/10 transition-colors font-semibold ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cesped/5'} ${valor === '1' ? 'bg-ocre text-white' : 'text-cesped/70'}`}>
                <FlagIcon code={p.local} size={12} /> {eqLocal?.nombre || 'Local'}
              </button>
              <button disabled={bloqueado} onClick={() => setPrediccion(participanteId, p.id, valor === 'X' ? null : 'X')}
                className={`px-3 py-1.5 border-r border-cesped/10 transition-colors font-bold tracking-wider ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cesped/5'} ${valor === 'X' ? 'bg-ocre text-white' : 'text-cesped/50'}`}>
                X
              </button>
              <button disabled={bloqueado} onClick={() => setPrediccion(participanteId, p.id, valor === '2' ? null : '2')}
                className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors font-semibold ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cesped/5'} ${valor === '2' ? 'bg-ocre text-white' : 'text-cesped/70'}`}>
                <FlagIcon code={p.visita} size={12} /> {eqVisita?.nombre || 'Visitante'}
              </button>
            </div>
          ) : (
            <div className="inline-flex border border-cesped/20 rounded-lg overflow-hidden text-xs">
              <button disabled={bloqueado} onClick={() => setPrediccion(participanteId, p.id, valor === '1' ? null : '1')}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-r border-cesped/10 transition-colors font-semibold ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cesped/5'} ${valor === '1' ? 'bg-ocre text-white' : 'text-cesped/70'}`}>
                <FlagIcon code={p.local} size={12} /> {eqLocal?.nombre || 'Local'}
              </button>
              <button disabled={bloqueado} onClick={() => setPrediccion(participanteId, p.id, valor === '2' ? null : '2')}
                className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors font-semibold ${bloqueado ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cesped/5'} ${valor === '2' ? 'bg-ocre text-white' : 'text-cesped/70'}`}>
                <FlagIcon code={p.visita} size={12} /> {eqVisita?.nombre || 'Visitante'}
              </button>
            </div>
          )
        ) : (
          <span className="text-cesped/30 font-mono text-xs">—</span>
        )}
        {p.actualizado && (
          <span className={`ml-2 inline-flex items-center ${acierto ? 'text-pasto' : 'text-tinto/50'}`}>
            {acierto ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <XCircleIcon className="w-3.5 h-3.5" />}
          </span>
        )}

      </td>
    </tr>
  )
}
