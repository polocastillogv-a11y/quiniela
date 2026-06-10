import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useQuinielaStore = create(
  persist(
    (set, get) => ({
      partidos: [],
      pronosticos: [],

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

      guardarPronostico: (participanteId, partidoId, local, visita) =>
        set(state => {
          const existente = state.pronosticos.findIndex(
            pr => pr.participanteId === participanteId && pr.partidoId === partidoId
          )
          let nuevos
          if (existente >= 0) {
            nuevos = [...state.pronosticos]
            nuevos[existente] = { participanteId, partidoId, local, visita }
          } else {
            nuevos = [...state.pronosticos, { participanteId, partidoId, local, visita }]
          }
          return { pronosticos: nuevos }
        }),

      getPronostico: (participanteId, partidoId) =>
        get().pronosticos.find(
          pr => pr.participanteId === participanteId && pr.partidoId === partidoId
        ),

      getPronosticosDeParticipante: (participanteId) =>
        get().pronosticos.filter(pr => pr.participanteId === participanteId),

      getPuntosSorteo: (equiposParticipante) =>
        calcularPuntosSorteo(equiposParticipante),

      getPuntosPronostico: (participanteId) => {
        const pronos = get().getPronosticosDeParticipante(participanteId)
        return calcularPuntosPronostico(pronos)
      },

      getPartidosPorFase: (fase) =>
        get().partidos.filter(p => p.fase === fase),
    }),
    { name: 'quiniela-quiniela' }
  )
)

export default useQuinielaStore
