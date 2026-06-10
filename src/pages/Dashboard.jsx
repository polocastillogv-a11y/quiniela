import { Link } from 'react-router-dom'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import { calcularPuntos } from '../utils/puntuacion'
import Card from '../components/ui/Card'

export default function Dashboard() {
  const participantes = useParticipantesStore(s => s.participantes)
  const sesion = useParticipantesStore(s => s.sesion)
  const totalBolsa = useParticipantesStore(s => s.totalBolsa)
  const totalEsperado = useParticipantesStore(s => s.totalEsperado)
  const totalPendiente = useParticipantesStore(s => s.totalPendiente)
  const partidos = useQuinielaStore(s => s.partidos)
  const predicciones = useQuinielaStore(s => s.predicciones)

  const activos = participantes.filter(p => p.activo !== false)
  const pagados = activos.filter(p => p.pagado)
  const jugados = partidos.filter(p => p.actualizado).length

  const rankings = activos.map(p => {
    const res = calcularPuntos(predicciones, p.id, partidos)
    return { ...p, puntos: res.puntos }
  }).sort((a, b) => b.puntos - a.puntos)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {!sesion.tipo ? (
          <Link to="/participantes" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            Iniciar sesión
          </Link>
        ) : (
          <span className="text-sm text-gray-500">
            {sesion.tipo === 'admin' ? '👑 Admin' : `🎯 ${participantes.find(p => p.id === sesion.participanteId)?.nombre}`}
          </span>
        )}
      </div>

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
            <div className="text-3xl mb-1">⚽</div>
            <div className="text-2xl font-bold text-blue-600">{jugados}/{partidos.length}</div>
            <div className="text-sm text-gray-500">Partidos jugados</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Acciones Rápidas">
          <div className="space-y-3">
            <Link to="/participantes" className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              👥 {sesion.tipo ? 'Gestionar Participantes' : 'Registrarse / Iniciar Sesión'}
            </Link>
            <Link to="/quiniela" className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              📋 {sesion.tipo === 'admin' ? 'Ingresar Resultados' : 'Hacer Pronósticos'}
            </Link>
            <Link to="/bolsa" className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              💰 Gestionar Pagos y Bolsa
            </Link>
            <Link to="/resultados" className="block w-full text-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              📈 Ver Resultados
            </Link>
          </div>
        </Card>

        <Card title="🏆 Tabla de Posiciones">
          {rankings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No hay participantes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankings.slice(0, 5).map((r, i) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300 text-gray-700' :
                      i === 2 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>{i + 1}</span>
                    <span className="font-medium text-sm">{r.nombre}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{r.puntos} pts</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
