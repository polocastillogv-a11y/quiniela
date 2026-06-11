import { ChartBarIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import { calcularPuntos } from '../utils/puntuacion'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

export default function Resultados() {
  const participantes = useParticipantesStore(s => s.participantes)
  const partidos = useQuinielaStore(s => s.partidos)
  const predicciones = useQuinielaStore(s => s.predicciones)

  const activos = participantes.filter(p => p.activo !== false)
  const jugados = partidos.filter(p => p.actualizado).length
  const total = partidos.length

  const rankings = activos.map(p => {
    const res = calcularPuntos(predicciones, p.id, partidos)
    return { ...p, ...res }
  })

  rankings.sort((a, b) => b.puntos - a.puntos)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-cesped tracking-tight">Resultados</h1>
        <p className="text-sm text-cesped/60 mt-1 font-semibold">
          <span className="font-mono">{jugados}/{total}</span> partidos jugados
        </p>
      </div>

      <Card variant="light">
        {activos.length === 0 ? (
          <div className="text-center py-12 text-cesped/30">
            <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-cesped/20" />
            <p>No hay participantes registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((r, i) => (
              <div
                key={r.id}
                className={`px-5 py-4 rounded-xl border transition-colors ${
                  i === 0 ? 'border-ocre/30 bg-ocre/5' :
                  i === 1 ? 'border-cesped/10 bg-cesped/[0.02]' :
                  i === 2 ? 'border-tinto/20 bg-tinto/5' :
                  'border-cesped/5 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`font-display font-black text-4xl w-12 text-right ${
                      i === 0 ? 'text-ocre' :
                      i === 1 ? 'text-cesped/40' :
                      i === 2 ? 'text-tinto/60' :
                      'text-cesped/20'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.nombre} size="md" />
                      <span className="font-bold text-lg text-gray-800">{r.nombre}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-black text-cesped">{r.puntos}</div>
                    <div className="text-xs text-cesped/40 font-mono">puntos</div>
                  </div>
                </div>

                {r.detalle?.length > 0 && (
                  <details className="text-sm text-cesped/60 mt-3 ml-16">
                    <summary className="cursor-pointer hover:text-cesped font-semibold">Ver detalle ({r.detalle.length} aciertos)</summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {r.detalle.map((d, di) => (
                        <li key={di} className="flex justify-between">
                          <span>{d.concepto}</span>
                          <span className="font-mono font-bold text-pasto">+{d.pts}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                {(!r.detalle || r.detalle.length === 0) && jugados > 0 && (
                  <p className="text-xs text-cesped/30 italic mt-3 ml-16">Sin aciertos aun</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
