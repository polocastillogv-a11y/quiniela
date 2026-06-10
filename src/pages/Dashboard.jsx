import { Link } from 'react-router-dom'
import useParticipantesStore from '../store/participantesStore'
import useSorteoStore from '../store/sorteoStore'
import Card from '../components/ui/Card'

export default function Dashboard() {
  const participantes = useParticipantesStore(s => s.participantes)
  const totalBolsa = useParticipantesStore(s => s.totalBolsa)
  const totalEsperado = useParticipantesStore(s => s.totalEsperado)
  const totalPendiente = useParticipantesStore(s => s.totalPendiente)
  const sorteado = useSorteoStore(s => s.sorteado)
  const asignaciones = useSorteoStore(s => s.asignaciones)

  const activos = participantes.filter(p => p.activo !== false)
  const pagados = activos.filter(p => p.pagado)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-1">👥</div>
            <div className="text-2xl font-bold text-indigo-600">{activos.length}</div>
            <div className="text-sm text-gray-500">Participantes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-1">💰</div>
            <div className="text-2xl font-bold text-green-600">${totalBolsa().toLocaleString()}</div>
            <div className="text-sm text-gray-500">Bolsa (de ${totalEsperado().toLocaleString()})</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">${totalPendiente().toLocaleString()}</div>
            <div className="text-sm text-gray-500">Pendiente de cobro</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-blue-600">{pagados.length}/{activos.length}</div>
            <div className="text-sm text-gray-500">Pagaron</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Acciones Rápidas">
          <div className="space-y-3">
            <Link to="/participantes" className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              👥 Gestionar Participantes
            </Link>
            <Link to="/sorteo" className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              🎲 {sorteado ? 'Ver Sorteo' : 'Realizar Sorteo'}
            </Link>
            <Link to="/bolsa" className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              💰 Gestionar Pagos y Bolsa
            </Link>
            <Link to="/resultados" className="block w-full text-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              📈 Ver Resultados
            </Link>
          </div>
        </Card>

        <Card title="Vista Previa del Sorteo">
          {sorteado ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {asignaciones.map(a => {
                const p = participantes.find(pp => pp.id === a.participanteId)
                return (
                  <div key={a.participanteId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium text-sm">{p?.nombre || '?'}</span>
                    <span className="text-sm text-gray-600">{a.equipos.length} equipos</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🎲</div>
              <p>Aún no se ha realizado el sorteo</p>
              <Link to="/sorteo" className="text-indigo-600 hover:underline text-sm">Ir al sorteo</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
