import { CurrencyDollarIcon, CheckCircleIcon, XCircleIcon, TrophyIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

export default function Bolsa() {
  const participantes = useParticipantesStore(s => s.participantes)
  const totalBolsa = useParticipantesStore(s => s.totalBolsa)
  const totalEsperado = useParticipantesStore(s => s.totalEsperado)
  const totalPendiente = useParticipantesStore(s => s.totalPendiente)
  const actualizarPago = useParticipantesStore(s => s.actualizarPago)
  const togglePago = useParticipantesStore(s => s.togglePago)
  const editar = useParticipantesStore(s => s.editar)

  const activos = participantes.filter(p => p.activo !== false)
  const pagados = activos.filter(p => p.pagado)
  const pendientes = activos.filter(p => !p.pagado)

  const pctCobrado = totalEsperado() > 0 ? Math.round((totalBolsa() / totalEsperado()) * 100) : 0

  return (
    <div>
      <h1 className="text-3xl font-display font-black text-cesped tracking-tight mb-8">Bolsa y Pagos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card variant="light">
          <div className="text-center">
            <div className="text-sm text-cesped/50 font-semibold">Total Esperado</div>
            <div className="text-2xl font-display font-black text-cesped mt-1">${totalEsperado().toLocaleString()}</div>
          </div>
        </Card>
        <Card variant="dark">
          <div className="text-center">
            <div className="text-sm text-crema/50 font-semibold">Total Recaudado</div>
            <div className="text-2xl font-display font-black text-crema mt-1">${totalBolsa().toLocaleString()}</div>
          </div>
        </Card>
        <Card variant="light">
          <div className="text-center">
            <div className="text-sm text-cesped/50 font-semibold">Pendiente</div>
            <div className="text-2xl font-display font-black text-tinto mt-1">${totalPendiente().toLocaleString()}</div>
          </div>
        </Card>
        <Card variant="light">
          <div className="text-center">
            <div className="text-sm text-cesped/50 font-semibold">Cobrado</div>
            <div className="text-2xl font-display font-black text-pasto mt-1">{pctCobrado}%</div>
          </div>
        </Card>
      </div>

      {totalEsperado() > 0 && (
        <div className="w-full h-2 bg-cesped/10 rounded-full mb-8">
          <div
            className="bg-pasto h-2 rounded-full transition-all duration-500"
            style={{ width: `${pctCobrado}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`Pagados (${pagados.length})`} variant="light">
          {pagados.length === 0 ? (
            <p className="text-cesped/30 text-center py-6">Nadie ha pagado aun</p>
          ) : (
            <div className="space-y-2">
              {pagados.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-pasto/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.nombre} size="sm" />
                    <div>
                      <span className="font-semibold text-gray-800">{p.nombre}</span>
                      <span className="text-sm text-cesped/50 ml-2 font-mono">${p.cuota}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-cesped/40 font-mono">
                      {p.metodo_pago && `${p.metodo_pago}`}
                      {p.referencia && ` · ${p.referencia}`}
                    </span>
                    <button onClick={() => togglePago(p.id)} className="text-xs text-tinto hover:text-tinto/70 font-semibold transition-colors">Desmarcar</button>
                  </div>
                </div>
              ))}
              <div className="pt-3 text-right font-display font-bold text-pasto">
                Total: ${pagados.reduce((s, p) => s + (p.cuota || 0), 0).toLocaleString()}
              </div>
            </div>
          )}
        </Card>

        <Card title={`Pendientes (${pendientes.length})`} variant="light">
          {pendientes.length === 0 ? (
            <p className="text-cesped/30 text-center py-6">Todos pagaron</p>
          ) : (
            <div className="space-y-2">
              {pendientes.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-tinto/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.nombre} size="sm" />
                    <div>
                      <span className="font-semibold text-gray-800">{p.nombre}</span>
                      <span className="text-sm text-cesped/50 ml-2 font-mono">${p.cuota}</span>
                    </div>
                  </div>
                  <button onClick={() => togglePago(p.id)} className="text-xs text-pasto hover:text-pasto/70 font-semibold transition-colors">
                    Marcar como pagado
                  </button>
                </div>
              ))}
              <div className="pt-3 text-right font-display font-bold text-tinto">
                Total: ${pendientes.reduce((s, p) => s + (p.cuota || 0), 0).toLocaleString()}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6" title="Resumen por Participante" variant="light">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-cesped/50 border-b border-cesped/10">
                <th className="pb-3 font-semibold pr-4">#</th>
                <th className="pb-3 font-semibold pr-4">Participante</th>
                <th className="pb-3 font-semibold pr-4">Cuota</th>
                <th className="pb-3 font-semibold pr-4">Pago</th>
                <th className="pb-3 font-semibold pr-4">Metodo</th>
                <th className="pb-3 font-semibold text-right">Referencia</th>
              </tr>
            </thead>
            <tbody>
              {activos.map((p, i) => (
                <tr key={p.id} className="border-b border-cesped/5 last:border-0 hover:bg-cesped/[0.02]">
                  <td className="py-3 pr-4 text-cesped/40 font-mono text-xs">{i + 1}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-800">{p.nombre}</td>
                  <td className="py-3 pr-4 font-mono">${(p.cuota || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {p.pagado ? <Badge color="green"><CheckCircleIcon className="w-3 h-3" /> Si</Badge> : <Badge color="red"><XCircleIcon className="w-3 h-3" /> No</Badge>}
                  </td>
                  <td className="py-3 pr-4 text-cesped/50 text-xs">{p.metodo_pago || '—'}</td>
                  <td className="py-3 text-right text-cesped/50 font-mono text-xs">{p.referencia || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6" title="Premios Sugeridos" variant="light">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 bg-ocre/5 rounded-xl border border-ocre/20">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-ocre" />
            <div className="text-lg font-display font-black text-ocre">
              ${(totalBolsa() * 0.5).toLocaleString()}
            </div>
            <div className="text-xs text-ocre/70 font-semibold">1er Lugar (50%)</div>
          </div>
          <div className="p-5 bg-cesped/[0.02] rounded-xl border border-cesped/10">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-cesped/30" />
            <div className="text-lg font-display font-black text-cesped">
              ${(totalBolsa() * 0.3).toLocaleString()}
            </div>
            <div className="text-xs text-cesped/50 font-semibold">2do Lugar (30%)</div>
          </div>
          <div className="p-5 bg-tinto/5 rounded-xl border border-tinto/20">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-tinto/60" />
            <div className="text-lg font-display font-black text-tinto">
              ${(totalBolsa() * 0.2).toLocaleString()}
            </div>
            <div className="text-xs text-tinto/60 font-semibold">3er Lugar (20%)</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
