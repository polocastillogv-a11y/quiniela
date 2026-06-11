import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const ADMIN_TOKEN = 'admin2026'

const useSessionStore = create(
  persist(
    (set) => ({
      tipo: null,
      participanteId: null,
      token: null,

      loginAdmin: () => set({ tipo: 'admin', participanteId: null, token: ADMIN_TOKEN }),

      loginParticipante: (id, token) => set({ tipo: 'participante', participanteId: id, token }),

      logout: () => set({ tipo: null, participanteId: null, token: null }),
    }),
    { name: 'quiniela-sesion' }
  )
)

export { ADMIN_TOKEN }
export default useSessionStore
