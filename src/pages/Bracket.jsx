import { useState } from 'react'
import useQuinielaStore from '../store/quinielaStore'
import { fases } from '../data/partidos'
import { getEquipo } from '../data/grupos'
import Card from '../components/ui/Card'
import FlagIcon from '../components/ui/FlagIcon'

const fasesBracket = ['r32', 'r16', 'cuartos', 'semis', 'tercero', 'final']
const nombresFase = {
  r32: 'Ronda de 32',
  r16: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semis: 'Semifinales',
  tercero: 'Tercer Lugar',
  final: 'Final'
}

export default function Bracket() {
  const partidos = useQuinielaStore(s => s.partidos)
  const [faseIdx, setFaseIdx] = useState(0)

  const faseActual = fasesBracket[faseIdx]
  const partidosFase = partidos.filter(p => p.fase === faseActual)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🏆 Bracket Eliminatorio</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {fasesBracket.map((f, i) => (
          <button
            key={f}
            onClick={() => setFaseIdx(i)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              faseIdx === i
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {nombresFase[f]}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {partidosFase.map((p, i) => (
          <Card key={p.id} className="border-l-4 border-l-indigo-400">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-right">
                <span className="inline-flex items-center gap-1.5 justify-end text-lg font-semibold">
                  {p.local && <FlagIcon code={p.local} size={18} />}
                  {getEquipo(p.local)?.nombre || p.local || '—'}
                </span>
              </div>
              <div className="mx-6 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {p.actualizado
                    ? `${p.marcador_local ?? '?'} - ${p.marcador_visita ?? '?'}`
                    : '? - ?'
                  }
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {p.label || `Partido ${i + 1}`}
                </div>
              </div>
              <div className="flex-1 text-left">
                <span className="inline-flex items-center gap-1.5 text-lg font-semibold">
                  {p.visita && <FlagIcon code={p.visita} size={18} />}
                  {getEquipo(p.visita)?.nombre || p.visita || '—'}
                </span>
              </div>
            </div>
            <div className="text-center mt-2">
              {p.actualizado
                ? <span className="text-xs text-green-500">✅ Jugado</span>
                : <span className="text-xs text-yellow-500">⏳ {p.fecha || 'Pendiente'}</span>
              }
            </div>
          </Card>
        ))}
        {partidosFase.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <p>No hay partidos en esta fase</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
