import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1

const useParticipantesStore = create(
  persist(
    (set, get) => ({
      participantes: [],

      agregar: (nombre, cuota = 0) => {
        const p = {
          id: nextId++,
          nombre,
          cuota,
          pagado: false,
          fecha_pago: null,
          metodo_pago: '',
          referencia: '',
          activo: true,
          fecha_registro: new Date().toISOString(),
        }
        set(state => ({ participantes: [...state.participantes, p] }))
      },

      editar: (id, datos) =>
        set(state => ({
          participantes: state.participantes.map(p =>
            p.id === id ? { ...p, ...datos } : p
          ),
        })),

      eliminar: (id) =>
        set(state => ({
          participantes: state.participantes.filter(p => p.id !== id),
        })),

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
