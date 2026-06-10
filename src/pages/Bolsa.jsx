import useParticipantesStore from '../store/participantesStore'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💰 Bolsa y Pagos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total Esperado</div>
            <div className="text-2xl font-bold text-gray-800">${totalEsperado().toLocaleString()}</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total Recaudado</div>
            <div className="text-2xl font-bold text-green-600">${totalBolsa().toLocaleString()}</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-sm text-gray-500">Pendiente</div>
            <div className="text-2xl font-bold text-red-600">${totalPendiente().toLocaleString()}</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-sm text-gray-500">Cobrado</div>
            <div className="text-2xl font-bold text-blue-600">{pctCobrado}%</div>
          </div>
        </Card>
      </div>

      {totalEsperado() > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${pctCobrado}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`✅ Pagados (${pagados.length})`}>
          {pagados.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Nadie ha pagado aún</p>
          ) : (
            <div className="space-y-2">
              {pagados.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium">{p.nombre}</span>
                    <span className="text-sm text-gray-500 ml-2">${p.cuota}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {p.metodo_pago && `${p.metodo_pago}`}
                      {p.referencia && ` · ${p.referencia}`}
                    </span>
                    <button onClick={() => togglePago(p.id)} className="text-sm text-red-600 hover:underline">Desmarcar</button>
                  </div>
                </div>
              ))}
              <div className="pt-3 text-right font-semibold text-green-700">
                Total: ${pagados.reduce((s, p) => s + (p.cuota || 0), 0).toLocaleString()}
              </div>
            </div>
          )}
        </Card>

        <Card title={`⏳ Pendientes (${pendientes.length})`}>
          {pendientes.length === 0 ? (
            <p className="text-gray-400 text-center py-6">¡Todos pagaron! 🎉</p>
          ) : (
            <div className="space-y-2">
              {pendientes.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium">{p.nombre}</span>
                    <span className="text-sm text-gray-500 ml-2">${p.cuota}</span>
                  </div>
                  <button onClick={() => togglePago(p.id)} className="text-sm text-green-600 hover:underline">
                    Marcar como pagado
                  </button>
                </div>
              ))}
              <div className="pt-3 text-right font-semibold text-red-700">
                Total: ${pendientes.reduce((s, p) => s + (p.cuota || 0), 0).toLocaleString()}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6" title="Resumen por Participante">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium pr-4">#</th>
                <th className="pb-3 font-medium pr-4">Participante</th>
                <th className="pb-3 font-medium pr-4">Cuota</th>
                <th className="pb-3 font-medium pr-4">Pagó</th>
                <th className="pb-3 font-medium pr-4">Método</th>
                <th className="pb-3 font-medium text-right">Referencia</th>
              </tr>
            </thead>
            <tbody>
              {activos.map((p, i) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                  <td className="py-3 pr-4 font-medium">{p.nombre}</td>
                  <td className="py-3 pr-4">${(p.cuota || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {p.pagado ? <Badge color="green">✅ Sí</Badge> : <Badge color="red">❌ No</Badge>}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.metodo_pago || '-'}</td>
                  <td className="py-3 text-right text-gray-500">{p.referencia || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6" title="🏆 Premios Sugeridos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="text-2xl mb-1">🥇</div>
            <div className="text-lg font-bold text-yellow-800">
              ${(totalBolsa() * 0.5).toLocaleString()}
            </div>
            <div className="text-sm text-yellow-600">1er Lugar (50%)</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-2xl mb-1">🥈</div>
            <div className="text-lg font-bold text-gray-800">
              ${(totalBolsa() * 0.3).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">2do Lugar (30%)</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="text-2xl mb-1">🥉</div>
            <div className="text-lg font-bold text-orange-800">
              ${(totalBolsa() * 0.2).toLocaleString()}
            </div>
            <div className="text-sm text-orange-600">3er Lugar (20%)</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
