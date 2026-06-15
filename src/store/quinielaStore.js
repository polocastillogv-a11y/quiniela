import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { partidos as datosPartidos, fases } from '../data/partidos'

const GROUP_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L']

function compIdToProjectId(compId) {
  const gIdx = Math.floor((compId - 1) / 6)
  const mIdx = (compId - 1) % 6 + 1
  return `g-${GROUP_LETTERS[gIdx]}-${mIdx}`
}

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
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) return

    set({ liveUpdating: true })
    try {
      const prompt = `Eres un asistente de fútbol. Devuelve SOLO un JSON válido (sin texto extra, sin markdown) con los resultados actuales de los partidos del Mundial 2026.

IDs de los partidos: 1=México vs Sudáfrica, 2=Corea vs Chequia, 7=Canadá vs Bosnia, 13=Brasil vs Marruecos, 19=EEUU vs Paraguay, 20=Australia vs Türkiye, 25=Alemania vs Curazao, 31=Países Bajos vs Japón.

Formato:
{"matches":[{"id":1,"homeScore":2,"awayScore":0,"status":"FT","minute":null}]}

Solo incluye partidos ya jugados o en curso. Si no sabes un resultado, no lo incluyas.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await res.json()
      const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.matches && Array.isArray(parsed.matches)) {
          set(state => {
            const updated = [...state.partidos]
            parsed.matches.forEach(r => {
              const projectId = compIdToProjectId(r.id)
              const idx = updated.findIndex(p => p.id === projectId)
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  marcador_local: r.homeScore ?? updated[idx].marcador_local,
                  marcador_visita: r.awayScore ?? updated[idx].marcador_visita,
                  actualizado: r.status === 'FT' || r.status === 'LIVE' || r.status === 'HT',
                }
              }
            })
            return { partidos: updated, lastLiveUpdate: new Date() }
          })
        }
      }
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
