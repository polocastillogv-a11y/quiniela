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
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yStr = yesterday.toISOString().split('T')[0].replace(/-/g, '')

      const [res, resY] = await Promise.all([
        fetch('/api/live-scores'),
        fetch(`/api/live-scores?dates=${yStr}`),
      ])
      if (!res.ok) throw new Error(`API returned ${res.status}`)

      const data = await res.json()
      const dataY = resY.ok ? await resY.json() : { matches: [] }
      const allMatches = [...(data.matches || []), ...(dataY.matches || [])]
      if (allMatches.length === 0) return

      const updated = [...partidos]
      const seenKeys = new Set()
      let changed = false
      const ftBatch = []

      allMatches.forEach(m => {
        if (!m.homeAbbrev || !m.awayAbbrev) return
        const key = `${m.homeAbbrev}-${m.awayAbbrev}`
        seenKeys.add(key)
        const idx = updated.findIndex(
          p => p.local === m.homeAbbrev && p.visita === m.awayAbbrev
        )
        if (idx === -1) return
        const prev = updated[idx]

        let newActualizado = prev.actualizado
        let newLiveStatus = prev.live_status
        if (m.status === 'FT') {
          newActualizado = true
          newLiveStatus = 'ft'
        } else if (m.status === 'LIVE') {
          newLiveStatus = 'live'
        } else {
          newLiveStatus = 'ns'
        }

        const sameScore = prev.marcador_local === m.homeScore && prev.marcador_visita === m.awayScore
        if (sameScore && prev.actualizado === newActualizado && prev.live_status === newLiveStatus) return

        updated[idx] = {
          ...prev,
          marcador_local: m.homeScore ?? prev.marcador_local,
          marcador_visita: m.awayScore ?? prev.marcador_visita,
          actualizado: newActualizado,
          live_status: newLiveStatus,
        }
        changed = true

        if (newActualizado && !prev.actualizado) {
          ftBatch.push({ id: prev.id, local: m.homeScore, visita: m.awayScore })
        }
      })

      updated.forEach((p, idx) => {
        if (p.live_status === 'live' && !seenKeys.has(`${p.local}-${p.visita}`)) {
          updated[idx] = { ...p, actualizado: true, live_status: 'ft' }
          changed = true
        }
      })

      if (ftBatch.length > 0) {
        for (const ft of ftBatch) {
          try {
            await supabase.from('resultados').upsert({
              partido_id: ft.id,
              marcador_local: ft.local,
              marcador_visita: ft.visita,
              actualizado: true,
            }, { onConflict: 'partido_id' })
          } catch (e) {
            console.warn('Error persisting live result:', e)
          }
        }
      }

      set({
        partidos: changed ? updated : partidos,
        lastLiveUpdate: new Date(),
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
          ? { ...p, marcador_local: local, marcador_visita: visita, actualizado: local !== null && visita !== null, live_status: null }
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
