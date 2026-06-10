import { useState } from 'react'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
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
  const participantes = useParticipantesStore(s => s.participantes)
  const partidos = useQuinielaStore(s => s.partidos)
  const actualizarResultado = useQuinielaStore(s => s.actualizarResultado)
  const guardarPronostico = useQuinielaStore(s => s.guardarPronostico)
  const getPronostico = useQuinielaStore(s => s.getPronostico)

  const [faseActiva, setFaseActiva] = useState('grupos')
  const [jornadaActiva, setJornadaActiva] = useState(1)
  const [participanteActivo, setParticipanteActivo] = useState(null)
  const [editResultados, setEditResultados] = useState(false)

  const partidosFase = partidos.filter(p => p.fase === faseActiva)
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quiniela</h1>
        <button
          onClick={() => setEditResultados(!editResultados)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            editResultados ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {editResultados ? '✏️ Editando Resultados' : '🔒 Ver Resultados'}
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-wrap">
        {fases.map(f => (
          <button
            key={f.id}
            onClick={() => { setFaseActiva(f.id); setJornadaActiva(1) }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              faseActiva === f.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.nombre}
            {f.id === 'grupos' && <span className="ml-1 text-xs opacity-75">(x{f.mult})</span>}
            {f.id !== 'grupos' && <span className="ml-1 text-xs opacity-75">(x{f.mult})</span>}
          </button>
        ))}
      </div>

      {faseActiva === 'grupos' && (
        <div className="flex gap-2 mb-4">
          {jornadas.map(j => (
            <button
              key={j.id}
              onClick={() => setJornadaActiva(j.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                jornadaActiva === j.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
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
                      <th className="pb-3 font-medium pr-4 text-center">Marcador</th>
                      <th className="pb-3 font-medium pr-4">Visita</th>
                      <th className="pb-3 font-medium text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pjs.map((p, i) => (
                      <FilaPartido
                        key={p.id}
                        partido={p}
                        index={i}
                        editResultados={editResultados}
                        actualizarResultado={actualizarResultado}
                        mostrarFecha={faseActiva === 'grupos'}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {participantes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pronósticos por Participante</h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {participantes.map(p => (
              <button
                key={p.id}
                onClick={() => setParticipanteActivo(p.id === participanteActivo ? null : p.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  participanteActivo === p.id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </div>

          {participanteActivo && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium pr-4">#</th>
                      {faseActiva === 'grupos' && <th className="pb-3 font-medium pr-4">Fecha</th>}
                      <th className="pb-3 font-medium pr-4">Local</th>
                      <th className="pb-3 font-medium pr-4 text-center">Pronóstico</th>
                      <th className="pb-3 font-medium pr-4">Visita</th>
                      <th className="pb-3 font-medium text-center">Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidosJornada.map((p, i) => {
                      const prono = getPronostico(participanteActivo, p.id)
                      return (
                        <FilaPronostico
                          key={p.id}
                          partido={p}
                          index={i}
                          pronostico={prono}
                          participanteId={participanteActivo}
                          guardarPronostico={guardarPronostico}
                          mostrarFecha={faseActiva === 'grupos'}
                        />
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function FilaPartido({ partido: p, index, editResultados, actualizarResultado, mostrarFecha }) {
  const [local, setLocal] = useState(p.marcador_local ?? '')
  const [visita, setVisita] = useState(p.marcador_visita ?? '')

  const guardar = () => {
    actualizarResultado(p.id, local === '' ? null : Number(local), visita === '' ? null : Number(visita))
  }

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 pr-4 text-gray-500">{index + 1}</td>
      {mostrarFecha && <td className="py-3 pr-4 text-xs text-gray-400">{p.fecha || '-'}</td>}
      <td className="py-3 pr-4 font-medium">
        <span className="inline-flex items-center gap-1.5">
          {p.local && <FlagIcon code={p.local} size={14} />}
          {nEq(p.local)?.nombre || p.local || '—'}
        </span>
      </td>
      <td className="py-3 pr-4 text-center">
        {editResultados ? (
          <span className="inline-flex items-center gap-1">
            <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm"
              value={local} onChange={e => setLocal(e.target.value)} onBlur={guardar} min="0" />
            <span className="text-gray-400">-</span>
            <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm"
              value={visita} onChange={e => setVisita(e.target.value)} onBlur={guardar} min="0" />
          </span>
        ) : (
          <span className={p.actualizado ? 'font-bold' : 'text-gray-400'}>
            {p.actualizado ? `${p.marcador_local ?? '?'} - ${p.marcador_visita ?? '?'}` : '—'}
          </span>
        )}
      </td>
      <td className="py-3 pr-4 font-medium">
        <span className="inline-flex items-center gap-1.5">
          {p.visita && <FlagIcon code={p.visita} size={14} />}
          {nEq(p.visita)?.nombre || p.visita || '—'}
        </span>
      </td>
      <td className="py-3 text-center">
        {p.actualizado
          ? <span className="text-green-600 text-xs font-medium">✅ Jugado</span>
          : <span className="text-gray-400 text-xs">⏳ {p.fecha || 'Pendiente'}</span>
        }
      </td>
    </tr>
  )
}

function FilaPronostico({ partido: p, index, pronostico, participanteId, guardarPronostico, mostrarFecha }) {
  const [local, setLocal] = useState(pronostico?.local ?? '')
  const [visita, setVisita] = useState(pronostico?.visita ?? '')

  const guardar = () => {
    guardarPronostico(participanteId, p.id, local === '' ? null : Number(local), visita === '' ? null : Number(visita))
  }

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-2 pr-4 text-gray-500">{index + 1}</td>
      {mostrarFecha && <td className="py-2 pr-4 text-xs text-gray-400">{p.fecha || '-'}</td>}
      <td className="py-2 pr-4">
        <span className="inline-flex items-center gap-1.5">
          {p.local && <FlagIcon code={p.local} size={14} />}
          {nEq(p.local)?.nombre || p.local || '—'}
        </span>
      </td>
      <td className="py-2 pr-4 text-center">
        <span className="inline-flex items-center gap-1">
          <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm"
            value={local} onChange={e => setLocal(e.target.value)} onBlur={guardar} min="0" />
          <span className="text-gray-400">-</span>
          <input type="number" className="w-12 px-2 py-1 border rounded text-center text-sm"
            value={visita} onChange={e => setVisita(e.target.value)} onBlur={guardar} min="0" />
        </span>
      </td>
      <td className="py-2 pr-4">
        <span className="inline-flex items-center gap-1.5">
          {p.visita && <FlagIcon code={p.visita} size={14} />}
          {nEq(p.visita)?.nombre || p.visita || '—'}
        </span>
      </td>
      <td className="py-2 text-center">
        {p.actualizado ? (
          <span className="font-bold">{p.marcador_local} - {p.marcador_visita}</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </tr>
  )
}
