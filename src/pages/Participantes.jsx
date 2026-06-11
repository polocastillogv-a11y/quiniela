import { useState } from 'react'
import { KeyIcon, UserPlusIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon, EyeIcon, EyeSlashIcon, TrashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import useParticipantesStore from '../store/participantesStore'
import useSessionStore from '../store/sessionStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

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
      if (result.reason === 'token_exists') { setError('Ese token ya esta registrado'); return }
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
    setError('Token invalido')
  }

  const generadorToken = () => {
    setToken(Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-black text-cesped tracking-tight">Participantes</h1>
        {sesion.tipo && (
          <Button variant="ghost" size="sm" onClick={logout}>
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            {sesion.tipo === 'admin' ? 'Admin' : participantes.find(p => p.id === sesion.participanteId)?.nombre} — Salir
          </Button>
        )}
      </div>

      {!loaded ? (
        <Card><div className="text-center py-8 text-cesped/30"><p>Cargando...</p></div></Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Iniciar Sesion" variant="light">
              <p className="text-sm text-cesped/60 mb-4">Ingresa tu token secreto para acceder.</p>
              {error && <p className="text-tinto text-xs mb-2">{error}</p>}
              <div className="flex gap-2">
                <Input type="text" value={tokenInput} onChange={e => { setTokenInput(e.target.value); setError('') }}
                  placeholder="Tu token" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <Button variant="primary" size="md" onClick={handleLogin}>
                  <KeyIcon className="w-4 h-4" />
                  Entrar
                </Button>
              </div>
            </Card>

            <Card title="Registrarse" variant="light">
              <p className="text-sm text-cesped/60 mb-4">Crea tu cuenta con un token secreto que solo tu conozcas.</p>
              <div className="space-y-3">
                <Input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
                <div className="flex gap-2">
                  <Input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Token secreto" />
                  <Button variant="secondary" size="sm" onClick={generadorToken}>Generar</Button>
                </div>
                <Input type="number" value={cuota} onChange={e => setCuota(e.target.value)} placeholder="Cuota ($) opcional" min="0" />
                {error && <p className="text-tinto text-xs">{error}</p>}
                <Button variant="primary" size="md" className="w-full" onClick={handleRegister}>
                  <UserPlusIcon className="w-4 h-4" />
                  Registrarse
                </Button>
              </div>
            </Card>
          </div>

          {sesion.tipo === 'admin' && (
            <Card title="Admin — Participantes registrados" variant="light">
              {participantes.length === 0 ? (
                <p className="text-cesped/30 text-center py-6">No hay participantes registrados</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-cesped/50 border-b border-cesped/10">
                        <th className="pb-3 font-semibold pr-4">#</th>
                        <th className="pb-3 font-semibold pr-4">Nombre</th>
                        <th className="pb-3 font-semibold pr-4">Cuota</th>
                        <th className="pb-3 font-semibold pr-4">Pago</th>
                        <th className="pb-3 font-semibold pr-4">Metodo</th>
                        <th className="pb-3 font-semibold pr-4">Token</th>
                        <th className="pb-3 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantes.map((p, i) => (
                        <tr key={p.id} className="border-b border-cesped/5 last:border-0 hover:bg-cesped/[0.02]">
                          <td className="py-3 pr-4 text-cesped/40 font-mono text-xs">{i + 1}</td>
                          <td className="py-3 pr-4 font-semibold text-gray-800">{p.nombre}</td>
                          <td className="py-3 pr-4 font-mono text-sm">${(p.cuota || 0).toLocaleString()}</td>
                          <td className="py-3 pr-4">
                            {p.pagado
                              ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-pasto"><CheckCircleIcon className="w-3.5 h-3.5" /> Pagado</span>
                              : <span className="inline-flex items-center gap-1 text-xs font-semibold text-tinto"><XCircleIcon className="w-3.5 h-3.5" /> Pendiente</span>}
                          </td>
                          <td className="py-3 pr-4 text-cesped/50 text-xs">{p.metodo_pago || '—'}</td>
                          <td className="py-3 pr-4">
                            <button onClick={() => setTokenRevelado(tokenRevelado === p.id ? null : p.id)}
                              className="inline-flex items-center gap-1 text-xs font-mono text-cesped/40 hover:text-cesped transition-colors">
                              {tokenRevelado === p.id ? p.token : '••••••••'}
                              {tokenRevelado === p.id ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="py-3">
                            <button onClick={() => eliminar(p.id)}
                              className="inline-flex items-center gap-1 text-xs text-tinto hover:text-tinto/70 transition-colors">
                              <TrashIcon className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                          </td>
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
