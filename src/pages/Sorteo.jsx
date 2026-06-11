import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import useSorteoStore from '../store/sorteoStore'
import useSessionStore from '../store/sessionStore'
import { getEquipo } from '../data/grupos'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import FlagIcon from '../components/ui/FlagIcon'

export default function Sorteo() {
  const sesion = useSessionStore(s => s)
  const participantes = useParticipantesStore(s => s.participantes)
  const activos = participantes.filter(p => p.activo !== false)
  const asignaciones = useSorteoStore(s => s.asignaciones)
  const sorteado = useSorteoStore(s => s.sorteado)
  const ejecutar = useSorteoStore(s => s.ejecutar)
  const resetear = useSorteoStore(s => s.resetear)
  const rebalancear = useSorteoStore(s => s.rebalancear)

  const pids = Object.keys(asignaciones)
  const conteos = pids.map(pid => ({ pid: Number(pid), count: asignaciones[pid].length }))
  const minCount = conteos.length > 0 ? Math.min(...conteos.map(c => c.count)) : 0
  const maxCount = conteos.length > 0 ? Math.max(...conteos.map(c => c.count)) : 0
  const necesitaRebalanceo = maxCount !== minCount

  if (sesion.tipo !== 'admin') {
    return (
      <Card variant="light">
        <div className="text-center py-12 text-cesped/40">
          <ArrowsRightLeftIcon className="w-12 h-12 mx-auto mb-4 text-cesped/20" />
          <p className="text-lg font-semibold">Solo el administrador puede realizar el sorteo</p>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-black text-cesped tracking-tight">Sorteo de Equipos</h1>
        {sorteado && (
          <div className="flex gap-2">
            {necesitaRebalanceo && (
              <Button variant="primary" size="sm" onClick={() => rebalancear(activos)}>
                Rebalancear ({maxCount - minCount} dif)
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={resetear}>
              Resetear Sorteo
            </Button>
          </div>
        )}
      </div>

      {!sorteado ? (
        <Card variant="light">
          <div className="text-center py-12">
            <ArrowsRightLeftIcon className="w-16 h-16 mx-auto mb-4 text-cesped/20" />
            <h2 className="text-2xl font-display font-black text-cesped mb-2">Sorteo de Equipos</h2>
            <p className="text-cesped/60 mb-2">A cada participante se le asignaran equipos aleatoriamente.</p>
            <p className="text-cesped/60 mb-8">Cada participante solo pronosticara los partidos de SUS equipos.</p>
            <Button variant="primary" size="lg" onClick={() => ejecutar(activos)} disabled={activos.length < 1}>
              <ArrowsRightLeftIcon className="w-5 h-5" />
              Realizar Sorteo ({activos.length} participantes)
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(asignaciones).map(([pid, eqs]) => {
            const p = participantes.find(pp => pp.id === Number(pid))
            return (
              <Card key={pid} variant="light">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-tinta">{p?.nombre || '?'}</h3>
                  <span className="text-xs font-semibold bg-pasto/10 text-pasto px-2 py-1 rounded-full">{eqs.length} equipos</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eqs.map(eqId => {
                    const eq = getEquipo(eqId)
                    return (
                      <span key={eqId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cesped/5 rounded text-xs font-medium text-cesped/80">
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
