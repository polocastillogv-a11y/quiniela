import { useState, useEffect } from 'react'
import useParticipantesStore from '../store/participantesStore'
import useSessionStore from '../store/sessionStore'
import Card from '../components/ui/Card'

export default function Participantes() {
  const participantes = useParticipantesStore(s => s.participantes)
  const loaded = useParticipantesStore(s => s.loaded)
  const registrar = useParticipantesStore(s => s.registrar)
  const eliminar = useParticipantesStore(s => s.eliminar)
  const getByToken = useParticipantesStore(s => s.getByToken)
  const sesion = useSessionStore(s => s)
  const loginParticipante = useSessionStore(s => s.loginParticipante)
  const loginAdmin = useSessionStore(s => s.loginAdmin)
  const logout = useSessionStore(s => s.logout)

  const [nombre, setNombre] = useState('')
  const [token, setToken] = useState('')
  const [cuota, setCuota] = useState('')
  const [error, setError] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [tokenRevelado, setTokenRevelado] = useState(null)

  const handleRegister = async () => {
    if (!nombre.trim() || !token.trim()) { setError('Nombre y token son obligatorios'); return }
    const result = await registrar(nombre.trim(), token.trim(), Number(cuota) || 0)
    if (!result.ok) {
      if (result.reason === 'token_exists') { setError('Ese token ya está registrado'); return }
      setError('Error al registrar: ' + (result.msg || 'intenta de nuevo'))
      return
    }
    setError(''); setNombre(''); setToken(''); setCuota('')
  }

  const handleLogin = () => {
    const t = tokenInput.trim()
    if (!t) return
    if (t === 'admin2026') { loginAdmin(); setTokenInput(''); return }
    const p = getByToken(t)
    if (p) { loginParticipante(p.id, t); setTokenInput(''); return }
    setError('Token inválido')
  }

  const generadorToken = () => {
    setToken(Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Participantes</h1>
        {sesion.tipo && (
          <button onClick={logout} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
            Cerrar sesión ({sesion.tipo === 'admin' ? 'Admin' : participantes.find(p => p.id === sesion.participanteId)?.nombre})
          </button>
        )}
      </div>

      {!loaded ? (
        <Card><div className="text-center py-8 text-gray-400"><p>Cargando...</p></div></Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="🔑 Iniciar Sesión">
              <p className="text-sm text-gray-500 mb-3">Participante: tu token secreto. Admin: <code className="bg-gray-100 px-1 rounded">admin2026</code></p>
              {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
              <div className="flex gap-2">
                <input type="text" value={tokenInput} onChange={e => { setTokenInput(e.target.value); setError('') }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tu token" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={handleLogin} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                  Entrar
                </button>
              </div>
            </Card>

            <Card title="📝 Registrarse">
              <p className="text-sm text-gray-500 mb-3">Crea tu cuenta con un token secreto que solo tú conozcas.</p>
              <div className="space-y-3">
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tu nombre" />
                <div className="flex gap-2">
                  <input type="text" value={token} onChange={e => setToken(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Token secreto" />
                  <button onClick={generadorToken} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 text-xs whitespace-nowrap">Generar</button>
                </div>
                <input type="number" value={cuota} onChange={e => setCuota(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Cuota ($) opcional" min="0" />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button onClick={handleRegister} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Registrarse</button>
              </div>
            </Card>
          </div>

          {sesion.tipo === 'admin' && (
            <Card title="👑 Admin — Participantes registrados">
              {participantes.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No hay participantes registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-medium pr-4">#</th>
                        <th className="pb-3 font-medium pr-4">Nombre</th>
                        <th className="pb-3 font-medium pr-4">Cuota</th>
                        <th className="pb-3 font-medium pr-4">Pagó</th>
                        <th className="pb-3 font-medium pr-4">Método</th>
                        <th className="pb-3 font-medium pr-4">Token</th>
                        <th className="pb-3 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantes.map((p, i) => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                          <td className="py-3 pr-4 font-medium">{p.nombre}</td>
                          <td className="py-3 pr-4">${(p.cuota || 0).toLocaleString()}</td>
                          <td className="py-3 pr-4">{p.pagado ? <span className="text-green-600 text-xs font-medium">✅ Pagado</span> : <span className="text-red-500 text-xs">❌ Pendiente</span>}</td>
                          <td className="py-3 pr-4 text-gray-500">{p.metodo_pago || '-'}</td>
                          <td className="py-3 pr-4">
                            <button onClick={() => setTokenRevelado(tokenRevelado === p.id ? null : p.id)}
                              className="text-xs text-gray-400 hover:text-gray-600 font-mono">
                              {tokenRevelado === p.id ? p.token : '••••••••'}
                            </button>
                          </td>
                          <td className="py-3"><button onClick={() => eliminar(p.id)} className="text-red-600 hover:underline text-sm">Eliminar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
