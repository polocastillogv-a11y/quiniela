import { Link } from 'react-router-dom'
import { UsersIcon, ChevronRightIcon, CurrencyDollarIcon, ClockIcon, ChartBarIcon, DocumentTextIcon, TrophyIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import useQuinielaStore from '../store/quinielaStore'
import { calcularPuntos } from '../utils/puntuacion'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'

const acciones = [
  { to: '/participantes', label: 'Gestionar Participantes', icon: UsersIcon },
  { to: '/sorteo', label: 'Sorteo de Equipos', icon: TrophyIcon },
  { to: '/quiniela', label: 'Quiniela / Pronosticos', icon: DocumentTextIcon },
  { to: '/bolsa', label: 'Gestionar Pagos', icon: CurrencyDollarIcon },
  { to: '/resultados', label: 'Ver Resultados', icon: ChartBarIcon },
]

export default function Dashboard() {
  const participantes = useParticipantesStore(s => s.participantes)
  const totalBolsa = useParticipantesStore(s => s.totalBolsa)
  const totalEsperado = useParticipantesStore(s => s.totalEsperado)
  const partidos = useQuinielaStore(s => s.partidos)
  const predicciones = useQuinielaStore(s => s.predicciones)

  const activos = participantes.filter(p => p.activo !== false)
  const jugados = partidos.filter(p => p.actualizado).length
  const bolsaRecaudada = totalBolsa()
  const esperado = totalEsperado()
  const pctBolsa = esperado > 0 ? Math.round((bolsaRecaudada / esperado) * 100) : 0

  const rankings = activos.map(p => {
    const res = calcularPuntos(predicciones, p.id, partidos)
    return { ...p, puntos: res.puntos }
  }).sort((a, b) => b.puntos - a.puntos)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <section>
          <p className="text-xs font-semibold tracking-[0.2em] text-cesped/60 uppercase mb-1">
            La Bolsa
          </p>
          <h1 className="font-display font-black text-7xl lg:text-8xl text-cesped leading-none">
            ${bolsaRecaudada.toLocaleString()}
          </h1>
          <p className="text-sm text-cesped/60 mt-1 font-semibold">
            De ${esperado.toLocaleString()} en juego
          </p>
          <div className="mt-4 w-full h-1.5 bg-cesped/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-pasto rounded-full transition-all duration-500"
              style={{ width: `${pctBolsa}%` }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-cesped/40 uppercase mb-3">
            Acciones
          </h2>
          <div className="rounded-xl border border-cesped/10 overflow-hidden bg-white">
            {acciones.map((a, i) => (
              <Link
                key={a.to}
                to={a.to}
                className={`flex items-center justify-between px-5 py-4 group transition-colors hover:text-tinto ${
                  i < acciones.length - 1 ? 'border-b border-cesped/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <a.icon className="w-5 h-5 text-cesped/40 group-hover:text-tinto/60 transition-colors" />
                  <span className="text-xs font-bold tracking-wider uppercase">
                    {a.label}
                  </span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-cesped/30 group-hover:text-tinto/50 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-2 space-y-5">
        <Card variant="dark">
          <div className="flex items-center gap-4">
            <UsersIcon className="w-8 h-8 text-crema/60" />
            <div>
              <p className="text-3xl font-display font-black">{activos.length}</p>
              <p className="text-sm text-crema/70 font-semibold">Participantes</p>
            </div>
          </div>
        </Card>

        <Card variant="light">
          <div className="flex items-center gap-4">
            <CurrencyDollarIcon className="w-8 h-8 text-cesped/40" />
            <div>
              <p className="text-3xl font-display font-black text-cesped">${bolsaRecaudada.toLocaleString()}</p>
              <p className="text-sm text-cesped/60 font-semibold">Bolsa recaudada</p>
            </div>
          </div>
        </Card>

        <Card variant="light">
          <div className="flex items-center gap-4">
            <ClockIcon className="w-8 h-8 text-cesped/40" />
            <div>
              <p className="text-3xl font-display font-black text-cesped">{jugados}/{partidos.length}</p>
              <p className="text-sm text-cesped/60 font-semibold">Partidos jugados</p>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-cesped/40 uppercase mb-3">
            Posiciones
          </h3>
          <div className="rounded-xl border border-cesped/10 overflow-hidden bg-white">
            {rankings.length === 0 ? (
              <div className="px-6 py-8 text-center text-cesped/30 text-sm">
                No hay participantes
              </div>
            ) : (
              rankings.slice(0, 5).map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between px-5 py-3 ${
                    i < 4 ? 'border-b border-cesped/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-3xl text-cesped/20 w-10 text-right">
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.nombre} size="sm" />
                      <span className="text-sm font-semibold text-gray-800">{r.nombre}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-cesped">{r.puntos} pts</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
