import useParticipantesStore from '../store/participantesStore'
import useSorteoStore from '../store/sorteoStore'
import { getEquipo } from '../data/grupos'
import Card from '../components/ui/Card'
import FlagIcon from '../components/ui/FlagIcon'

export default function Sorteo() {
  const participantes = useParticipantesStore(s => s.participantes)
  const activos = participantes.filter(p => p.activo !== false)
  const asignaciones = useSorteoStore(s => s.asignaciones)
  const sorteado = useSorteoStore(s => s.sorteado)
  const ejecutarSorteo = useSorteoStore(s => s.ejecutarSorteo)
  const resetearSorteo = useSorteoStore(s => s.resetearSorteo)

  const handleSorteo = () => {
    if (activos.length === 0) return
    ejecutarSorteo(activos)
  }

  const totalEquipos = asignaciones.reduce((sum, a) => sum + a.equipos.length, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sorteo de Equipos</h1>
        {sorteado && (
          <button
            onClick={resetearSorteo}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            Resetear Sorteo
          </button>
        )}
      </div>

      {activos.length < 2 && (
        <Card className="mb-6 border-yellow-300 bg-yellow-50">
          <p className="text-yellow-800">Se necesitan al menos 2 participantes activos para realizar el sorteo.</p>
        </Card>
      )}

      {!sorteado ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">¿Listos para el sorteo?</h2>
            <p className="text-gray-500 mb-6">
              {activos.length} participante{activos.length !== 1 ? 's' : ''} · 48 equipos
            </p>
            <p className="text-sm text-gray-400 mb-6">
              A cada participante se le asignarán {activos.length > 0 ? Math.floor(48 / activos.length) : 0}~
              {Math.ceil(48 / activos.length)} equipos aleatoriamente
            </p>
            <button
              onClick={handleSorteo}
              disabled={activos.length < 2}
              className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              🎲 Realizar Sorteo
            </button>
          </div>
        </Card>
      ) : (
        <div>
          <Card className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{asignaciones.length}</div>
                <div className="text-sm text-gray-500">Participantes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalEquipos}</div>
                <div className="text-sm text-gray-500">Equipos asignados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{Math.floor(totalEquipos / (asignaciones.length || 1))}</div>
                <div className="text-sm text-gray-500">Promedio por persona</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{activos.length * 3 - totalEquipos}</div>
                <div className="text-sm text-gray-500">vs 3 c/u ideal</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {asignaciones.map(a => {
              const p = participantes.find(pp => pp.id === a.participanteId)
              return (
                <Card key={a.participanteId} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800">{p?.nombre || '?'}</h3>
                    <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{a.equipos.length} equipos</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.equipos.map(eqId => {
                      const eq = getEquipo(eqId)
                      return (
                        <span key={eqId} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                          <FlagIcon code={eqId} size={16} />
                          <span>{eq?.nombre || eqId}</span>
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
