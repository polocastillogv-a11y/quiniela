import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { realizarSorteo } from '../utils/sorteo'

const useSorteoStore = create(
  persist(
    (set, get) => ({
      asignaciones: [],
      sorteado: false,
      fechaSorteo: null,

      ejecutarSorteo: (participantes) => {
        const asignaciones = realizarSorteo(participantes)
        set({
          asignaciones,
          sorteado: true,
          fechaSorteo: new Date().toISOString(),
        })
      },

      resetearSorteo: () =>
        set({ asignaciones: [], sorteado: false, fechaSorteo: null }),

      getEquiposDeParticipante: (participanteId) => {
        const a = get().asignaciones.find(a => a.participanteId === participanteId)
        return a ? a.equipos : []
      },
    }),
    { name: 'quiniela-sorteo' }
  )
)

export default useSorteoStore
