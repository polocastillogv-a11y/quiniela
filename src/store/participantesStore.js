import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useParticipantesStore = create((set, get) => ({
  participantes: [],
  loaded: false,

  init: async () => {
    const { data } = await supabase.from('participantes').select('*').order('id')
    if (data) set({ participantes: data, loaded: true })
  },

  registrar: async (nombre, token, cuota = 0) => {
    const exists = get().participantes.find(p => p.token === token)
    if (exists) return false
    const current = get().participantes
    const nextId = current.length > 0 ? Math.max(...current.map(p => p.id)) + 1 : 1
    const p = {
      id: nextId, nombre, token, cuota: Number(cuota) || 0,
      pagado: false, fecha_pago: null, metodo_pago: '', referencia: '',
      activo: true, fecha_registro: new Date().toISOString(),
    }
    const { error } = await supabase.from('participantes').insert(p)
    if (error) return false
    set(state => ({ participantes: [...state.participantes, p] }))
    return p
  },

  editar: async (id, datos) => {
    await supabase.from('participantes').update(datos).eq('id', id)
    set(state => ({
      participantes: state.participantes.map(p => p.id === id ? { ...p, ...datos } : p)
    }))
  },

  eliminar: async (id) => {
    await supabase.from('participantes').delete().eq('id', id)
    set(state => ({ participantes: state.participantes.filter(p => p.id !== id) }))
  },

  togglePago: async (id) => {
    const p = get().participantes.find(x => x.id === id)
    if (!p) return
    const pagado = !p.pagado
    const fecha_pago = pagado ? new Date().toISOString() : null
    await supabase.from('participantes').update({ pagado, fecha_pago }).eq('id', id)
    set(state => ({
      participantes: state.participantes.map(x => x.id === id ? { ...x, pagado, fecha_pago } : x)
    }))
  },

  actualizarPago: async (id, pagado, metodo, referencia) => {
    const fecha_pago = pagado ? new Date().toISOString() : null
    await supabase.from('participantes').update({ pagado, metodo_pago: metodo, referencia, fecha_pago }).eq('id', id)
    set(state => ({
      participantes: state.participantes.map(p => p.id === id ? { ...p, pagado, metodo_pago: metodo, referencia, fecha_pago } : p)
    }))
  },

  getParticipante: (id) => get().participantes.find(p => p.id === id),

  getByToken: (token) => get().participantes.find(p => p.token === token),

  getActivos: () => get().participantes.filter(p => p.activo !== false),

  totalBolsa: () => get().participantes.filter(p => p.pagado && p.activo !== false).reduce((s, p) => s + (p.cuota || 0), 0),

  totalEsperado: () => get().participantes.filter(p => p.activo !== false).reduce((s, p) => s + (p.cuota || 0), 0),

  totalPendiente: () => get().totalEsperado() - get().totalBolsa(),
}))

export default useParticipantesStore
