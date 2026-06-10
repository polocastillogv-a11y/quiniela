import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1

const ADMIN_TOKEN = 'admin2026'

const useParticipantesStore = create(
  persist(
    (set, get) => ({
      participantes: [],
      sesion: { tipo: null, participanteId: null, token: null },

      registrar: (nombre, token, cuota = 0) => {
        const exists = get().participantes.find(p => p.token === token)
        if (exists) return false
        const p = {
          id: nextId++,
          nombre,
          token,
          cuota,
          pagado: false,
          fecha_pago: null,
          metodo_pago: '',
          referencia: '',
          activo: true,
          fecha_registro: new Date().toISOString(),
        }
        set(state => ({ participantes: [...state.participantes, p] }))
        set({ sesion: { tipo: 'participante', participanteId: p.id, token } })
        return true
      },

      login: (token) => {
        if (token === ADMIN_TOKEN) {
          set({ sesion: { tipo: 'admin', participanteId: null, token } })
          return 'admin'
        }
        const p = get().participantes.find(p => p.token === token)
        if (p) {
          set({ sesion: { tipo: 'participante', participanteId: p.id, token } })
          return 'participante'
        }
        return false
      },

      logout: () => {
        set({ sesion: { tipo: null, participanteId: null, token: null } })
      },

      editar: (id, datos) =>
        set(state => ({
          participantes: state.participantes.map(p =>
            p.id === id ? { ...p, ...datos } : p
          ),
        })),

      eliminar: (id) => {
        set(state => ({
          participantes: state.participantes.filter(p => p.id !== id),
          sesion: state.sesion.participanteId === id
            ? { tipo: null, participanteId: null, token: null }
            : state.sesion,
        }))
      },

      togglePago: (id) =>
        set(state => ({
          participantes: state.participantes.map(p =>
            p.id === id
              ? { ...p, pagado: !p.pagado, fecha_pago: !p.pagado ? new Date().toISOString() : null }
              : p
          ),
        })),

      actualizarPago: (id, pagado, metodo, referencia) =>
        set(state => ({
          participantes: state.participantes.map(p =>
            p.id === id ? { ...p, pagado, metodo_pago: metodo, referencia, fecha_pago: pagado ? new Date().toISOString() : null } : p
          ),
        })),

      getParticipante: (id) => get().participantes.find(p => p.id === id),

      getParticipanteByToken: (token) => get().participantes.find(p => p.token === token),

      getActivos: () => get().participantes.filter(p => p.activo !== false),

      totalBolsa: () =>
        get().participantes
          .filter(p => p.pagado && p.activo !== false)
          .reduce((sum, p) => sum + (p.cuota || 0), 0),

      totalEsperado: () =>
        get().participantes
          .filter(p => p.activo !== false)
          .reduce((sum, p) => sum + (p.cuota || 0), 0),

      totalPendiente: () => {
        const s = get()
        return s.totalEsperado() - s.totalBolsa()
      },
    }),
    { name: 'quiniela-participantes' }
  )
)

export default useParticipantesStore
