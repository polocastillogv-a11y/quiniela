import useParticipantesStore from '../store/participantesStore'
import useSorteoStore from '../store/sorteoStore'
import useSessionStore from '../store/sessionStore'
import { getEquipo } from '../data/grupos'
import Card from '../components/ui/Card'
import FlagIcon from '../components/ui/FlagIcon'

export default function Sorteo() {
  const sesion = useSessionStore(s => s)
  const participantes = useParticipantesStore(s => s.participantes)
  const activos = participantes.filter(p => p.activo !== false)
  const asignaciones = useSorteoStore(s => s.asignaciones)
  const sorteado = useSorteoStore(s => s.sorteado)
  const ejecutar = useSorteoStore(s => s.ejecutar)
  const resetear = useSorteoStore(s => s.resetear)

  if (sesion.tipo !== 'admin') {
    return (
      <Card>
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">🎲</div>
          <p className="text-lg">Solo el administrador puede realizar el sorteo</p>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sorteo de Equipos</h1>
        {sorteado && (
          <button onClick={resetear} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">
            Resetear Sorteo
          </button>
        )}
      </div>

      {!sorteado ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Sorteo de Equipos</h2>
            <p className="text-gray-500 mb-2">A cada participante se le asignarán equipos aleatoriamente.</p>
            <p className="text-gray-500 mb-6">Cada participante solo pronosticará los partidos de SUS equipos.</p>
            <button onClick={() => ejecutar(activos)} disabled={activos.length < 1}
              className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg">
              🎲 Realizar Sorteo ({activos.length} participantes)
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(asignaciones).map(([pid, eqs]) => {
            const p = participantes.find(pp => pp.id === Number(pid))
            return (
              <Card key={pid}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{p?.nombre || '?'}</h3>
                  <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{eqs.length} equipos</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eqs.map(eqId => {
                    const eq = getEquipo(eqId)
                    return (
                      <span key={eqId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                        <FlagIcon code={eqId} size={12} />
                        {eq?.nombre || eqId}
                      </span>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
