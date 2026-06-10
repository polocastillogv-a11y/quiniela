import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import { calcularPuntos } from '../utils/puntuacion'
import Card from '../components/ui/Card'

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Resultados</h1>
        <p className="text-sm text-gray-500 mt-1">{jugados}/{total} partidos jugados</p>
      </div>

      <Card>
        {activos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No hay participantes registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((r, i) => (
              <div key={r.id} className={`p-4 rounded-xl border ${i === 0 ? 'border-yellow-400 bg-yellow-50' : i === 1 ? 'border-gray-300 bg-gray-50' : i === 2 ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-bold text-lg">{r.nombre}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{r.puntos}</div>
                    <div className="text-xs text-gray-400">puntos</div>
                  </div>
                </div>

                {r.detalle?.length > 0 && (
                  <details className="text-sm text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700">Ver detalle ({r.detalle.length} aciertos)</summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {r.detalle.map((d, di) => (
                        <li key={di} className="flex justify-between">
                          <span>{d.concepto}</span>
                          <span className="font-medium text-green-600">+{d.pts}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                {(!r.detalle || r.detalle.length === 0) && jugados > 0 && (
                  <p className="text-xs text-gray-400 italic">Sin aciertos aún</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
