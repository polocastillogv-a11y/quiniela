import { useState } from 'react'
import { Link } from 'react-router-dom'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import useSorteoStore from '../store/sorteoStore'
import useSessionStore from '../store/sessionStore'
import { fases, jornadas } from '../data/partidos'
import { getEquipo as getEquipoData } from '../data/grupos'
import Card from '../components/ui/Card'
import FlagIcon from '../components/ui/FlagIcon'

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

  const [faseActiva, setFaseActiva] = useState('grupos')
  const [jornadaActiva, setJornadaActiva] = useState(1)
  const [tokenInput, setTokenInput] = useState('')
  const [errorLogin, setErrorLogin] = useState('')

  const eqParticipante = sesion.tipo === 'participante' ? getEquipos(sesion.participanteId) : []

  const partidosFase = partidos.filter(p => {
    if (p.fase !== faseActiva) return false
    if (sesion.tipo === 'participante' && eqParticipante.length > 0) {
      return eqParticipante.includes(p.local) || eqParticipante.includes(p.visita)
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
    setErrorLogin('Token inválido')
  }

  const sinSorteo = sesion.tipo === 'participante' && eqParticipante.length === 0 && !sorteado

  if (!sesion.tipo) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📋</div>
            <h1 className="text-2xl font-bold text-gray-800">Quiniela</h1>
            <p className="text-sm text-gray-500 mt-1">Ingresa tu token para acceder</p>
          </div>
          <div className="space-y-4">
            {errorLogin && <p className="text-red-500 text-xs text-center">{errorLogin}</p>}
            <input type="text" value={tokenInput} onChange={e => { setTokenInput(e.target.value); setErrorLogin('') }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tu token" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button onClick={handleLogin} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Entrar
            </button>
            <p className="text-xs text-gray-400 text-center">
              ¿No tienes token? <Link to="/participantes" className="text-indigo-600 hover:underline">Regístrate aquí</Link>
            </p>
          </div>
        </Card>
      </div>
    )
  }

  if (!loaded) {
    return <Card><div className="text-center py-8 text-gray-400"><p>Cargando datos...</p></div></Card>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quiniela</h1>
          <p className="text-sm text-gray-500">
            {sesion.tipo === 'admin' ? '👑 Administrador — ingresa resultados' : `🎯 ${participantes.find(p => p.id === sesion.participanteId)?.nombre || 'Participante'} — ${faseActiva === 'grupos' ? 'toca el escudo o "Empate"' : 'toca el escudo del que avanza'}`}
          </p>
        </div>
      </div>

      {sinSorteo && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <div className="text-center py-4">
            <p className="text-yellow-800 font-medium">⏳ El administrador aún no realiza el sorteo de equipos</p>
            <p className="text-yellow-600 text-sm">Una vez sorteado, verás aquí solo los partidos de tus equipos</p>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-wrap">
        {fases.map(f => (
          <button key={f.id}
            onClick={() => { setFaseActiva(f.id); setJornadaActiva(1) }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${faseActiva === f.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {f.nombre} <span className="text-xs opacity-75">(x{f.mult})</span>
          </button>
        ))}
      </div>

      {faseActiva === 'grupos' && (
        <div className="flex gap-2 mb-4">
          {jornadas.map(j => (
            <button key={j.id}
              onClick={() => setJornadaActiva(j.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${jornadaActiva === j.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {j.nombre} ({j.dias})
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([grupo, pjs]) => (
          <div key={grupo}>
            {faseActiva === 'grupos' && (
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                Grupo {grupo}
                <span className="text-xs font-normal text-gray-400">
                  {pjs[0]?.fecha ? formatDate(pjs[0].fecha) : ''}
                  {pjs[1]?.fecha && pjs[0]?.fecha !== pjs[1]?.fecha ? ` - ${formatDate(pjs[1].fecha)}` : ''}
                </span>
              </h3>
            )}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium pr-4">#</th>
                      {faseActiva === 'grupos' && <th className="pb-3 font-medium pr-4">Fecha</th>}
                      <th className="pb-3 font-medium pr-4">Local</th>
                      <th className="pb-3 font-medium pr-4 text-center">Resultado</th>
                      <th className="pb-3 font-medium pr-4">Visita</th>
                      {sesion.tipo === 'participante' && <th className="pb-3 font-medium text-center">Tu pronóstico</th>}
                      <th className="pb-3 font-medium text-center">Estado</th>
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
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pronósticos de Participantes</h2>
          <div className="space-y-4">
            {participantes.filter(p => p.activo !== false).map(participante => {
              const preds = predicciones[participante.id] || {}
              const eqt = getEquipos(participante.id)
              const misPartidos = eqt.length > 0 ? partidos.filter(p => eqt.includes(p.local) || eqt.includes(p.visita)) : partidos
              const total = misPartidos.filter(p => p.actualizado).length
              const hechos = Object.keys(preds).filter(k => misPartidos.find(p => p.id === k)?.actualizado).length
              return (
                <Card key={participante.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">{participante.nombre}</span>
                    <span className="text-sm text-gray-500">{hechos}/{total} pronosticados</span>
                  </div>
                  {eqt.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {eqt.map(eqId => <FlagIcon key={eqId} code={eqId} size={12} />)}
                      <span className="text-xs text-gray-400 ml-1">{eqt.length} equipos</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {misPartidos.filter(p => p.fase === faseActiva && (faseActiva !== 'grupos' || p.jornada === jornadaActiva)).filter(p => preds[p.id]).map(p => {
                      const v = preds[p.id]
                      return (
                        <span key={p.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          p.actualizado
                            ? ((p.marcador_local > p.marcador_visita && v === '1') || (p.marcador_visita > p.marcador_local && v === '2') || (p.marcador_local === p.marcador_visita && v === 'X')
                              ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {v === '1' ? <FlagIcon code={p.local} size={12} /> : v === '2' ? <FlagIcon code={p.visita} size={12} /> : <span>✕</span>}
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

function FilaAdmin({ partido: p, index, actualizarResultado, mostrarFecha }) {
  const [local, setLocal] = useState(p.marcador_local ?? '')
  const [visita, setVisita] = useState(p.marcador_visita ?? '')

  const guardar = () => actualizarResultado(p.id, local === '' ? null : Number(local), visita === '' ? null : Number(visita))

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 pr-4 text-gray-500">{index + 1}</td>
      {mostrarFecha && <td className="py-3 pr-4 text-xs text-gray-400">{p.fecha || '-'}</td>}
      <td className="py-3 pr-4 font-medium"><span className="inline-flex items-center gap-1.5">{p.local && <FlagIcon code={p.local} size={14} />}{nEq(p.local)?.nombre || p.local || '—'}</span></td>
      <td className="py-3 pr-4 text-center">
        <span className="inline-flex items-center gap-1">
          <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm" value={local} onChange={e => setLocal(e.target.value)} onBlur={guardar} min="0" />
          <span className="text-gray-400">-</span>
          <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm" value={visita} onChange={e => setVisita(e.target.value)} onBlur={guardar} min="0" />
        </span>
      </td>
      <td className="py-3 pr-4 font-medium"><span className="inline-flex items-center gap-1.5">{p.visita && <FlagIcon code={p.visita} size={14} />}{nEq(p.visita)?.nombre || p.visita || '—'}</span></td>
      <td className="py-3 text-center">{p.actualizado ? <span className="text-green-600 text-xs font-medium">✅ Jugado</span> : <span className="text-gray-400 text-xs">⏳ {p.fecha || 'Pendiente'}</span>}</td>
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
  const eqLocal = p.local ? nEq(p.local) : null
  const eqVisita = p.visita ? nEq(p.visita) : null

  return (
    <tr className={`border-b last:border-0 hover:bg-gray-50 ${p.actualizado && valor ? (acierto ? 'bg-green-50' : 'bg-red-50') : ''}`}>
      <td className="py-3 pr-4 text-gray-500">{index + 1}</td>
      {mostrarFecha && <td className="py-3 pr-4 text-xs text-gray-400">{p.fecha || '-'}</td>}
      <td className="py-3 pr-4">
        <span className="inline-flex items-center gap-1.5">
          {p.local && <FlagIcon code={p.local} size={14} />}
          {eqLocal?.nombre || p.local || '—'}
        </span>
      </td>
      <td className="py-3 pr-4 text-center font-bold">
        {p.actualizado ? `${p.marcador_local} - ${p.marcador_visita}` : <span className="text-gray-300">? - ?</span>}
      </td>
      <td className="py-3 pr-4">
        <span className="inline-flex items-center gap-1.5">
          {p.visita && <FlagIcon code={p.visita} size={14} />}
          {eqVisita?.nombre || p.visita || '—'}
        </span>
      </td>
      <td className="py-3 text-center">
        {p.local && p.visita ? (
          esGrupos ? (
            <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden text-xs">
              <button onClick={() => setPrediccion(participanteId, p.id, valor === '1' ? null : '1')}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-r border-gray-300 transition-colors ${valor === '1' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FlagIcon code={p.local} size={12} /> {eqLocal?.nombre || 'Local'}
              </button>
              <button onClick={() => setPrediccion(participanteId, p.id, valor === 'X' ? null : 'X')}
                className={`px-2.5 py-1.5 border-r border-gray-300 font-semibold transition-colors ${valor === 'X' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                Empate
              </button>
              <button onClick={() => setPrediccion(participanteId, p.id, valor === '2' ? null : '2')}
                className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${valor === '2' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FlagIcon code={p.visita} size={12} /> {eqVisita?.nombre || 'Visitante'}
              </button>
            </div>
          ) : (
            <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden text-xs">
              <button onClick={() => setPrediccion(participanteId, p.id, valor === '1' ? null : '1')}
                className={`flex items-center gap-1 px-2.5 py-1.5 border-r border-gray-300 transition-colors ${valor === '1' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FlagIcon code={p.local} size={12} /> {eqLocal?.nombre || 'Local'}
              </button>
              <button onClick={() => setPrediccion(participanteId, p.id, valor === '2' ? null : '2')}
                className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors ${valor === '2' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <FlagIcon code={p.visita} size={12} /> {eqVisita?.nombre || 'Visitante'}
              </button>
            </div>
          )
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>
      <td className="py-3 text-center">
        {p.actualizado ? <span className="text-green-600 text-xs font-medium">✅ Jugado</span> : <span className="text-gray-400 text-xs">⏳ {p.fecha || 'Pendiente'}</span>}
        {p.actualizado && valor && <span className={`ml-1 text-sm ${acierto ? 'text-green-600' : 'text-red-400'}`}>{acierto ? '✅' : '❌'}</span>}
      </td>
    </tr>
  )
}
