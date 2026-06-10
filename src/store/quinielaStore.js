import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useQuinielaStore = create(
  persist(
    (set, get) => ({
      partidos: [],
      predicciones: {},

      setPartidos: (partidos) => set({ partidos }),

      actualizarResultado: (partidoId, local, visita) => {
        set(state => ({
          partidos: state.partidos.map(p =>
            p.id === partidoId
              ? { ...p, marcador_local: local, marcador_visita: visita, actualizado: local !== null && visita !== null }
              : p
          ),
        }))
      },

      setPrediccion: (participanteId, partidoId, valor) =>
        set(state => {
          const preds = { ...state.predicciones }
          if (!preds[participanteId]) preds[participanteId] = {}
          if (valor === null) {
            delete preds[participanteId][partidoId]
          } else {
            preds[participanteId][partidoId] = valor
          }
          return { predicciones: preds }
        }),

      getPrediccion: (participanteId, partidoId) =>
        get().predicciones[participanteId]?.[partidoId] || null,

      getPrediccionesDeParticipante: (participanteId) =>
        get().predicciones[participanteId] || {},
    }),
    { name: 'quiniela-quiniela' }
  )
)

export default useQuinielaStore
