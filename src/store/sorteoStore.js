import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { equipos } from '../data/equipos'

const useSorteoStore = create((set, get) => ({
  asignaciones: {},
  sorteado: false,
  loaded: false,

  init: async () => {
    try {
      const { data } = await supabase.from('asignaciones').select('*')
      const asignaciones = {}
      for (const a of data || []) {
        if (!asignaciones[a.participante_id]) asignaciones[a.participante_id] = []
        asignaciones[a.participante_id].push(a.equipo_id)
      }
      set({ asignaciones, sorteado: Object.keys(asignaciones).length > 0 })
    } catch (e) {
      console.warn('Error cargando sorteo:', e)
    }
    set({ loaded: true })
  },

  ejecutar: async (participantes) => {
    const activos = participantes.filter(p => p.activo !== false)
    if (activos.length === 0) return

    const shuffled = [...equipos].sort(() => Math.random() - 0.5)
    const rows = []
    const asignaciones = {}
    let idx = 0
    for (const eq of shuffled) {
      const p = activos[idx % activos.length]
      if (!asignaciones[p.id]) asignaciones[p.id] = []
      asignaciones[p.id].push(eq.id)
      rows.push({ participante_id: p.id, equipo_id: eq.id })
      idx++
    }

    try {
      await supabase.from('asignaciones').delete().neq('id', 0)
      await supabase.from('asignaciones').insert(rows)
    } catch (e) { console.warn('Error guardando sorteo:', e) }
    set({ asignaciones, sorteado: true })
  },

  resetear: async () => {
    try {
      await supabase.from('asignaciones').delete().neq('id', 0)
    } catch (e) { console.warn('Error reseteando sorteo:', e) }
    set({ asignaciones: {}, sorteado: false })
  },

  getEquipos: (participanteId) => get().asignaciones[participanteId] || [],
}))

export default useSorteoStore
