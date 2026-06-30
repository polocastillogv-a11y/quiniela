import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { partidos as datosPartidos } from '../data/partidos'
import { generarR32 } from '../utils/llaves'

const LS_KEY = 'quiniela_resultados'

function saveResultadosLocal(partidos) {
  try {
    const r = partidos.filter(p => p.actualizado).map(p => ({
      partido_id: p.id,
      marcador_local: p.marcador_local,
      marcador_visita: p.marcador_visita,
      penal_local: p.penal_local,
      penal_visita: p.penal_visita,
      actualizado: p.actualizado,
    }))
    localStorage.setItem(LS_KEY, JSON.stringify(r))
  } catch (e) {
    console.warn('Error saving to localStorage:', e)
  }
}

function loadResultadosLocal() {
  try {
    const data = localStorage.getItem(LS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function mergeResultados(resultados) {
  return datosPartidos.map(p => {
    const r = resultados.find(r => r.partido_id === p.id)
    return r
      ? { ...p, marcador_local: r.marcador_local, marcador_visita: r.marcador_visita, penal_local: r.penal_local ?? null, penal_visita: r.penal_visita ?? null, actualizado: r.actualizado }
      : p
  })
}

const useQuinielaStore = create((set, get) => ({
  partidos: [],
  predicciones: {},
  loaded: false,
  liveUpdating: false,
  lastLiveUpdate: null,

  init: async () => {
    try {
      const [resR, resP, resE] = await Promise.all([
        supabase.from('resultados').select('*'),
        supabase.from('predicciones').select('*'),
        supabase.from('emparejamientos').select('*'),
      ])

      let merged = datosPartidos.map(p => ({ ...p }))

      // Apply Supabase results first
      if (!resR.error && resR.data?.length > 0) {
        merged = mergeResultados(resR.data)
      }

      // ALWAYS overlay localStorage on top — admin's manual entries take precedence
      const local = loadResultadosLocal()
      if (local.length > 0) {
        merged = merged.map(p => {
          const r = local.find(r => r.partido_id === p.id)
          return r
            ? { ...p, marcador_local: r.marcador_local, marcador_visita: r.marcador_visita, penal_local: r.penal_local ?? null, penal_visita: r.penal_visita ?? null, actualizado: r.actualizado }
            : p
        })
      }

      if (!resE.error && resE.data?.length > 0) {
        for (const e of resE.data) {
          const idx = merged.findIndex(p => p.id === e.partido_id)
          if (idx !== -1) {
            const orig = datosPartidos.find(p => p.id === e.partido_id)
            if (orig && orig.local && orig.visita) continue
            merged[idx] = { ...merged[idx], local: e.local ?? merged[idx].local, visita: e.visita ?? merged[idx].visita }
          }
        }
      }

      const predicciones = {}
      if (!resP.error && resP.data) {
        for (const pr of resP.data) {
          if (!predicciones[pr.participante_id]) predicciones[pr.participante_id] = {}
          predicciones[pr.participante_id][pr.partido_id] = pr.valor
        }
      }

      set({ partidos: merged, predicciones, loaded: true })
    } catch (e) {
      console.warn('Error cargando quiniela:', e)
      const local = loadResultadosLocal()
      set({ partidos: local.length > 0 ? mergeResultados(local) : datosPartidos.map(p => ({ ...p })), predicciones: {}, loaded: true })
    }
  },

  fetchLiveScores: async () => {
    const partidos = get().partidos
    if (partidos.length === 0) return

    set({ liveUpdating: true })
    try {
      const res = await fetch('/api/live-scores?days=7', { cache: 'no-cache' })
      if (!res.ok) throw new Error(`API returned ${res.status}`)

      const data = await res.json()
      const allMatches = data.matches || []
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

        // Don't override manually entered results (admin typed them, live_status is null)
        if (prev.actualizado && prev.live_status === null) return

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
          ftBatch.push({ id: prev.id, local: m.homeScore, visita: m.awayScore, penal_local: prev.penal_local, penal_visita: prev.penal_visita })
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
              penal_local: ft.penal_local ?? null,
              penal_visita: ft.penal_visita ?? null,
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

      if (changed) saveResultadosLocal(get().partidos)
    } catch (err) {
      console.error('Error fetching live scores:', err)
    }
    set({ liveUpdating: false })
  },

  actualizarResultado: async (partidoId, local, visita, penalLocal, penalVisita) => {
    const payload = {
      partido_id: partidoId,
      marcador_local: local,
      marcador_visita: visita,
      penal_local: penalLocal ?? null,
      penal_visita: penalVisita ?? null,
      actualizado: local !== null && visita !== null,
    }
    try {
      await supabase.from('resultados').upsert(payload, { onConflict: 'partido_id' })
    } catch (e) { console.warn('Error guardando resultado:', e) }
    set(state => {
      const partidos = state.partidos.map(p =>
        p.id === partidoId
          ? { ...p, marcador_local: local, marcador_visita: visita, penal_local: penalLocal ?? null, penal_visita: penalVisita ?? null, actualizado: local !== null && visita !== null, live_status: null }
          : p
      )
      saveResultadosLocal(partidos)
      return { partidos }
    })
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

  generarR32: async () => {
    const partidos = get().partidos
    const emparejamientos = generarR32(partidos)
    try {
      await supabase.from('emparejamientos').delete().neq('partido_id', '')
      if (emparejamientos.length > 0) {
        await supabase.from('emparejamientos').insert(emparejamientos)
      }
    } catch (e) { console.warn('Error guardando emparejamientos:', e) }
    set(state => {
      const updated = state.partidos.map(p => {
        const e = emparejamientos.find(emp => emp.partido_id === p.id)
        if (e && (p.local !== e.local || p.visita !== e.visita)) {
          return { ...p, local: e.local ?? p.local, visita: e.visita ?? p.visita }
        }
        return p
      })
      return { partidos: updated }
    })
    return emparejamientos
  },
}))

export default useQuinielaStore
