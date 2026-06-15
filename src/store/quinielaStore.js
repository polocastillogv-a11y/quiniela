import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { partidos as datosPartidos, fases } from '../data/partidos'

const useQuinielaStore = create((set, get) => ({
  partidos: [],
  predicciones: {},
  loaded: false,
  liveUpdating: false,
  lastLiveUpdate: null,

  init: async () => {
    try {
      const [resR, resP] = await Promise.all([
        supabase.from('resultados').select('*'),
        supabase.from('predicciones').select('*'),
      ])

      if (!resR.error) {
        const partidos = datosPartidos.map(p => {
          const r = resR.data?.find(r => r.partido_id === p.id)
          return r ? { ...p, marcador_local: r.marcador_local, marcador_visita: r.marcador_visita, actualizado: r.actualizado } : p
        })
        set({ partidos })
      }

      if (!resP.error && resP.data) {
        const predicciones = {}
        for (const pr of resP.data) {
          if (!predicciones[pr.participante_id]) predicciones[pr.participante_id] = {}
          predicciones[pr.participante_id][pr.partido_id] = pr.valor
        }
        set({ predicciones })
      }
    } catch (e) {
      console.warn('Error cargando quiniela:', e)
    }
    set({ loaded: true })
  },

  fetchLiveScores: async () => {
    const partidos = get().partidos
    if (partidos.length === 0) return

    set({ liveUpdating: true })
    try {
      const res = await fetch('/api/live-scores')
      if (!res.ok) throw new Error(`API returned ${res.status}`)

      const data = await res.json()
      if (!data.matches || !Array.isArray(data.matches)) return

      set(state => {
        const updated = [...state.partidos]
        let changed = false

        data.matches.forEach(m => {
          if (!m.homeAbbrev || !m.awayAbbrev) return
          const idx = updated.findIndex(
            p => p.local === m.homeAbbrev && p.visita === m.awayAbbrev
          )
          if (idx === -1) return
          const prev = updated[idx]
          const sameScore = prev.marcador_local === m.homeScore && prev.marcador_visita === m.awayScore
          if (sameScore && prev.actualizado === (m.status === 'FT')) return

          updated[idx] = {
            ...prev,
            marcador_local: m.homeScore ?? prev.marcador_local,
            marcador_visita: m.awayScore ?? prev.marcador_visita,
            actualizado: m.status === 'FT',
          }
          changed = true
        })

        return changed ? { partidos: updated, lastLiveUpdate: new Date() } : { lastLiveUpdate: new Date() }
      })
    } catch (err) {
      console.error('Error fetching live scores:', err)
    }
    set({ liveUpdating: false })
  },

  actualizarResultado: async (partidoId, local, visita) => {
    const payload = {
      partido_id: partidoId,
      marcador_local: local,
      marcador_visita: visita,
      actualizado: local !== null && visita !== null,
    }
    try {
      await supabase.from('resultados').upsert(payload, { onConflict: 'partido_id' })
    } catch (e) { console.warn('Error guardando resultado:', e) }
    set(state => ({
      partidos: state.partidos.map(p =>
        p.id === partidoId
          ? { ...p, marcador_local: local, marcador_visita: visita, actualizado: local !== null && visita !== null }
          : p
      ),
    }))
  },

  setPrediccion: async (participanteId, partidoId, valor) => {
    if (valor === null) {
      try {
        await supabase.from('predicciones').delete().match({ participante_id: participanteId, partido_id: partidoId })
      } catch (e) { console.warn('Error eliminando predicción:', e) }
      set(state => {
        const preds = { ...state.predicciones }
        if (preds[participanteId]) {
          const inner = { ...preds[participanteId] }
          delete inner[partidoId]
          preds[participanteId] = inner
        }
        return { predicciones: preds }
      })
    } else {
      try {
        await supabase.from('predicciones').upsert(
          { participante_id: participanteId, partido_id: partidoId, valor },
          { onConflict: 'participante_id,partido_id' }
        )
      } catch (e) { console.warn('Error guardando predicción:', e) }
      set(state => {
        const preds = { ...state.predicciones }
        const inner = { ...(preds[participanteId] || {}) }
        inner[partidoId] = valor
        preds[participanteId] = inner
        return { predicciones: preds }
      })
    }
  },

  getPrediccion: (participanteId, partidoId) =>
    get().predicciones[participanteId]?.[partidoId] || null,

  getPrediccionesDeParticipante: (participanteId) =>
    get().predicciones[participanteId] || {},
}))

export default useQuinielaStore
