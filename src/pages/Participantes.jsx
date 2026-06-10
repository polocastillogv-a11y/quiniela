import { useState } from 'react'
import useParticipantesStore from '../store/participantesStore'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'

export default function Participantes() {
  const participantes = useParticipantesStore(s => s.participantes)
  const agregar = useParticipantesStore(s => s.agregar)
  const eliminar = useParticipantesStore(s => s.eliminar)
  const editar = useParticipantesStore(s => s.editar)
  const togglePago = useParticipantesStore(s => s.togglePago)

  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nombre, setNombre] = useState('')
  const [cuota, setCuota] = useState('')

  const abrirNuevo = () => {
    setEditando(null)
    setNombre('')
    setCuota('')
    setModalOpen(true)
  }

  const abrirEditar = (p) => {
    setEditando(p)
    setNombre(p.nombre)
    setCuota(String(p.cuota))
    setModalOpen(true)
  }

  const guardar = () => {
    if (!nombre.trim()) return
    if (editando) {
      editar(editando.id, { nombre: nombre.trim(), cuota: Number(cuota) || 0 })
    } else {
      agregar(nombre.trim(), Number(cuota) || 0)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Participantes</h1>
        <button
          onClick={abrirNuevo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Agregar
        </button>
      </div>

      <Card>
        {participantes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-lg">No hay participantes registrados</p>
            <button onClick={abrirNuevo} className="mt-3 text-indigo-600 hover:underline">Agregar primer participante</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Cuota</th>
                  <th className="pb-3 font-medium">Pagó</th>
                  <th className="pb-3 font-medium">Método</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map((p, i) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 text-gray-500">{i + 1}</td>
                    <td className="py-3 font-medium">{p.nombre}</td>
                    <td className="py-3">${(p.cuota || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <button onClick={() => togglePago(p.id)} className="cursor-pointer">
                        {p.pagado
                          ? <Badge color="green">✅ Pagado</Badge>
                          : <Badge color="red">❌ Pendiente</Badge>
                        }
                      </button>
                    </td>
                    <td className="py-3 text-gray-500">{p.metodo_pago || '-'}</td>
                    <td className="py-3 text-gray-500">
                      {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <button onClick={() => abrirEditar(p)} className="text-indigo-600 hover:underline mr-3">Editar</button>
                      <button onClick={() => eliminar(p.id)} className="text-red-600 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar Participante' : 'Nuevo Participante'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nombre del participante"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuota ($)</label>
            <input
              type="number"
              value={cuota}
              onChange={e => setCuota(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={guardar} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              {editando ? 'Guardar Cambios' : 'Agregar'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
