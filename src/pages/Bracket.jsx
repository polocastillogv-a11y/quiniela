import { useState } from 'react'
import { TrophyIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import useQuinielaStore from '../store/quinielaStore'
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
      <h1 className="text-3xl font-display font-black text-cesped tracking-tight mb-8">Bracket Eliminatorio</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {fasesBracket.map((f, i) => (
          <button
            key={f}
            onClick={() => setFaseIdx(i)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold tracking-wide transition-colors ${
              faseIdx === i
                ? 'bg-ocre text-white'
                : 'bg-cesped/5 text-cesped/60 hover:bg-cesped/10 hover:text-cesped'
            }`}
          >
            {nombresFase[f]}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {partidosFase.map((p, i) => (
          <Card key={p.id} variant="light" className="border-l-4 border-l-ocre">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-right">
                <span className="inline-flex items-center gap-1.5 justify-end text-lg font-bold text-tinta">
                  {p.local && <FlagIcon code={p.local} size={18} />}
                  {getEquipo(p.local)?.nombre || p.local || '—'}
                </span>
              </div>
              <div className="mx-6 text-center">
                <div className="text-2xl font-display font-black text-cesped">
                  {p.actualizado
                    ? `${p.marcador_local ?? '?'} - ${p.marcador_visita ?? '?'}`
                    : '? - ?'
                  }
                </div>
                <div className="text-xs text-cesped/40 mt-1 font-mono">
                  {p.label || `Partido ${i + 1}`}
                </div>
              </div>
              <div className="flex-1 text-left">
                <span className="inline-flex items-center gap-1.5 text-lg font-bold text-tinta">
                  {p.visita && <FlagIcon code={p.visita} size={18} />}
                  {getEquipo(p.visita)?.nombre || p.visita || '—'}
                </span>
              </div>
            </div>
            <div className="text-center mt-2">
              {p.actualizado
                ? <span className="inline-flex items-center gap-1 text-xs text-pasto font-semibold"><CheckCircleIcon className="w-3.5 h-3.5" /> Jugado</span>
                : <span className="inline-flex items-center gap-1 text-xs text-cesped/40 font-semibold"><ClockIcon className="w-3.5 h-3.5" /> {p.fecha || 'Pendiente'}</span>
              }
            </div>
          </Card>
        ))}
        {partidosFase.length === 0 && (
          <Card variant="light">
            <div className="text-center py-8 text-cesped/30">
              <p>No hay partidos en esta fase</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
